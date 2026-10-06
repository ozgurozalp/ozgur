# ozgur

My personal business card, right in your terminal.

```sh
npx ozgur
```

A small interactive TUI built with [Ink](https://github.com/vadimdemedes/ink) and React: it shows my avatar, a short intro and lets you jump to my GitHub, X or LinkedIn profile.

| Key         | Action             |
| ----------- | ------------------ |
| `↑` / `↓`   | Move the selection |
| `enter`     | Open the link      |
| `1`–`4`     | Quick pick         |
| `q` / `esc` | Quit               |

## Development

Requires Node.js 22 or newer.

```sh
npm install
npm run dev      # rebuild on change
npm start        # run the built CLI
npm run typecheck
```
