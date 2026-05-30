import { config } from './config/env.js';
import { createApp } from './app.js';
import { seedDefaultAdmin } from './scripts/seedAdmin.js';
import { ensureClientFoldersExist } from './services/spaces.service.js';

const app = createApp();

await seedDefaultAdmin();
await ensureClientFoldersExist();

app.listen(config.port, () => {
  console.log(`Backend running on port ${config.port}`);
});
