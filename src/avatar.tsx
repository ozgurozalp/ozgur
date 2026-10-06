import { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';
import terminalImage from 'terminal-image';
import supportsTerminalGraphics from 'supports-terminal-graphics';
import { profile } from './data.js';

/** True when the terminal can show the real photo (Kitty, Ghostty, WezTerm, iTerm2, VS Code…). */
export const canDrawPhoto = supportsTerminalGraphics.stdout.kitty || supportsTerminalGraphics.stdout.iterm2;

let avatarRequest: Promise<Uint8Array | null> | undefined;

export function fetchAvatar() {
    avatarRequest ??= fetch(profile.avatar, { signal: AbortSignal.timeout(5000) })
        .then(async res => (res.ok ? new Uint8Array(await res.arrayBuffer()) : null))
        .catch(() => null);
    return avatarRequest;
}

/**
 * Draws the full-resolution photo with the terminal's own graphics protocol.
 * It has to happen outside Ink: Ink measures and re-wraps everything it renders,
 * which would break the image escape sequences.
 */
export async function drawPhoto(columns: number) {
    const buffer = await fetchAvatar();
    if (!buffer) return false;
    try {
        if (supportsTerminalGraphics.stdout.iterm2) {
            // iTerm2 inline image protocol (also WezTerm, VS Code, mintty…); accepts the JPEG as is.
            const data = Buffer.from(buffer).toString('base64');
            process.stdout.write(`  \u001B]1337;File=inline=1;width=${columns};preserveAspectRatio=1;size=${buffer.length}:${data}\u0007\n`);
        } else {
            // Kitty graphics protocol: terminal-image converts to PNG and writes it to stdout itself.
            process.stdout.write('  ');
            await terminalImage.buffer(buffer, { width: columns, preserveAspectRatio: true });
            process.stdout.write('\n');
        }
        return true;
    } catch {
        return false;
    }
}

type State = { status: 'loading' } | { status: 'ready'; image: string } | { status: 'failed' };

/** Half-block (▄) rendering of the photo, for terminals without image support. */
export function Avatar({ width, onSettled }: { width: number; onSettled?: () => void }) {
    const [state, setState] = useState<State>({ status: 'loading' });

    useEffect(() => {
        let cancelled = false;
        (async () => {
            const buffer = await fetchAvatar();
            const image = buffer
                ? await terminalImage
                      .buffer(buffer, { width, preserveAspectRatio: true, preferNativeRender: false })
                      .catch(() => null)
                : null;
            if (!cancelled) setState(image ? { status: 'ready', image } : { status: 'failed' });
        })();
        return () => {
            cancelled = true;
        };
    }, [width]);

    useEffect(() => {
        if (state.status !== 'loading') onSettled?.();
    }, [state.status]);

    if (state.status === 'ready') {
        return (
            <Box flexShrink={0}>
                <Text>{state.image}</Text>
            </Box>
        );
    }

    return (
        <Box flexShrink={0} width={width} height={Math.round(width / 2)} alignItems="center" justifyContent="center">
            {state.status === 'loading' ? (
                <Text color="magenta">
                    <Spinner type="dots" />
                </Text>
            ) : (
                <Text color="gray">( ◕‿◕ )</Text>
            )}
        </Box>
    );
}
