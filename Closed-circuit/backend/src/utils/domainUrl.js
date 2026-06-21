export function normalizeDomainUrl(value) {
  const trimmed = (value || '').trim();
  if (!trimmed) return null;

  let url = trimmed;
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }

  try {
    const parsed = new URL(url);
    if (!parsed.hostname) {
      return null;
    }
    return url;
  } catch {
    return null;
  }
}

export function validateDomainUrlOptional(value) {
  const trimmed = (value || '').trim();
  if (!trimmed) return { ok: true, url: null };

  const url = normalizeDomainUrl(trimmed);
  if (!url) {
    return { ok: false, message: 'Please provide a valid domain URL (e.g. https://example.com).' };
  }

  return { ok: true, url };
}
