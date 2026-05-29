import { config } from './config/env.js';
import { createApp } from './app.js';
import { seedDefaultAdmin } from './scripts/seedAdmin.js';

const app = createApp();

await seedDefaultAdmin();

app.listen(config.port, () => {
  console.log(`Backend running on port ${config.port}`);
});
