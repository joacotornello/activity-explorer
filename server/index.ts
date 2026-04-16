import { createApp } from './app';

const port = 3001;
const app = createApp();

app.listen(port, () => {
  console.log(`Minimal API listening on http://localhost:${port}`);
});
