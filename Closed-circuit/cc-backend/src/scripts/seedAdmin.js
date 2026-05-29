import { config } from '../config/env.js';
import { countAdminUsers, createAdminUser } from '../models/adminUser.model.js';
import { hashPassword } from '../services/auth.service.js';

export async function seedDefaultAdmin() {
  try {
    const total = await countAdminUsers();

    if (total > 0) {
      return;
    }

    const passwordHash = await hashPassword(config.auth.adminPassword);

    await createAdminUser({
      username: config.auth.adminUsername,
      passwordHash,
      role: 'admin',
    });

    console.log(`Default admin user seeded: ${config.auth.adminUsername}`);
  } catch (err) {
    console.error('Failed to seed default admin user:', err.message);
  }
}
