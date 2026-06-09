export const WEB_OTP_BINDING_PLACEHOLDER = '@{web_otp_host} #{otp}';
const WEB_OTP_BINDING_LINE_REGEX = /\n?@[^\s#]+ #\d{4,8}\s*$/m;

export function stripWebOtpBindingLine(message) {
  return String(message || '')
    .replace(WEB_OTP_BINDING_LINE_REGEX, '')
    .replace(/\{web_otp_host\}\s*#\{otp\}/g, '')
    .trim();
}

/**
 * Adjust OTP SMS body for Chrome Web OTP binding after variable substitution.
 */
export function renderOtpSmsMessage(templateContent, options = {}) {
  const {
    bindingEnabled = false,
    webOtpHost = '',
    otp = '',
  } = options;

  let message = String(templateContent || '');
  const host = String(webOtpHost || '').trim().toLowerCase();
  const otpValue = String(otp || '').trim();
  const hasPlaceholder = message.includes('{web_otp_host}') || message.includes('{otp}');

  if (hasPlaceholder) {
    message = message
      .replace(/\{web_otp_host\}/g, host)
      .replace(/\{otp\}/g, otpValue);
  }

  const bindingActive =
    bindingEnabled &&
    host &&
    /^\d{4,8}$/.test(otpValue);

  if (!bindingActive) {
    if (bindingEnabled && !host) {
      console.warn('[sms] Web OTP binding skipped: invalid or local web_otp_host');
    }
    return stripWebOtpBindingLine(message);
  }

  if (!hasPlaceholder && !message.includes(`@${host}`)) {
    console.warn(
      '[sms] Web OTP binding enabled but template missing @{web_otp_host} #{otp} — sending without binding line (DLT-safe)'
    );
    return stripWebOtpBindingLine(message);
  }

  return message.trim();
}
