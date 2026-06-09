import dotenv from 'dotenv';

dotenv.config();

function resolveSmsSendMode() {
  const explicit = String(process.env.SMS_SEND_MODE || '').trim().toLowerCase();
  if (explicit === 'dlt_variables' || explicit === 'full_message' || explicit === 'dlt_entity') {
    return explicit;
  }

  if (process.env.SMS_USERNAME && process.env.SMS_PASSWORD) {
    return 'dlt_entity';
  }

  const gatewayUrl = String(process.env.SMS_GATEWAY_URL || '').toLowerCase();
  if (gatewayUrl.includes('fast2sms.com')) {
    return 'dlt_variables';
  }
  if (gatewayUrl.includes('xtendonline.com') || gatewayUrl.includes('urlsms.php')) {
    return 'dlt_entity';
  }

  return 'full_message';
}

function isSmsGatewayConfigured(sendMode) {
  const hasBase = Boolean(process.env.SMS_GATEWAY_URL && process.env.SMS_SENDER_ID);
  if (!hasBase) {
    return false;
  }

  if (sendMode === 'dlt_entity') {
    return Boolean(
      process.env.SMS_USERNAME &&
        process.env.SMS_PASSWORD &&
        process.env.SMS_DLT_ENTITY_ID
    );
  }

  return Boolean(process.env.SMS_API_KEY);
}

function spacesConfigured() {
  return Boolean(
    process.env.DO_SPACES_KEY &&
      process.env.DO_SPACES_SECRET &&
      process.env.DO_SPACES_ENDPOINT &&
      process.env.DO_SPACES_BUCKET
  );
}

export const config = {
  port: Number(process.env.PORT) || 5000,
  corsOrigin: process.env.CORS_ORIGIN || '*',
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'ramesh',
    password: process.env.DB_PASSWORD || 'Great@123',
    database: process.env.DB_NAME || 'cc_db',
  },
  auth: {
    adminUsername: process.env.ADMIN_USERNAME || 'admin',
    adminPassword: process.env.ADMIN_PASSWORD || 'change_this_strong_password',
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  },
  spaces: {
    enabled: spacesConfigured(),
    key: process.env.DO_SPACES_KEY || '',
    secret: process.env.DO_SPACES_SECRET || '',
    endpoint: process.env.DO_SPACES_ENDPOINT || '',
    region: process.env.DO_SPACES_REGION || 'blr1',
    bucket: process.env.DO_SPACES_BUCKET || 'lara',
    rootFolder: (process.env.DO_SPACES_ROOT_FOLDER || '').replace(/^\/|\/$/g, ''),
    basePath: 'Closed Circuit',
    maxImageBytes: Number(process.env.CLIENT_IMAGE_MAX_BYTES) || 5 * 1024 * 1024,
  },
  timezone: process.env.APP_TIMEZONE || 'Asia/Kolkata',
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    fromEmail: process.env.SMTP_FROM_EMAIL || 'cc@closedcircuit.in',
    fromName: process.env.SMTP_FROM_NAME || 'Closed Circuit AI Pvt Ltd',
    enabled: Boolean(
      process.env.SMTP_HOST &&
        process.env.SMTP_USER &&
        process.env.SMTP_PASS
    ),
  },
  sms: {
    gatewayUrl: process.env.SMS_GATEWAY_URL || '',
    apiKey: process.env.SMS_API_KEY || '',
    username: process.env.SMS_USERNAME || '',
    password: process.env.SMS_PASSWORD || '',
    senderId: process.env.SMS_SENDER_ID || '',
    dltEntityId: process.env.SMS_DLT_ENTITY_ID || '',
    dltHeaderId: process.env.SMS_DLT_HEADER_ID || '',
    sendMode: resolveSmsSendMode(),
    webOtpBinding: process.env.SMS_WEB_OTP_BINDING === 'true',
    webOtpDomain: process.env.SMS_WEB_OTP_DOMAIN || '',
    publicAppUrl: process.env.PUBLIC_APP_URL || process.env.CLIENT_URL || '',
    enabled:
      process.env.SMS_ENABLED !== 'false' && isSmsGatewayConfigured(resolveSmsSendMode()),
  },
  notifications: {
    adminEmail: process.env.ADMIN_EMAIL || '',
    adminMobile: process.env.ADMIN_MOBILE || '',
    adminName: process.env.ADMIN_NAME || 'Admin',
  },
};
