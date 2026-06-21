import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const backendRoot = path.join(__dirname, '../..');

export const REQUIRED_ENV_VARS = [
  'PORT',
  'CORS_ORIGIN',
  'DB_HOST',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'ADMIN_USERNAME',
  'ADMIN_PASSWORD',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'DO_SPACES_KEY',
  'DO_SPACES_SECRET',
  'DO_SPACES_ENDPOINT',
  'DO_SPACES_REGION',
  'DO_SPACES_BUCKET',
  'DO_SPACES_ROOT_FOLDER',
  'CLIENT_IMAGE_MAX_BYTES',
];

export function getMissingEnvVars(env = process.env) {
  return REQUIRED_ENV_VARS.filter((key) => {
    const value = env[key];
    if (key === 'DO_SPACES_ROOT_FOLDER') {
      return value === undefined || value === null;
    }
    return value === undefined || value === null || String(value).trim() === '';
  });
}

export function validateRequiredEnv(env = process.env) {
  const missing = getMissingEnvVars(env);
  if (missing.length > 0) {
    const error = new Error(`Missing required environment variables: ${missing.join(', ')}`);
    error.code = 'MISSING_ENV';
    error.missing = missing;
    throw error;
  }
}

export function validateSpacesConfig(env = process.env) {
  const spacesKeys = [
    'DO_SPACES_KEY',
    'DO_SPACES_SECRET',
    'DO_SPACES_ENDPOINT',
    'DO_SPACES_REGION',
    'DO_SPACES_BUCKET',
  ];
  const missing = spacesKeys.filter((key) => {
    const value = env[key];
    return value === undefined || value === null || String(value).trim() === '';
  });

  if (missing.length > 0) {
    const error = new Error(
      `DigitalOcean Spaces configuration incomplete. Missing: ${missing.join(', ')}`
    );
    error.code = 'MISSING_SPACES_CONFIG';
    error.missing = missing;
    throw error;
  }
}

export function validateProjectFiles(root = backendRoot) {
  const requiredFiles = [
    path.join(root, 'package.json'),
    path.join(root, 'src/index.js'),
    path.join(root, 'src/app.js'),
    path.join(root, '.env'),
  ];

  const missing = requiredFiles.filter((filePath) => !fs.existsSync(filePath));
  if (missing.length > 0) {
    const relative = missing.map((filePath) => path.relative(root, filePath));
    const error = new Error(`Missing required files: ${relative.join(', ')}`);
    error.code = 'MISSING_FILES';
    error.missing = relative;
    throw error;
  }
}
