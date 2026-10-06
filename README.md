# ozgur

My personal business card, right in your terminal.

```sh
npx ozgur
```

A small interactive TUI built with [Ink](https://github.com/vadimdemedes/ink) and React: it shows my avatar, a short intro and lets you jump to my GitHub, X or LinkedIn profile, or browse the side projects I've built ([bahane.si](https://bahane.si), [bahaneni.si](https://bahaneni.si), [derdini.si](https://derdini.si), [tavsiye.si](https://tavsiye.si) and [Rock Paper Scissors Online](https://rock.paperscissors.online) / [taskagitmakas.online](https://taskagitmakas.online)).

| Key         | Action             |
| ----------- | ------------------ |
| `↑` / `↓`   | Move the selection |
| `enter`     | Open the link      |
| `p`         | Show my projects   |
| `1`–`9`     | Quick pick         |
| `esc` / `←` | Back (in projects) |
| `q` / `esc` | Quit               |

## Development

Requires Node.js 22 or newer.

```sh
npm install
npm run dev      # rebuild on change
npm start        # run the built CLI
npm run typecheck
```
