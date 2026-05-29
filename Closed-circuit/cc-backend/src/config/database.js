import mysql from 'mysql2/promise';
import { config } from './env.js';

export const db = mysql.createPool(config.db);
