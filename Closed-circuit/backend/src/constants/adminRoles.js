export const ADMIN_ROLES = {
  ADMIN: 'admin',
  ISE: 'ise',
  HR: 'hr',
  WEBINAR_ADMIN: 'webinar_admin',
};

export const FIXED_ADMIN_USERNAMES = {
  [ADMIN_ROLES.ADMIN]: 'admin',
  [ADMIN_ROLES.ISE]: 'ise',
  [ADMIN_ROLES.HR]: 'hr',
  [ADMIN_ROLES.WEBINAR_ADMIN]: 'webinar_admin',
};

export function normalizeAdminRole(role) {
  const value = String(role || '').trim().toLowerCase();
  return Object.values(ADMIN_ROLES).includes(value) ? value : null;
}
