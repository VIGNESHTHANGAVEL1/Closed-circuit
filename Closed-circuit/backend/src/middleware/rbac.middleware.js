import { ADMIN_ROLES, normalizeAdminRole } from '../constants/adminRoles.js';
import { sendError } from '../utils/response.js';

export function requireRoles(...allowedRoles) {
  const allowed = new Set(allowedRoles.map((r) => normalizeAdminRole(r)).filter(Boolean));

  return (req, res, next) => {
    const role = normalizeAdminRole(req.user?.role);
    if (!role || !allowed.has(role)) {
      return sendError(res, 'You do not have permission to access this resource.', 403);
    }
    return next();
  };
}

export const requireAdmin = requireRoles(ADMIN_ROLES.ADMIN);
