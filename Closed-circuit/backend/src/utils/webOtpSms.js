/**
 * Chrome Web OTP requires SMS to contain `@<hostname> #<code>` where hostname
 * matches the page origin. See SMS_WEB_OTP_BINDING_GUIDE.md.
 */

function parseHostname(value) {
  const trimmed = String(value || '').trim();
  if (!trimmed) return '';

  try {
    const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    return new URL(withScheme).hostname.toLowerCase();
  } catch {
    return '';
  }
}

export function isValidWebOtpSmsDomain(hostname) {
  const host = String(hostname || '').trim().toLowerCase();
  if (!host) return false;
  if (host === 'localhost' || host.endsWith('.localhost')) return false;
  if (host === '127.0.0.1' || host.startsWith('127.')) return false;
  if (host.includes(':')) return false;
  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/.test(host)) {
    return false;
  }
  return true;
}

export function resolveWebOtpSmsDomain({
  clientOrigin = '',
  configuredDomain = '',
  publicAppUrl = '',
} = {}) {
  const fromOrigin = parseHostname(clientOrigin);
  if (isValidWebOtpSmsDomain(fromOrigin)) {
    return fromOrigin;
  }

  const fromConfigured = parseHostname(configuredDomain);
  if (isValidWebOtpSmsDomain(fromConfigured)) {
    return fromConfigured;
  }

  const fromPublicUrl = parseHostname(publicAppUrl);
  if (isValidWebOtpSmsDomain(fromPublicUrl)) {
    return fromPublicUrl;
  }

  return '';
}
