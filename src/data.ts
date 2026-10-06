export const profile = {
    name: 'Özgür ÖZALP',
    role: 'Software Developer',
    location: 'Istanbul, Turkey',
    avatar: 'https://avatars.githubusercontent.com/u/21113261?s=600&v=4',
};

export type LinkItem = {
    key: string;
    icon: string;
    label: string;
    title: string;
    url: string;
    color: string;
};

export const links: LinkItem[] = [
    {
        key: 'github',
        icon: '💻',
        label: 'GitHub',
        title: 'What am I doing about Open Source?',
        url: 'https://github.com/ozgurozalp',
        color: 'gray',
    },
    {
        key: 'x',
        icon: '🐦',
        label: 'X (Twitter)',
        title: 'What do I think?',
        url: 'https://x.com/ozqurozalp',
        color: 'cyan',
    },
    {
        key: 'linkedin',
        icon: '🏹',
        label: 'LinkedIn',
        title: 'Curriculum vitae, the path of my life',
        url: 'https://linkedin.com/in/ozgurozalp',
        color: 'blue',
    },
];
