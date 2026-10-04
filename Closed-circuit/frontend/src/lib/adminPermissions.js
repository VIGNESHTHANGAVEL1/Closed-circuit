export const ADMIN_ROLES = {
  ADMIN: 'admin',
  ISE: 'ise',
  HR: 'hr',
  WEBINAR_ADMIN: 'webinar_admin',
};

const PERMISSIONS = {
  dashboard: [ADMIN_ROLES.ADMIN, ADMIN_ROLES.ISE, ADMIN_ROLES.HR, ADMIN_ROLES.WEBINAR_ADMIN],
  enquiries: [ADMIN_ROLES.ADMIN, ADMIN_ROLES.ISE],
  careers_sales: [ADMIN_ROLES.ADMIN, ADMIN_ROLES.HR],
  careers_technical: [ADMIN_ROLES.ADMIN, ADMIN_ROLES.HR],
  webinar_entrepreneurship: [ADMIN_ROLES.ADMIN, ADMIN_ROLES.WEBINAR_ADMIN],
  webinar_leetcode: [ADMIN_ROLES.ADMIN, ADMIN_ROLES.WEBINAR_ADMIN],
  clients: [ADMIN_ROLES.ADMIN],
  demo_videos: [ADMIN_ROLES.ADMIN],
  change_password: [ADMIN_ROLES.ADMIN],
};

export function normalizeRole(role) {
  const value = String(role || '').trim().toLowerCase();
  return Object.values(ADMIN_ROLES).includes(value) ? value : null;
}

export function hasPermission(role, permission) {
  const normalized = normalizeRole(role);
  if (!normalized) return false;
  return (PERMISSIONS[permission] || []).includes(normalized);
}

export function getDefaultAdminPath(role) {
  const normalized = normalizeRole(role);
  if (normalized === ADMIN_ROLES.ISE) return '/admin/enquiries';
  if (normalized === ADMIN_ROLES.HR) return '/admin/careers/sales';
  if (normalized === ADMIN_ROLES.WEBINAR_ADMIN) return '/admin/webinars/entrepreneurship';
  return '/admin/dashboard';
}

export function getAdminNavLinks(role) {
  const links = [];
  if (hasPermission(role, 'dashboard')) {
    links.push({ label: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard' });
  }
  if (hasPermission(role, 'enquiries')) {
    links.push({ label: 'Enquiries', path: '/admin/enquiries', icon: 'enquiries' });
  }
  if (hasPermission(role, 'careers_sales')) {
    links.push({ label: 'Sales Candidates', path: '/admin/careers/sales', icon: 'briefcase' });
  }
  if (hasPermission(role, 'careers_technical')) {
    links.push({ label: 'Technical Candidates', path: '/admin/careers/technical', icon: 'briefcase' });
  }
  if (hasPermission(role, 'webinar_entrepreneurship')) {
    links.push({
      label: 'Entrepreneurship Webinar Candidates',
      path: '/admin/webinars/entrepreneurship',
      icon: 'briefcase',
    });
  }
  if (hasPermission(role, 'webinar_leetcode')) {
    links.push({
      label: 'LeetCode Webinar Candidates',
      path: '/admin/webinars/leetcode',
      icon: 'briefcase',
    });
  }
  if (hasPermission(role, 'clients')) {
    links.push({ label: 'Clients', path: '/admin/clients', icon: 'clients' });
  }
  if (hasPermission(role, 'demo_videos')) {
    links.push({ label: 'Manage Demo Videos', path: '/admin/demo-videos', icon: 'video' });
  }
  if (hasPermission(role, 'change_password')) {
    links.push({ label: 'Change Password', path: '/admin/change-password', icon: 'password' });
  }
  return links;
}
