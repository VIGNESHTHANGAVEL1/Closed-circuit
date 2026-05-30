export const ENQUIRY_STATUSES = [
  'New',
  'Processing',
  'Rejected temporarily',
  'Rejected permanently',
  'Closed',
];

export const DEFAULT_ENQUIRY_STATUS = 'New';

export function normalizeEnquiryStatus(value) {
  if (!value || typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  return ENQUIRY_STATUSES.includes(trimmed) ? trimmed : null;
}

export function resolveEnquiryStatus(value) {
  return normalizeEnquiryStatus(value) || DEFAULT_ENQUIRY_STATUS;
}
