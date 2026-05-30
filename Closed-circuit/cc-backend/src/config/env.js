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
};
