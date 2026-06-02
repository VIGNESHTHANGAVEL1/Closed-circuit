import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { findAdminByUsername } from '../models/adminUser.model.js';

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
