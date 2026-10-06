import { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';
import terminalImage from 'terminal-image';
import { profile } from './data.js';

type State = { status: 'loading' } | { status: 'ready'; image: string } | { status: 'failed' };

export function Avatar({ width, onSettled }: { width: number; onSettled?: () => void }) {
    const [state, setState] = useState<State>({ status: 'loading' });

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch(profile.avatar, { signal: AbortSignal.timeout(5000) });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const buffer = new Uint8Array(await res.arrayBuffer());
                const image = await terminalImage.buffer(buffer, { width, preserveAspectRatio: true });
                if (!cancelled) setState({ status: 'ready', image });
            } catch {
                if (!cancelled) setState({ status: 'failed' });
            }
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
