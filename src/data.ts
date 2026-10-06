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
        color: 'whiteBright',
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

export type Project = {
    key: string;
    /** A single-codepoint emoji: ZWJ sequences like 😮‍💨 take a different width in some terminals and break the alignment. */
    icon: string;
    name: string;
    description: string;
    url: string;
    /** Turkish version of the same project, opened for Turkish locales. */
    urlTr?: string;
    color: string;
};

export const projects: Project[] = [
    {
        key: 'bahane',
        icon: '🙊',
        name: 'bahane.si',
        description: 'Excuse generator: pick a ready-made excuse or let AI write one for you',
        url: 'https://bahane.si',
        color: 'yellow',
    },
    {
        key: 'bahaneni',
        icon: '🙅',
        name: 'bahaneni.si',
        description: 'The anti-excuse site: send one link and let the picture do the talking',
        url: 'https://bahaneni.si',
        color: 'redBright',
    },
    {
        key: 'derdini',
        icon: '😩',
        name: 'derdini.si',
        description: 'One answer to tiny troubles: a shareable link for petty complaints',
        url: 'https://derdini.si',
        color: 'magentaBright',
    },
    {
        key: 'tavsiye',
        icon: '🧓',
        name: 'tavsiye.si',
        description: "Advice nobody asked for, from your big brother, auntie, mom and more",
        url: 'https://tavsiye.si',
        color: 'cyanBright',
    },
    {
        key: 'rps',
        icon: '✊',
        name: 'Rock Paper Scissors Online',
        description: 'Play with friends via invite link or room code (TR: taskagitmakas.online)',
        url: 'https://rock.paperscissors.online',
        urlTr: 'https://taskagitmakas.online',
        color: 'greenBright',
    },
];

const isTurkish = () => {
    const locale = process.env.LC_ALL || process.env.LC_MESSAGES || process.env.LANG || Intl.DateTimeFormat().resolvedOptions().locale;
    return /^tr\b|^tr[-_]/i.test(locale);
};

export const projectUrl = (project: Project) => (project.urlTr && isTurkish() ? project.urlTr : project.url);
