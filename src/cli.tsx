import { render } from 'ink';
import { App } from './app.js';
import { canDrawPhoto, drawPhoto, fetchAvatar } from './avatar.js';

fetchAvatar();

// Terminals with image support get the real, sharp photo above the card;
// everything else gets the half-block version inside the card.
const photoDrawn = canDrawPhoto && (await drawPhoto(30));

const { waitUntilExit } = render(<App showAvatar={!photoDrawn} />, { exitOnCtrlC: true });

await waitUntilExit();
