import { db } from '../config/database.js';

export async function insertVerificationSession({
  token,
  channel,
  identifier,
  clientName,
  expiresAt,
}) {
  const [result] = await db.query(
    `INSERT INTO verification_sessions (token, channel, identifier, client_name, expires_at)
     VALUES (?, ?, ?, ?, ?)`,
    [token, channel, identifier, clientName, expiresAt]
  );
  return result.insertId;
}

export async function findValidVerificationSession(token, channel, identifier) {
  const [rows] = await db.query(
    `SELECT id, token, channel, identifier, client_name, expires_at
     FROM verification_sessions
     WHERE token = ? AND channel = ? AND identifier = ? AND expires_at > NOW()
     LIMIT 1`,
    [token, channel, identifier]
  );
  return rows[0] || null;
}

export async function deleteVerificationSession(token) {
  await db.query(`DELETE FROM verification_sessions WHERE token = ?`, [token]);
}
