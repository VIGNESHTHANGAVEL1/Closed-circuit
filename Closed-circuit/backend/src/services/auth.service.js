import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import {
  findAdminByUsername,
  findAdminById,
  updateAdminPasswordHash,
  updateAdminPasswordHashByUsername,
} from '../models/adminUser.model.js';
import { FIXED_ADMIN_USERNAMES, normalizeAdminRole } from '../constants/adminRoles.js';

export async function authenticateAdmin(username, password) {
  const admin = await findAdminByUsername(username);

  if (!admin) {
    return null;
  }

  const isValid = await bcrypt.compare(password, admin.password_hash);

  if (!isValid) {
    return null;
  }

  return {
    id: admin.id,
    username: admin.username,
    role: admin.role,
  };
}

export function createAccessToken(user) {
  return jwt.sign(
    { sub: user.id, username: user.username, role: user.role },
    config.auth.jwtSecret,
    { expiresIn: config.auth.jwtExpiresIn }
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, config.auth.jwtSecret);
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export async function changeAdminPassword(userId, currentPassword, newPassword) {
  const admin = await findAdminById(userId);

  if (!admin) {
    return { ok: false, message: 'Admin account not found.' };
  }

  const isValid = await bcrypt.compare(currentPassword, admin.password_hash);

  if (!isValid) {
    return { ok: false, message: 'Current password is incorrect.' };
  }

  const passwordHash = await hashPassword(newPassword);
  const updated = await updateAdminPasswordHash(userId, passwordHash);

  if (!updated) {
    return { ok: false, message: 'Unable to update password.' };
  }

  return { ok: true };
}

export async function setAdminPasswordByUsername(username, newPassword) {
  const normalizedUsername = String(username || '').trim();
  const allowedUsernames = new Set(Object.values(FIXED_ADMIN_USERNAMES));
  if (!allowedUsernames.has(normalizedUsername)) {
    return { ok: false, message: 'Invalid admin username.' };
  }

  const admin = await findAdminByUsername(normalizedUsername);
  if (!admin) {
    return { ok: false, message: 'Admin account not found.' };
  }

  const expectedRole = Object.entries(FIXED_ADMIN_USERNAMES).find(([, u]) => u === normalizedUsername)?.[0];
  if (expectedRole && normalizeAdminRole(admin.role) !== expectedRole) {
    return { ok: false, message: 'Admin account role mismatch.' };
  }

  const passwordHash = await hashPassword(newPassword);
  const updated = await updateAdminPasswordHashByUsername(normalizedUsername, passwordHash);
  if (!updated) {
    return { ok: false, message: 'Unable to update password.' };
  }

  return { ok: true };
}
