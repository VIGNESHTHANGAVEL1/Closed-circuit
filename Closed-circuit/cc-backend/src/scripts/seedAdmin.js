import { config } from '../config/env.js';
import { findAdminByUsername, createAdminUser } from '../models/adminUser.model.js';
import { hashPassword } from '../services/auth.service.js';

export async function seedDefaultAdmin() {
  const existing = await findAdminByUsername(config.auth.adminUsername);

  if (existing) {
    console.log(`✅ Admin user already exists: ${config.auth.adminUsername}`);
    return;
  }

  const passwordHash = await hashPassword(config.auth.adminPassword);

  await createAdminUser({
    username: config.auth.adminUsername,
    passwordHash,
    role: 'admin',
  });

  console.log(`✅ Admin user seeded: ${config.auth.adminUsername}`);
}
