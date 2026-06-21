/**
 * SMS templates loaded from .env (source of truth at send time).
 */

function decodeEnvMultiline(value) {
  return String(value || '')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .trim();
}

const SMS_TEMPLATE_ENV_MAP = {
  MOBILE_VERIFICATION_OTP: {
    idEnv: 'SMS_TEMPLATE_MOBILE_OTP_ID',
    textEnv: 'SMS_TEMPLATE_MOBILE_OTP_TEXT',
  },
  ENQUIRY_RECEIVED_CLIENT: {
    idEnv: 'SMS_TEMPLATE_ENQUIRY_CLIENT_ID',
    textEnv: 'SMS_TEMPLATE_ENQUIRY_CLIENT_TEXT',
  },
  ENQUIRY_RECEIVED_ADMIN: {
    idEnv: 'SMS_TEMPLATE_ENQUIRY_ADMIN_ID',
    textEnv: 'SMS_TEMPLATE_ENQUIRY_ADMIN_TEXT',
  },
  CALL_REMINDER_CLIENT: {
    idEnv: 'SMS_TEMPLATE_CALL_REMINDER_CLIENT_ID',
    textEnv: 'SMS_TEMPLATE_CALL_REMINDER_CLIENT_TEXT',
  },
  CALL_REMINDER_ADMIN: {
    idEnv: 'SMS_TEMPLATE_CALL_REMINDER_ADMIN_ID',
    textEnv: 'SMS_TEMPLATE_CALL_REMINDER_ADMIN_TEXT',
  },
};

export function getSmsTemplateFromEnv(templateKey) {
  const mapping = SMS_TEMPLATE_ENV_MAP[templateKey];
  if (!mapping) {
    return null;
  }

  const templateId = String(process.env[mapping.idEnv] || '').trim();
  const templateContent = decodeEnvMultiline(process.env[mapping.textEnv]);

  if (!templateId || !templateContent) {
    return null;
  }

  return {
    template_key: templateKey,
    template_id: templateId,
    template_content: templateContent,
    sender_id: null,
  };
}

export function listConfiguredSmsTemplateKeys() {
  return Object.keys(SMS_TEMPLATE_ENV_MAP).filter((key) => getSmsTemplateFromEnv(key) !== null);
}
