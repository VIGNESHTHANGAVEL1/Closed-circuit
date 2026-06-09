import dotenv from 'dotenv';

dotenv.config();

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
    senderId: process.env.SMS_SENDER_ID || '',
    enabled:
      process.env.SMS_ENABLED !== 'false' &&
      Boolean(
        process.env.SMS_GATEWAY_URL &&
          process.env.SMS_API_KEY &&
          process.env.SMS_SENDER_ID
      ),
  },
  notifications: {
    adminEmail: process.env.ADMIN_EMAIL || '',
    adminMobile: process.env.ADMIN_MOBILE || '',
    adminName: process.env.ADMIN_NAME || 'Admin',
  },
};
