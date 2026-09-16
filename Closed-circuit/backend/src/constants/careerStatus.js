export const CAREER_STATUSES = ['New', 'Processing', 'Selected/Accepted', 'Rejected'];

export const DEFAULT_CAREER_STATUS = 'New';

export function normalizeCareerStatus(value) {
  const normalized = String(value || '').trim();
  if (!normalized) {
    return null;
  }

  const match = CAREER_STATUSES.find(
    (status) => status.toLowerCase() === normalized.toLowerCase()
  );

  return match || null;
}

export function resolveCareerStatus(value) {
  return normalizeCareerStatus(value) || DEFAULT_CAREER_STATUS;
}
