import { config } from '../config/env.js';
import { ADMIN_ROLES, FIXED_ADMIN_USERNAMES } from '../constants/adminRoles.js';
import { findAdminByUsername, createAdminUser } from '../models/adminUser.model.js';
import { hashPassword } from '../services/auth.service.js';

function rolePassword(role) {
  if (role === ADMIN_ROLES.ADMIN) {
    return config.auth.adminPassword;
  }
  if (role === ADMIN_ROLES.ISE) {
    return process.env.ISE_ADMIN_PASSWORD || 'Change_ISE_Password_1';
  }
  if (role === ADMIN_ROLES.HR) {
    return process.env.HR_ADMIN_PASSWORD || 'Change_HR_Password_1';
  }
  if (role === ADMIN_ROLES.WEBINAR_ADMIN) {
    return process.env.WEBINAR_ADMIN_PASSWORD || 'Change_WebinarAdmin_Password_1';
  }
  return 'Change_This_Password_1';
}

export async function seedRoleAdminUsers() {
  const entries = Object.entries(FIXED_ADMIN_USERNAMES);

  for (const [role, username] of entries) {
    const existing = await findAdminByUsername(username);
    if (existing) {
      console.log(`✅ Admin role user already exists: ${username} (${role})`);
      continue;
    }

    const passwordHash = await hashPassword(rolePassword(role));
    await createAdminUser({ username, passwordHash, role });
    console.log(`✅ Seeded admin user: ${username} (${role})`);
  }

  const legacyUsername = config.auth.adminUsername;
  if (legacyUsername && legacyUsername !== FIXED_ADMIN_USERNAMES[ADMIN_ROLES.ADMIN]) {
    const legacy = await findAdminByUsername(legacyUsername);
    if (legacy) {
      console.log(`ℹ️ Legacy admin username still present: ${legacyUsername}`);
    }
  }
}
