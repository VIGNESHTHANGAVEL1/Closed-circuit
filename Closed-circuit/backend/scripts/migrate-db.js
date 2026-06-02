import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { bootstrapDatabase } from '../src/config/bootstrap.js';
import { getPool } from '../../cc-backend/src/config/database.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

dotenv.config({ path: path.join(root, '.env') });

async function main() {
  console.log('Running database migrations...\n');

  try {
    await bootstrapDatabase();
    console.log('\n✅ Migration complete');
  } catch (err) {
    console.error(`❌ Migration failed: ${err.message}`);
    process.exit(1);
  } finally {
    try {
      const pool = getPool();
      await pool.end();
    } catch {
      // pool may not exist if bootstrap failed early
    }
  }
}

main();
