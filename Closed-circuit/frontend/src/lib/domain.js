/** Normalize domain input; prefix https:// when missing. Returns null if empty. */
export function normalizeDomainUrl(value) {
  const trimmed = (value || '').trim();
  if (!trimmed) return '';

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

/** Open client domain in a sized popup (admin + public). */
export function openDomainPreview(domainUrl) {
  if (!domainUrl) return;
  window.open(
    domainUrl,
    'domainPreview',
    'width=800,height=600,resizable=yes,scrollbars=yes'
  );
}
