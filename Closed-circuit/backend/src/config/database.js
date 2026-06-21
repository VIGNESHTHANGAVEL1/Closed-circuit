import mysql from 'mysql2/promise';
import { config } from './env.js';

let pool = null;

export function getPool() {
  if (!pool) {
    throw new Error('Database pool is not initialized. Run bootstrapDatabase() first.');
  }
  return pool;
}

export async function initializePool() {
  if (pool) {
    return pool;
  }

  pool = mysql.createPool({
    ...config.db,
    waitForConnections: true,
    connectionLimit: 10,
  });

  return pool;
}

export const db = {
  query(...args) {
    return getPool().query(...args);
  },
};
