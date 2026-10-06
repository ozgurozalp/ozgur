import { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';
import { Jimp } from 'jimp';
import { profile } from './data.js';

type Pixels = string[][];
type State = { status: 'loading' } | { status: 'ready'; pixels: Pixels } | { status: 'failed' };

const hex = (n: number) => Math.round(Math.min(255, Math.max(0, n))).toString(16).padStart(2, '0');

/**
 * Turns the photo into a `size`×`size` grid of hex colours. Every grid cell is the
 * average of its block of source pixels, with a little extra contrast so each
 * pixel reads as a clear, flat block of colour.
 */
async function pixelate(buffer: ArrayBuffer, size: number): Promise<Pixels> {
    const { bitmap } = await Jimp.fromBuffer(Buffer.from(buffer));
    const { width, height, data } = bitmap;
    const side = Math.min(width, height);
    const ox = Math.floor((width - side) / 2);
    const oy = Math.floor((height - side) / 2);
    const contrast = 1.15;

    const rows: Pixels = [];
    for (let gy = 0; gy < size; gy++) {
        const row: string[] = [];
        for (let gx = 0; gx < size; gx++) {
            const x0 = ox + Math.floor((gx * side) / size);
            const x1 = ox + Math.floor(((gx + 1) * side) / size);
            const y0 = oy + Math.floor((gy * side) / size);
            const y1 = oy + Math.floor(((gy + 1) * side) / size);
            let r = 0, g = 0, b = 0, n = 0;
            for (let y = y0; y < y1; y++) {
                for (let x = x0; x < x1; x++) {
                    const i = (y * width + x) * 4;
                    r += data[i]!;
                    g += data[i + 1]!;
                    b += data[i + 2]!;
                    n++;
                }
            }
            const c = (v: number) => (v / n - 128) * contrast + 128;
            row.push(`#${hex(c(r))}${hex(c(g))}${hex(c(b))}`);
        }
        rows.push(row);
    }
    return rows;
}

/** Pixel-art avatar: every pixel is two terminal cells wide, so it stays square. */
export function Avatar({ size, onSettled }: { size: number; onSettled?: () => void }) {
    const [state, setState] = useState<State>({ status: 'loading' });

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch(profile.avatar, { signal: AbortSignal.timeout(5000) });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const pixels = await pixelate(await res.arrayBuffer(), size);
                if (!cancelled) setState({ status: 'ready', pixels });
            } catch {
                if (!cancelled) setState({ status: 'failed' });
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [size]);

    useEffect(() => {
        if (state.status !== 'loading') onSettled?.();
    }, [state.status]);

    if (state.status === 'ready') {
        return (
            <Box flexDirection="column" flexShrink={0}>
                {state.pixels.map((row, y) => (
                    <Text key={y}>
                        {row.map((color, x) => (
                            <Text key={x} backgroundColor={color}>
                                {'  '}
                            </Text>
                        ))}
                    </Text>
                ))}
            </Box>
        );
    }

    return (
        <Box flexShrink={0} width={size * 2} height={size} alignItems="center" justifyContent="center">
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
