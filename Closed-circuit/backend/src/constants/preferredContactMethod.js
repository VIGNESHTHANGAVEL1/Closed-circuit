export const PREFERRED_CONTACT_METHODS = [
  'Call',
  'Chat',
  'Google Meeting / Live Meeting',
];

export function normalizePreferredContactMethod(value) {
  if (!value || typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return PREFERRED_CONTACT_METHODS.includes(trimmed) ? trimmed : null;
}
