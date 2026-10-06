import { useState } from 'react';
import { Box, Text, useApp, useInput, useStdin, useWindowSize } from 'ink';
import Gradient from 'ink-gradient';
import Link from 'ink-link';
import open from 'open';
import { Avatar } from './avatar.js';
import { links, profile } from './data.js';

const BYE = links.length;

function Bio() {
    return (
        <Box flexDirection="column" gap={1}>
            <Text>
                Hello, this is <Text bold color="blueBright">{profile.name}</Text>!
            </Text>
            <Text>
                I'm a passionate <Text bold color="white" backgroundColor="red"> software developer </Text> living in{' '}
                <Text bold>{profile.location}</Text>.
            </Text>
            <Text>
                I love <Text bold underline color="green">open source development</Text> and I build things on my GitHub
                profile{' '}
                <Link url="https://github.com/ozgurozalp" fallback={false}>
                    <Text bold color="red">github.com/ozgurozalp</Text>
                </Link>
                .
            </Text>
            <Text>
                I love <Text bold color="yellow">JavaScript</Text> and <Text bold color="red">PHP</Text>.
            </Text>
        </Box>
    );
}

function Menu({ selected }: { selected: number }) {
    return (
        <Box flexDirection="column">
            <Text bold>Do you want to learn more about me?</Text>
            <Box flexDirection="column" marginTop={1}>
                {links.map((item, i) => {
                    const active = i === selected;
                    return (
                        <Text key={item.key} bold={active} color={active ? item.color : undefined} dimColor={!active}>
                            {active ? '❯ ' : '  '}
                            {item.icon}  {item.title} ({item.label})
                        </Text>
                    );
                })}
                <Text bold={selected === BYE} color={selected === BYE ? 'red' : undefined} dimColor={selected !== BYE}>
                    {selected === BYE ? '❯ ' : '  '}👋  Nope. Bye.
                </Text>
            </Box>
        </Box>
    );
}

export function App({ showAvatar = true }: { showAvatar?: boolean }) {
    const { exit } = useApp();
    const { isRawModeSupported } = useStdin();
    const { columns } = useWindowSize();
    const [selected, setSelected] = useState(0);
    const [farewell, setFarewell] = useState<string | null>(null);

    const narrow = columns < 90;
    const cardWidth = Math.min(columns, 110);

    const choose = async (index: number) => {
        const item = links[index];
        if (item) {
            setFarewell(`✔ Opening ${item.label} in your browser… see you there!`);
            await open(item.url).catch(() => {});
        } else {
            setFarewell('👋 Bye! Thanks for stopping by.');
        }
        setTimeout(exit, 50);
    };

    useInput(
        (input, key) => {
            const count = links.length + 1;
            if (key.upArrow || input === 'k') setSelected(s => (s - 1 + count) % count);
            else if (key.downArrow || input === 'j' || key.tab) setSelected(s => (s + 1) % count);
            else if (key.return) void choose(selected);
            else if (key.escape || input === 'q') exit();
            else if (/^[1-9]$/.test(input) && Number(input) <= count) void choose(Number(input) - 1);
        },
        { isActive: isRawModeSupported && farewell === null },
    );

    return (
        <Box flexDirection="column" width={cardWidth} paddingX={1}>
            <Box borderStyle="round" borderColor="magenta" paddingX={2} paddingY={1} flexDirection={narrow ? 'column' : 'row'} gap={narrow ? 1 : 3}>
                {showAvatar ? (
                    <Avatar width={narrow ? 24 : 36} onSettled={isRawModeSupported ? undefined : () => setTimeout(exit, 50)} />
                ) : null}
                <Box flexDirection="column" flexShrink={1} gap={1}>
                    <Box flexDirection="column">
                        <Gradient name="pastel">
                            <Text bold>{profile.name}</Text>
                        </Gradient>
                        <Text color="gray">
                            {profile.role} · {profile.location}
                        </Text>
                    </Box>
                    <Bio />
                </Box>
            </Box>

            <Box marginTop={1} paddingX={1}>
                {farewell ? (
                    <Text color="green">{farewell}</Text>
                ) : isRawModeSupported ? (
                    <Menu selected={selected} />
                ) : (
                    <Box flexDirection="column">
                        {links.map(item => (
                            <Text key={item.key}>
                                {item.icon}  {item.label}: <Text color={item.color}>{item.url}</Text>
                            </Text>
                        ))}
                    </Box>
                )}
            </Box>

            {isRawModeSupported && !farewell && (
                <Box paddingX={1} marginTop={1}>
                    <Text dimColor>↑/↓ navigate · enter open · 1-{links.length + 1} quick pick · q quit</Text>
                </Box>
            )}
        </Box>
    );
}
