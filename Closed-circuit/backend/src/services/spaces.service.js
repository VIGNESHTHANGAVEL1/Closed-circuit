import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  CopyObjectCommand,
} from '@aws-sdk/client-s3';
import crypto from 'crypto';
import path from 'path';
import { config } from '../config/env.js';

const ALLOWED_IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]);

const ALLOWED_VIDEO_MIME_TYPES = new Set([
  'video/mp4',
  'video/quicktime',
  'video/webm',
]);

const IMAGE_EXT_BY_MIME = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

const VIDEO_EXT_BY_MIME = {
  'video/mp4': '.mp4',
  'video/quicktime': '.mov',
  'video/webm': '.webm',
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

/** Build a Spaces object key from folder segments under the configured root folder. */
export function buildObjectKey(relativeFolder, filename) {
  const parts = [config.spaces.rootFolder, relativeFolder, filename].filter(Boolean);
  return parts.join('/');
}

/** Build a public CDN URL for a Spaces object key. */
export function getPublicUrl(objectKey) {
  const encodedKey = objectKey
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
  return `https://${config.spaces.bucket}.${config.spaces.region}.cdn.digitaloceanspaces.com/${encodedKey}`;
}

/** Resolve client image folder paths from environment configuration. */
export function getClientImageFolders() {
  const clientRoot = config.spaces.clientFolder;
  return {
    logo: `${clientRoot}/logos`,
    profile: `${clientRoot}/profile-pictures`,
  };
}

/** Resolve the demo video upload folder from environment configuration. */
export function getDemoVideoFolder() {
  return config.spaces.videoFolder;
}

/** Build a public URL for a media file stored at the root folder level (e.g. flow_in_voice.mp4). */
export function getRootMediaUrl(filename) {
  const key = buildObjectKey('', filename);
  return getPublicUrl(key);
}

function sanitizeBaseName(originalName) {
  const base = path.basename(originalName || 'file', path.extname(originalName || ''));
  const safe = base.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 80);
  return safe || 'file';
}

function generateUniqueFilename(originalName, mimeType, extMap) {
  const ext = extMap[mimeType] || path.extname(originalName || '').toLowerCase() || '';
  const unique = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
  return `${sanitizeBaseName(originalName)}-${unique}${ext}`;
}

export function validateImageFile(file) {
  if (!file) {
    return null;
  }

  if (!ALLOWED_IMAGE_MIME_TYPES.has(file.mimetype)) {
    return 'Only JPG, JPEG, PNG, and WEBP images are allowed.';
  }

  if (file.size > config.spaces.maxImageBytes) {
    const maxMb = Math.round(config.spaces.maxImageBytes / (1024 * 1024));
    return `Image must be ${maxMb}MB or smaller.`;
  }

  return null;
}

export function validateVideoFile(file) {
  if (!file) {
    return 'Video file is required.';
  }

  if (!ALLOWED_VIDEO_MIME_TYPES.has(file.mimetype)) {
    return 'Only MP4, MOV, and WebM video formats are allowed.';
  }

  if (file.size > config.spaces.maxVideoBytes) {
    const maxMb = Math.round(config.spaces.maxVideoBytes / (1024 * 1024));
    return `Video must be ${maxMb}MB or smaller.`;
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

  const folders = getClientImageFolders();
  const folder = folders[type];
  if (!folder) {
    const error = new Error('Invalid image type.');
    error.statusCode = 400;
    throw error;
  }

  const filename = generateUniqueFilename(file.originalname, file.mimetype, IMAGE_EXT_BY_MIME);
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

/** Upload a demo video to the configured demo-videos folder on DigitalOcean Spaces. */
export async function uploadDemoVideo(file) {
  const validationError = validateVideoFile(file);
  if (validationError) {
    const error = new Error(validationError);
    error.statusCode = 400;
    throw error;
  }

  const client = getS3Client();
  if (!client) {
    const error = new Error('Video storage is not configured.');
    error.statusCode = 503;
    throw error;
  }

  const folder = getDemoVideoFolder();
  const filename = generateUniqueFilename(file.originalname, file.mimetype, VIDEO_EXT_BY_MIME);
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

async function ensureFolderPlaceholder(relativeFolder) {
  const client = getS3Client();
  if (!client) {
    return;
  }

  const key = buildObjectKey(relativeFolder, '.keep');

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

export async function ensureClientFoldersExist() {
  if (!config.spaces.enabled) {
    console.warn('[spaces] DigitalOcean Spaces not configured — client image uploads disabled.');
    return;
  }

  const folders = getClientImageFolders();
  await ensureFolderPlaceholder(folders.logo);
  await ensureFolderPlaceholder(folders.profile);
}

export async function ensureDemoVideoFolderExists() {
  if (!config.spaces.enabled) {
    console.warn('[spaces] DigitalOcean Spaces not configured — demo video uploads disabled.');
    return;
  }

  await ensureFolderPlaceholder(getDemoVideoFolder());
}

export async function ensureBrochureFolderExists() {
  if (!config.spaces.enabled) {
    console.warn('[spaces] DigitalOcean Spaces not configured — Brochures folder skipped.');
    return;
  }

  const key = buildObjectKey('Brochures', '.keep');
  const client = getS3Client();

  try {
    await client.send(new HeadObjectCommand({ Bucket: config.spaces.bucket, Key: key }));
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
    } catch (err) {
      console.warn('[spaces] Could not create Brochures folder placeholder:', err.message);
      return;
    }
  }

  console.log('✅ Brochures folder ready');
}

export async function ensureCertificateFolderExists() {
  if (!config.spaces.enabled) {
    console.warn('[spaces] DigitalOcean Spaces not configured — Certificates folder skipped.');
    return;
  }

  const key = buildObjectKey('Certificates', '.keep');
  const client = getS3Client();

  try {
    await client.send(new HeadObjectCommand({ Bucket: config.spaces.bucket, Key: key }));
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
    } catch (err) {
      console.warn('[spaces] Could not create Certificates folder placeholder:', err.message);
      return;
    }
  }

  console.log('✅ Certificates folder ready');
}

const SUPPORTED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.pdf']);

function detectFileType(filename) {
  const ext = path.extname(filename).toLowerCase();
  if (ext === '.pdf') return 'pdf';
  if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) return 'image';
  return null;
}

async function listFolderFiles(relativeFolder) {
  if (!config.spaces.enabled) {
    return [];
  }

  const client = getS3Client();
  if (!client) return [];

  const prefix = buildObjectKey(relativeFolder, '');
  const files = [];
  let continuationToken;

  do {
    const response = await client.send(
      new ListObjectsV2Command({
        Bucket: config.spaces.bucket,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      })
    );

    for (const item of response.Contents || []) {
      if (!item.Key) continue;

      const filename = item.Key.split('/').pop();
      if (!filename || filename === '.keep') continue;

      const ext = path.extname(filename).toLowerCase();
      if (!SUPPORTED_EXTENSIONS.has(ext)) continue;

      const fileType = detectFileType(filename);
      if (!fileType) continue;

      files.push({
        fileName: filename,
        fileType,
        url: getPublicUrl(item.Key),
        lastModified: item.LastModified,
      });
    }

    continuationToken = response.IsTruncated ? response.NextContinuationToken : undefined;
  } while (continuationToken);

  files.sort((a, b) => a.fileName.localeCompare(b.fileName));
  return files;
}

export async function listBrochureFiles() {
  return listFolderFiles('Brochures');
}

export async function listCertificateFiles() {
  return listFolderFiles('Certificates');
}

/** List all object keys under a given prefix. */
export async function listObjectKeys(prefix) {
  const client = getS3Client();
  if (!client) {
    return [];
  }

  const keys = [];
  let continuationToken;

  do {
    const response = await client.send(
      new ListObjectsV2Command({
        Bucket: config.spaces.bucket,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      })
    );

    for (const item of response.Contents || []) {
      if (item.Key && !item.Key.endsWith('/.keep')) {
        keys.push(item.Key);
      }
    }

    continuationToken = response.IsTruncated ? response.NextContinuationToken : undefined;
  } while (continuationToken);

  return keys;
}

/** Copy a Spaces object from one key to another within the same bucket. */
export async function copyObject(sourceKey, destinationKey) {
  const client = getS3Client();
  if (!client) {
    throw new Error('Spaces client not configured.');
  }

  await client.send(
    new CopyObjectCommand({
      Bucket: config.spaces.bucket,
      CopySource: `${config.spaces.bucket}/${sourceKey}`,
      Key: destinationKey,
      ACL: 'public-read',
    })
  );
}

/** Build the legacy duplicated prefix used before the folder structure refactor. */
export function getLegacyDuplicatedPrefix() {
  return `${config.spaces.rootFolder}/${config.spaces.rootFolder}/`;
}

/** Rewrite a URL or key from the legacy duplicated folder path to the new flat structure. */
export function rewriteLegacyPath(value) {
  if (!value) {
    return value;
  }

  const legacyPrefix = getLegacyDuplicatedPrefix();
  const newPrefix = `${config.spaces.rootFolder}/`;

  if (value.includes(legacyPrefix)) {
    return value.split(legacyPrefix).join(newPrefix);
  }

  return value;
}
