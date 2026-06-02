const TOKEN_KEY = 'cc_admin_token';
const USER_KEY = 'cc_admin_user';

export function getStoredToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function getStoredUser() {
  const raw = sessionStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setAuthSession(token, user) {
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuthSession() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}

export function isAuthenticated() {
  return Boolean(getStoredToken());
}
