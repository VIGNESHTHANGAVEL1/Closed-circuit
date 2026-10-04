import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getStoredUser } from '../lib/auth';
import { getDefaultAdminPath, hasPermission, normalizeRole } from '../lib/adminPermissions';

export default function AdminRoute({ children, permission }) {
  const location = useLocation();
  const user = getStoredUser();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  const role = normalizeRole(user?.role);

  if (permission && !hasPermission(role, permission)) {
    return <Navigate to={getDefaultAdminPath(role)} replace />;
  }

  return children;
}
