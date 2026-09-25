import { db } from '../config/database.js';

export async function deleteExpiredOtps() {
  await db.query(`DELETE FROM verification_otps WHERE expires_at < NOW()`);
}

export async function deleteOtpsForIdentifier(channel, identifier) {
  await db.query(
    `DELETE FROM verification_otps WHERE channel = ? AND identifier = ?`,
    [channel, identifier]
  );
}

export async function expireActiveOtpsForIdentifier(channel, identifier) {
  await db.query(
    `UPDATE verification_otps SET expires_at = NOW()
     WHERE channel = ? AND identifier = ? AND expires_at > NOW()`,
    [channel, identifier]
  );
}

export async function countRecentOtpSends(channel, identifier, windowMinutes = 15) {
  const [rows] = await db.query(
    `SELECT COUNT(*) AS total FROM verification_otps
     WHERE channel = ? AND identifier = ? AND created_at > DATE_SUB(NOW(), INTERVAL ? MINUTE)`,
    [channel, identifier, windowMinutes]
  );
  return rows[0]?.total || 0;
}

export async function secondsSinceLastOtpSend(channel, identifier) {
  const [rows] = await db.query(
    `SELECT TIMESTAMPDIFF(SECOND, MAX(created_at), NOW()) AS seconds
     FROM verification_otps WHERE channel = ? AND identifier = ?`,
    [channel, identifier]
  );
  const value = rows[0]?.seconds;
  return value === null || value === undefined ? null : Number(value);
}

export async function insertVerificationOtp({
  channel,
  identifier,
  clientName,
  otpHash,
  expiresAt,
}) {
  await expireActiveOtpsForIdentifier(channel, identifier);
  const [result] = await db.query(
    `INSERT INTO verification_otps (channel, identifier, client_name, otp_hash, expires_at)
     VALUES (?, ?, ?, ?, ?)`,
    [channel, identifier, clientName, otpHash, expiresAt]
  );
  return result.insertId;
}

export async function findValidOtp(channel, identifier, otpHash) {
  const [rows] = await db.query(
    `SELECT id, channel, identifier, client_name, otp_hash, expires_at
     FROM verification_otps
     WHERE channel = ? AND identifier = ? AND otp_hash = ? AND expires_at > NOW()
     ORDER BY id DESC
     LIMIT 1`,
    [channel, identifier, otpHash]
  );
  return rows[0] || null;
}
