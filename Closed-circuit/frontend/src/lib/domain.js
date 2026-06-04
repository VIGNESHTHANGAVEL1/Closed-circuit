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

/** Open client domain in a centered half-screen popup (admin + public). */
export function openDomainPreview(domainUrl) {
  if (!domainUrl || typeof window === 'undefined') return;

  const normalized = normalizeDomainUrl(domainUrl);
  if (!normalized) return;

  const width = Math.floor(window.screen.width * 0.5);
  const height = Math.floor(window.screen.height * 0.75);
  const left = Math.floor((window.screen.width - width) / 2);
  const top = Math.floor((window.screen.height - height) / 2);

  window.open(
    normalized,
    'clientDomainPreview',
    `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
  );
}
