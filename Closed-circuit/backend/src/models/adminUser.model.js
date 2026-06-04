import { db } from '../config/database.js';

export async function findAdminByUsername(username) {
  const [rows] = await db.query(
    `SELECT id, username, password_hash, role, created_at, updated_at
     FROM admin_users
     WHERE username = ?
     LIMIT 1`,
    [username]
  );
  return rows[0] || null;
}

export async function findAdminById(id) {
  const [rows] = await db.query(
    `SELECT id, username, password_hash, role, created_at, updated_at
     FROM admin_users
     WHERE id = ?
     LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

export async function updateAdminPasswordHash(id, passwordHash) {
  const [result] = await db.query(
    `UPDATE admin_users SET password_hash = ? WHERE id = ?`,
    [passwordHash, id]
  );
  return result.affectedRows > 0;
}

export async function countAdminUsers() {
  const [rows] = await db.query('SELECT COUNT(*) AS total FROM admin_users');
  return rows[0]?.total || 0;
}

export async function createAdminUser({ username, passwordHash, role = 'admin' }) {
  const [result] = await db.query(
    `INSERT INTO admin_users (username, password_hash, role)
     VALUES (?, ?, ?)`,
    [username, passwordHash, role]
  );
  return result.insertId;
}
