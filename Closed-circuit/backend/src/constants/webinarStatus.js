export const WEBINAR_STATUSES = ['New', 'Certificate Issued'];

export function normalizeWebinarStatus(status) {
  const value = String(status || '').trim();
  return WEBINAR_STATUSES.includes(value) ? value : null;
}

export function resolveWebinarStatus(status) {
  return normalizeWebinarStatus(status) || 'New';
}

export const DEFAULT_WEBINAR_STATUS = 'New';
