import mysql from 'mysql2/promise';
import { config } from './env.js';
import {
  validateRequiredEnv,
  validateSpacesConfig,
} from './validateEnv.js';
import { initializePool, getPool } from './database.js';
import { runSafeMigrations } from './migrate.js';

export async function ensureDatabaseExists() {
  const { host, user, password, database } = config.db;
  let connection;

  try {
    connection = await mysql.createConnection({ host, user, password });
    const [rows] = await connection.query(
      'SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?',
      [database]
    );

    if (rows.length === 0) {
      await connection.query(
        `CREATE DATABASE \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
      );
      console.log(`✅ Database created: ${database}`);
    } else {
      console.log(`✅ Database created or already exists: ${database}`);
    }
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

export async function bootstrapDatabase({ skipEnvValidation = false } = {}) {
  if (!skipEnvValidation) {
    validateRequiredEnv();
    validateSpacesConfig();
  }

  await ensureDatabaseExists();
  await initializePool();

  const pool = getPool();
  await pool.query('SELECT 1');
  console.log('✅ Database connected');

  try {
    const columnsAdded = await runSafeMigrations(pool);
    console.log('✅ Tables checked');
    if (columnsAdded > 0) {
      console.log(`✅ Missing columns migrated (${columnsAdded} added)`);
    } else {
      console.log('✅ Missing columns migrated');
    }
  } catch (err) {
    const error = new Error(`Migration failed: ${err.message}`);
    error.code = 'MIGRATION_FAILED';
    error.cause = err;
    throw error;
  }
}
