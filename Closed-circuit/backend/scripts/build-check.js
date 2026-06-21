import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import {
  backendRoot,
  validateProjectFiles,
  validateRequiredEnv,
  validateSpacesConfig,
} from '../src/config/validateEnv.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

dotenv.config({ path: path.join(root, '.env') });

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

function pass(message) {
  console.log(`✅ ${message}`);
}

async function verifyDatabaseConnection() {
  const host = process.env.DB_HOST;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME;

  let serverConnection;

  try {
    serverConnection = await mysql.createConnection({ host, user, password });
    await serverConnection.query('SELECT 1');
    pass('MySQL server connection verified');
  } catch (err) {
    fail(`Database connection failed: ${err.message}`);
  }

  try {
    const [rows] = await serverConnection.query(
      'SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?',
      [database]
    );

    if (rows.length === 0) {
      pass(`Database "${database}" will be created automatically on startup`);
      return;
    }

    await serverConnection.query(`USE \`${database}\``);
    await serverConnection.query('SELECT 1');
    pass(`Database "${database}" connection verified`);
  } catch (err) {
    fail(`Database connection failed: ${err.message}`);
  } finally {
    if (serverConnection) {
      await serverConnection.end();
    }
  }
}

async function main() {
  console.log('Running production build check...\n');

  try {
    validateProjectFiles(backendRoot);
    pass('Required project files found');
  } catch (err) {
    fail(err.message);
  }

  try {
    validateRequiredEnv();
    pass('Required environment variables present');
  } catch (err) {
    fail(err.message);
  }

  try {
    validateSpacesConfig();
    pass('DigitalOcean Spaces configuration present');
  } catch (err) {
    fail(err.message);
  }

  await verifyDatabaseConnection();

  console.log('\n✅ Production build check passed');
}

main().catch((err) => {
  fail(err.message || 'Build check failed');
});
