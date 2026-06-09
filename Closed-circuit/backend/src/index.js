import { config } from './config/env.js';
import { bootstrapDatabase } from './config/bootstrap.js';
import { createApp } from './app.js';
import { seedDefaultAdmin } from './scripts/seedAdmin.js';
import { seedDefaultTemplates } from './scripts/seedTemplates.js';
import { ensureClientFoldersExist } from './services/spaces.service.js';
import { startCallReminderScheduler } from './schedulers/callReminderScheduler.js';

function exitWithError(message, code = 1) {
  console.error(`❌ ${message}`);
  process.exit(code);
}

function handleStartupError(err) {
  if (err.code === 'MISSING_ENV') {
    exitWithError(`Missing required environment variables: ${err.missing.join(', ')}`);
  }

  if (err.code === 'MISSING_SPACES_CONFIG') {
    exitWithError(`DigitalOcean Spaces configuration incomplete: ${err.missing.join(', ')}`);
  }

  if (err.code === 'MIGRATION_FAILED') {
    exitWithError(err.message);
  }

  if (err.code === 'ECONNREFUSED' || err.code === 'ER_ACCESS_DENIED_ERROR') {
    exitWithError(`Database connection failed: ${err.message}`);
  }

  if (err.code === 'EADDRINUSE') {
    exitWithError(`Port ${config.port} is already in use`);
  }

  exitWithError(err.message || 'Backend startup failed');
}

try {
  await bootstrapDatabase();
  await seedDefaultAdmin();
  await seedDefaultTemplates();
  await ensureClientFoldersExist();

  const app = createApp();
  startCallReminderScheduler();

  await new Promise((resolve, reject) => {
    const server = app.listen(config.port, () => resolve(server));
    server.on('error', reject);
  });

  console.log(`✅ Backend ready on PORT ${config.port}`);
} catch (err) {
  handleStartupError(err);
}
