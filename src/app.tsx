import { useState, type ReactNode } from 'react';
import { Box, Text, useApp, useInput, useStdin, useWindowSize } from 'ink';
import Gradient from 'ink-gradient';
import Link from 'ink-link';
import open from 'open';
import { Avatar } from './avatar.js';
import { links, profile, projects, projectUrl } from './data.js';

type View = 'main' | 'projects';

// Main menu: the profile links, then the projects entry, then "bye".
const PROJECTS = links.length;
const BYE = links.length + 1;
const MAIN_COUNT = links.length + 2;
// Projects menu: every project, then "back".
const BACK = projects.length;
const PROJECTS_COUNT = projects.length + 1;

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

function Option({ active, color, children }: { active: boolean; color?: string; children: ReactNode }) {
    return (
        <Text bold={active} color={active ? color : undefined} dimColor={!active}>
            {active ? '❯ ' : '  '}
            {children}
        </Text>
    );
}

function Menu({ selected }: { selected: number }) {
    return (
        <Box flexDirection="column">
            <Text bold>Do you want to learn more about me?</Text>
            <Box flexDirection="column" marginTop={1}>
                {links.map((item, i) => (
                    <Option key={item.key} active={i === selected} color={item.color}>
                        {item.icon}  {item.title} ({item.label})
                    </Option>
                ))}
                <Option active={selected === PROJECTS} color="magentaBright">
                    🚀  Things I've built ({projects.length} projects) ›
                </Option>
                <Option active={selected === BYE} color="red">
                    👋  Nope. Bye.
                </Option>
            </Box>
        </Box>
    );
}

function Projects({ selected }: { selected: number }) {
    return (
        <Box flexDirection="column">
            <Text bold>Things I've built — pick one to open it</Text>
            <Box flexDirection="column" marginTop={1}>
                {projects.map((project, i) => {
                    const active = i === selected;
                    return (
                        <Box key={project.key} flexDirection="column">
                            <Option active={active} color={project.color}>
                                {project.icon}  {project.name}
                            </Option>
                            <Box paddingLeft={6}>
                                <Text dimColor={!active} color={active ? 'white' : undefined} wrap="truncate-end">
                                    {project.description}
                                </Text>
                            </Box>
                        </Box>
                    );
                })}
                <Box marginTop={1}>
                    <Option active={selected === BACK} color="yellow">
                        {'←   Back'}
                    </Option>
                </Box>
            </Box>
        </Box>
    );
}

export function App() {
    const { exit } = useApp();
    const { isRawModeSupported } = useStdin();
    const { columns } = useWindowSize();
    const [view, setView] = useState<View>('main');
    const [selected, setSelected] = useState(0);
    const [farewell, setFarewell] = useState<string | null>(null);

    const narrow = columns < 90;
    const cardWidth = Math.min(columns, 110);

    const openUrl = async (label: string, url: string) => {
        setFarewell(`✔ Opening ${label} in your browser… see you there!`);
        await open(url).catch(() => {});
        setTimeout(exit, 50);
    };

    const switchView = (next: View) => {
        setView(next);
        setSelected(next === 'projects' ? 0 : PROJECTS);
    };

    const choose = (index: number) => {
        if (view === 'projects') {
            const project = projects[index];
            if (project) void openUrl(project.name, projectUrl(project));
            else switchView('main');
            return;
        }
        const item = links[index];
        if (item) void openUrl(item.label, item.url);
        else if (index === PROJECTS) switchView('projects');
        else {
            setFarewell('👋 Bye! Thanks for stopping by.');
            setTimeout(exit, 50);
        }
    };

    useInput(
        (input, key) => {
            const count = view === 'projects' ? PROJECTS_COUNT : MAIN_COUNT;
            if (key.upArrow || input === 'k') setSelected(s => (s - 1 + count) % count);
            else if (key.downArrow || input === 'j' || key.tab) setSelected(s => (s + 1) % count);
            else if (key.return || (key.rightArrow && view === 'main' && selected === PROJECTS)) choose(selected);
            else if (view === 'projects' && (key.escape || key.leftArrow || key.backspace)) switchView('main');
            else if (key.escape || input === 'q') exit();
            else if (input === 'p' && view === 'main') switchView('projects');
            else if (/^[1-9]$/.test(input) && Number(input) <= count) choose(Number(input) - 1);
        },
        { isActive: isRawModeSupported && farewell === null },
    );

    return (
        <Box flexDirection="column" width={cardWidth} paddingX={1}>
            <Box borderStyle="round" borderColor="magenta" paddingX={2} paddingY={1} flexDirection={narrow ? 'column' : 'row'} gap={narrow ? 1 : 3}>
                <Avatar size={narrow ? 14 : 20} onSettled={isRawModeSupported ? undefined : () => setTimeout(exit, 50)} />
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
                    view === 'projects' ? <Projects selected={selected} /> : <Menu selected={selected} />
                ) : (
                    <Box flexDirection="column">
                        {links.map(item => (
                            <Text key={item.key}>
                                {item.icon}  {item.label}: <Text color={item.color}>{item.url}</Text>
                            </Text>
                        ))}
                        <Box flexDirection="column" marginTop={1}>
                            <Text bold>Things I've built</Text>
                            {projects.map(project => (
                                <Text key={project.key}>
                                    {project.icon}  {project.name}: <Text color={project.color}>{projectUrl(project)}</Text>
                                </Text>
                            ))}
                        </Box>
                    </Box>
                )}
            </Box>

            {isRawModeSupported && !farewell && (
                <Box paddingX={1} marginTop={1}>
                    <Text dimColor>
                        {view === 'projects'
                            ? `↑/↓ navigate · enter open · 1-${PROJECTS_COUNT} quick pick · esc back`
                            : `↑/↓ navigate · enter open · p projects · 1-${MAIN_COUNT} quick pick · q quit`}
                    </Text>
                </Box>
            )}
        </Box>
    );
}
