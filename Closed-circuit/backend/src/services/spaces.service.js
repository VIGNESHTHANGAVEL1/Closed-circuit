import { S3Client, PutObjectCommand, HeadObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';
import path from 'path';
import { config } from '../config/env.js';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]);

const EXT_BY_MIME = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

const FOLDER_MAP = {
  logo: 'clients/logos',
  profile: 'clients/profile-pictures',
};

let s3Client = null;

function getS3Client() {
  if (!config.spaces.enabled) {
    return null;
  }

  if (!s3Client) {
    s3Client = new S3Client({
      endpoint: config.spaces.endpoint,
      region: config.spaces.region,
      credentials: {
        accessKeyId: config.spaces.key,
        secretAccessKey: config.spaces.secret,
      },
      forcePathStyle: false,
    });
  }

  return s3Client;
}

function buildObjectKey(relativeFolder, filename) {
  const parts = [config.spaces.basePath, relativeFolder, filename].filter(Boolean);
  if (config.spaces.rootFolder) {
    parts.unshift(config.spaces.rootFolder);
  }
  return parts.join('/');
}

export function getPublicUrl(objectKey) {
  const encodedKey = objectKey
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
  return `https://${config.spaces.bucket}.${config.spaces.region}.cdn.digitaloceanspaces.com/${encodedKey}`;
}

function sanitizeBaseName(originalName) {
  const base = path.basename(originalName || 'image', path.extname(originalName || ''));
  const safe = base.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 80);
  return safe || 'image';
}

function generateUniqueFilename(originalName, mimeType) {
  const ext = EXT_BY_MIME[mimeType] || path.extname(originalName || '').toLowerCase() || '.jpg';
  const unique = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
  return `${sanitizeBaseName(originalName)}-${unique}${ext}`;
}

export function validateImageFile(file) {
  if (!file) {
    return null;
  }

  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    return 'Only JPG, JPEG, PNG, and WEBP images are allowed.';
  }

  if (file.size > config.spaces.maxImageBytes) {
    const maxMb = Math.round(config.spaces.maxImageBytes / (1024 * 1024));
    return `Image must be ${maxMb}MB or smaller.`;
  }

  return null;
}

export async function uploadClientImage(file, type) {
  if (!file) {
    return null;
  }

  const validationError = validateImageFile(file);
  if (validationError) {
    const error = new Error(validationError);
    error.statusCode = 400;
    throw error;
  }

  const client = getS3Client();
  if (!client) {
    const error = new Error('Image storage is not configured.');
    error.statusCode = 503;
    throw error;
  }

  const folder = FOLDER_MAP[type];
  if (!folder) {
    const error = new Error('Invalid image type.');
    error.statusCode = 400;
    throw error;
  }

  const filename = generateUniqueFilename(file.originalname, file.mimetype);
  const key = buildObjectKey(folder, filename);

  await client.send(
    new PutObjectCommand({
      Bucket: config.spaces.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    })
  );

  return {
    key,
    url: getPublicUrl(key),
  };
}

export async function deleteObjectByKey(key) {
  if (!key || !config.spaces.enabled) {
    return;
  }

  const client = getS3Client();
  if (!client) {
    return;
  }

  try {
    await client.send(
      new DeleteObjectCommand({
        Bucket: config.spaces.bucket,
        Key: key,
      })
    );
  } catch (err) {
    console.warn('[spaces] delete failed for key:', key, err.message);
  }
}

export async function ensureClientFoldersExist() {
  if (!config.spaces.enabled) {
    console.warn('[spaces] DigitalOcean Spaces not configured — client image uploads disabled.');
    return;
  }

  const client = getS3Client();
  const placeholders = [
    buildObjectKey('clients/logos', '.keep'),
    buildObjectKey('clients/profile-pictures', '.keep'),
  ];

  for (const key of placeholders) {
    try {
      await client.send(
        new HeadObjectCommand({
          Bucket: config.spaces.bucket,
          Key: key,
        })
      );
    } catch {
      try {
        await client.send(
          new PutObjectCommand({
            Bucket: config.spaces.bucket,
            Key: key,
            Body: '',
            ContentType: 'text/plain',
            ACL: 'public-read',
          })
        );
        console.log(`[spaces] initialized folder placeholder: ${key}`);
      } catch (err) {
        console.warn(`[spaces] could not initialize ${key}:`, err.message);
      }
    }
  }
}
