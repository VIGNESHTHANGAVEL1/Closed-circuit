import { config } from '../config/env.js';

function maskMobile(mobile) {
  const digits = String(mobile || '').replace(/\D/g, '');
  if (digits.length < 4) return '(not set)';
  return `${digits.slice(0, 2)}****${digits.slice(-2)}`;
}

export function isSmtpConfigured() {
  return Boolean(
    config.smtp.host &&
      config.smtp.user &&
      config.smtp.pass &&
      config.smtp.fromEmail
  );
}

export function isSmsConfigured() {
  return Boolean(config.sms.enabled);
}

export function logNotificationConfigStatus() {
  console.log('');
  console.log('--- Notification configuration ---');
  console.log(`  Timezone: ${config.timezone}`);
  console.log('');
  console.log('  SMS/Email TEMPLATES: stored in MySQL (sms_templates, email_templates)');
  console.log('  Templates are NOT configured in .env — they seed on startup.');
  console.log('');
  console.log('  .env credentials required for actual delivery:');
  console.log('');

  if (isSmsConfigured()) {
    console.log('  ✅ SMS gateway configured');
    console.log(`     URL: ${config.sms.gatewayUrl}`);
    console.log(
      `     Send mode: ${config.sms.sendMode} (dlt_entity = Xtend/username API, dlt_variables = Fast2SMS, full_message = JSON body)`
    );
    console.log(`     Sender ID: ${config.sms.senderId}`);
    if (config.sms.sendMode === 'dlt_entity') {
      console.log(`     Username: ${config.sms.username}`);
      console.log(`     DLT entity ID: ${config.sms.dltEntityId || '(not set)'}`);
    } else {
      console.log('     API key: (set)');
    }
    console.log(`     Web OTP binding: ${config.sms.webOtpBinding ? 'enabled' : 'disabled'}`);
    if (config.sms.webOtpDomain) {
      console.log(`     Web OTP domain: ${config.sms.webOtpDomain}`);
    }
  } else {
    console.log('  ⚠️  SMS gateway NOT configured');
    console.log('     Xtend / username API: SMS_GATEWAY_URL, SMS_USERNAME, SMS_PASSWORD, SMS_SENDER_ID, SMS_DLT_ENTITY_ID');
    console.log('     Fast2SMS: SMS_GATEWAY_URL, SMS_API_KEY, SMS_SENDER_ID');
    if (!config.sms.gatewayUrl) console.log('     Missing: SMS_GATEWAY_URL');
    if (!config.sms.senderId) console.log('     Missing: SMS_SENDER_ID');
    if (config.sms.sendMode === 'dlt_entity') {
      if (!config.sms.username) console.log('     Missing: SMS_USERNAME');
      if (!config.sms.password) console.log('     Missing: SMS_PASSWORD');
      if (!config.sms.dltEntityId) console.log('     Missing: SMS_DLT_ENTITY_ID');
    } else if (!config.sms.apiKey) {
      console.log('     Missing: SMS_API_KEY');
    }
    if (process.env.SMS_ENABLED === 'false') console.log('     SMS_ENABLED=false');
  }

  console.log('');

  if (isSmtpConfigured()) {
    console.log('  ✅ SMTP email configured');
    console.log(`     Host: ${config.smtp.host}:${config.smtp.port}`);
    console.log(`     From: ${config.smtp.fromEmail}`);
    console.log(`     User: ${config.smtp.user}`);
  } else {
    console.log('  ⚠️  SMTP email NOT configured');
    console.log('     Add to .env: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM_EMAIL');
    if (!config.smtp.host) console.log('     Missing: SMTP_HOST');
    if (!config.smtp.user) console.log('     Missing: SMTP_USER');
    if (!config.smtp.pass) console.log('     Missing: SMTP_PASS');
  }

  console.log('');

  if (config.notifications.adminEmail || config.notifications.adminMobile) {
    console.log('  ✅ Admin notification contacts');
    console.log(`     Email: ${config.notifications.adminEmail || '(not set)'}`);
    console.log(`     Mobile: ${maskMobile(config.notifications.adminMobile)}`);
  } else {
    console.log('  ⚠️  Admin notifications: set ADMIN_EMAIL and ADMIN_MOBILE in .env');
  }

  if (!isSmsConfigured() || !isSmtpConfigured()) {
    console.log('');
    console.log('  ℹ️  Local dev: OTP will print in this console when gateway/SMTP is missing.');
    console.log('  ℹ️  Production: configure .env credentials for real SMS/email delivery.');
  }

  console.log('----------------------------------');
  console.log('');
}
