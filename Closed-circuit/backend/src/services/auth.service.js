import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import {
  findAdminByUsername,
  findAdminById,
  updateAdminPasswordHash,
} from '../models/adminUser.model.js';

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
