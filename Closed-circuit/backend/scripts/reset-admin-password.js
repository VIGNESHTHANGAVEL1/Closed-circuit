import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { bootstrapDatabase } from '../src/config/bootstrap.js';
import { config } from '../src/config/env.js';
import { findAdminByUsername, createAdminUser, updateAdminPasswordHash } from '../src/models/adminUser.model.js';
import { hashPassword } from '../src/services/auth.service.js';
import { getPool } from '../src/config/database.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function main() {
  const username = process.argv[2]?.trim() || config.auth.adminUsername;
  const password = process.argv[3] || config.auth.adminPassword;

  if (!username || !password) {
    console.error('Usage: node scripts/reset-admin-password.js [username] [password]');
    console.error('If omitted, ADMIN_USERNAME and ADMIN_PASSWORD from .env are used.');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('Password must be at least 8 characters.');
    process.exit(1);
  }

  try {
    await bootstrapDatabase();

    const passwordHash = await hashPassword(password);
    const existing = await findAdminByUsername(username);

    if (existing) {
      await updateAdminPasswordHash(existing.id, passwordHash);
      console.log(`✅ Password updated for admin user: ${username}`);
    } else {
      await createAdminUser({ username, passwordHash, role: 'admin' });
      console.log(`✅ Admin user created: ${username}`);
    }
  } catch (err) {
    console.error(`❌ Failed to reset admin password: ${err.message}`);
    process.exit(1);
  } finally {
    try {
      await getPool().end();
    } catch {
      // ignore
    }
  }
}

main();
