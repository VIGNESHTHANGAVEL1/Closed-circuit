const SMS_PLACEHOLDER_PATTERN = /\{\{[^}]+\}\}|\{#(?:alphanumeric|numeric)#\}/;

export function renderSmsTemplate(templateText, variables = {}) {
  let rendered = String(templateText || '');

  for (const [key, value] of Object.entries(variables)) {
    const safeValue = value == null ? '' : String(value).trim();
    rendered = rendered.replaceAll(`{{${key}}}`, safeValue);
    rendered = rendered.replaceAll(`{${key}}`, safeValue);
  }

  return rendered.replace(/[ \t]+$/gm, '').trim();
}

export function hasUnreplacedSmsPlaceholders(message) {
  return SMS_PLACEHOLDER_PATTERN.test(String(message || ''));
}

export function assertSmsRendered(message) {
  if (hasUnreplacedSmsPlaceholders(message)) {
    const error = new Error('SMS template variable replacement failed');
    error.code = 'SMS_TEMPLATE_RENDER_FAILED';
    throw error;
  }
}

export function renderEmailTemplate(content, variables = {}) {
  let rendered = String(content || '');
  for (const [key, value] of Object.entries(variables)) {
    const safeValue = value == null ? '' : String(value);
    rendered = rendered.replaceAll(`{{${key}}}`, safeValue);
    rendered = rendered.replaceAll(`{${key}}`, safeValue);
  }
  return rendered;
}

export function truncateSafe(text, max = 500) {
  if (!text) return null;
  const value = String(text);
  return value.length > max ? `${value.slice(0, max - 3)}...` : value;
}

export function maskOtpInSmsLog(message, variables = {}) {
  const otp = String(variables.otp || '').trim();
  if (!otp || !message) {
    return message;
  }
  return String(message).split(otp).join('****');
}
