import { render } from 'ink';
import { App } from './app.js';

const { waitUntilExit } = render(<App />, { exitOnCtrlC: true });

await waitUntilExit();
