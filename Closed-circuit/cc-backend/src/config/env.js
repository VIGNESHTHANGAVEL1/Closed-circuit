import dotenv from 'dotenv';

dotenv.config();

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
};
