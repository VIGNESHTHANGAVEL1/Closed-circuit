/**
 * DigitalOcean Spaces folder structure migration utility.
 *
 * Moves objects from the legacy duplicated path:
 *   {rootFolder}/{rootFolder}/*
 * to the flat structure:
 *   {rootFolder}/*
 *
 * Usage:
 *   node scripts/migrate-spaces-structure.js --dry-run
 *   node scripts/migrate-spaces-structure.js --execute
 *   node scripts/migrate-spaces-structure.js --rollback
 */
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializePool } from '../src/config/database.js';
import {
  listObjectKeys,
  copyObject,
  deleteObjectByKey,
  getLegacyDuplicatedPrefix,
  getPublicUrl,
} from '../src/services/spaces.service.js';
import { updateClientImagePaths } from '../src/models/demoVideo.model.js';
import { config } from '../src/config/env.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MANIFEST_PATH = path.join(__dirname, '.spaces-migration-manifest.json');

function parseArgs() {
  const args = process.argv.slice(2);
  return {
    dryRun: args.includes('--dry-run'),
    execute: args.includes('--execute'),
    rollback: args.includes('--rollback'),
    verify: args.includes('--verify'),
  };
}

function buildNewKey(oldKey, legacyPrefix) {
  const rootPrefix = `${config.spaces.rootFolder}/`;
  if (!oldKey.startsWith(legacyPrefix)) {
    return null;
  }
  const relative = oldKey.slice(legacyPrefix.length);
  return `${rootPrefix}${relative}`;
}

function saveManifest(manifest) {
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`[migration] Manifest saved to ${MANIFEST_PATH}`);
}

function loadManifest() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    throw new Error(`Rollback manifest not found at ${MANIFEST_PATH}`);
  }
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
}

async function migrateObjects({ dryRun }) {
  const legacyPrefix = getLegacyDuplicatedPrefix();
  const keys = await listObjectKeys(legacyPrefix);

  if (!keys.length) {
    console.log('[migration] No objects found under legacy prefix — nothing to migrate.');
    return { moved: [], skipped: [] };
  }

  const moved = [];
  const skipped = [];

  for (const oldKey of keys) {
    const newKey = buildNewKey(oldKey, legacyPrefix);
    if (!newKey || newKey === oldKey) {
      skipped.push(oldKey);
      continue;
    }

    console.log(`[migration] ${dryRun ? '[DRY-RUN] ' : ''}${oldKey} → ${newKey}`);

    if (!dryRun) {
      await copyObject(oldKey, newKey);
      await deleteObjectByKey(oldKey);
    }

    moved.push({ oldKey, newKey, oldUrl: getPublicUrl(oldKey), newUrl: getPublicUrl(newKey) });
  }

  return { moved, skipped };
}

async function updateDatabasePaths({ dryRun }) {
  const legacyPrefix = getLegacyDuplicatedPrefix();
  const newPrefix = `${config.spaces.rootFolder}/`;

  console.log(`[migration] ${dryRun ? '[DRY-RUN] ' : ''}Updating client image paths in database...`);

  if (dryRun) {
    const pool = await initializePool();
    const [rows] = await pool.query(
      `SELECT COUNT(*) AS total FROM clients
       WHERE client_logo_key LIKE ? OR client_profile_pic_key LIKE ?
          OR client_logo_url LIKE ? OR client_profile_pic_url LIKE ?`,
      [`${legacyPrefix}%`, `${legacyPrefix}%`, `%${legacyPrefix}%`, `%${legacyPrefix}%`]
    );
    console.log(`[migration] ${rows[0]?.total || 0} client record(s) would be updated.`);
    return rows[0]?.total || 0;
  }

  return updateClientImagePaths(legacyPrefix, newPrefix);
}

async function verifyMigration() {
  const legacyPrefix = getLegacyDuplicatedPrefix();
  const legacyKeys = await listObjectKeys(legacyPrefix);
  const rootKeys = await listObjectKeys(`${config.spaces.rootFolder}/`);

  console.log('[verify] Legacy prefix objects remaining:', legacyKeys.length);
  console.log('[verify] Root prefix objects:', rootKeys.length);

  const pool = await initializePool();
  const [clients] = await pool.query(
    `SELECT id, client_logo_url, client_profile_pic_url FROM clients
     WHERE client_logo_url IS NOT NULL OR client_profile_pic_url IS NOT NULL`
  );

  let broken = 0;
  for (const client of clients) {
    for (const url of [client.client_logo_url, client.client_profile_pic_url]) {
      if (url && url.includes(legacyPrefix.replace(/\//g, '%20Circuit%2F'))) {
        broken += 1;
        console.warn(`[verify] Client #${client.id} still has legacy URL: ${url}`);
      }
    }
  }

  console.log(`[verify] Clients with legacy URL patterns: ${broken}`);
  return { legacyKeys: legacyKeys.length, rootKeys: rootKeys.length, brokenClientUrls: broken };
}

async function rollbackMigration() {
  const manifest = loadManifest();
  console.log(`[rollback] Restoring ${manifest.moved?.length || 0} object(s)...`);

  for (const entry of manifest.moved || []) {
    console.log(`[rollback] ${entry.newKey} → ${entry.oldKey}`);
    await copyObject(entry.newKey, entry.oldKey);
    await deleteObjectByKey(entry.newKey);
  }

  if (manifest.dbUpdated) {
    const legacyPrefix = getLegacyDuplicatedPrefix();
    const newPrefix = `${config.spaces.rootFolder}/`;
    await updateClientImagePaths(newPrefix, legacyPrefix);
    console.log('[rollback] Database paths reverted.');
  }

  console.log('[rollback] Complete.');
}

async function main() {
  const { dryRun, execute, rollback, verify } = parseArgs();

  if (!config.spaces.enabled) {
    console.error('DigitalOcean Spaces is not configured. Set DO_SPACES_* env vars.');
    process.exit(1);
  }

  if (rollback) {
    await rollbackMigration();
    return;
  }

  if (verify) {
    await verifyMigration();
    return;
  }

  if (!dryRun && !execute) {
    console.log('Usage:');
    console.log('  node scripts/migrate-spaces-structure.js --dry-run');
    console.log('  node scripts/migrate-spaces-structure.js --execute');
    console.log('  node scripts/migrate-spaces-structure.js --verify');
    console.log('  node scripts/migrate-spaces-structure.js --rollback');
    process.exit(0);
  }

  console.log(`[migration] Starting ${dryRun ? 'dry-run' : 'execute'} migration...`);
  console.log(`[migration] Root folder: ${config.spaces.rootFolder}`);
  console.log(`[migration] Legacy prefix: ${getLegacyDuplicatedPrefix()}`);

  const { moved, skipped } = await migrateObjects({ dryRun });
  const dbUpdated = await updateDatabasePaths({ dryRun });

  console.log(`[migration] Objects moved: ${moved.length}, skipped: ${skipped.length}`);
  console.log(`[migration] Database records updated: ${dbUpdated}`);

  if (!dryRun && moved.length) {
    saveManifest({ moved, dbUpdated: dbUpdated > 0, migratedAt: new Date().toISOString() });
    await verifyMigration();
  }

  console.log('[migration] Done.');
}

main().catch((err) => {
  console.error('[migration] Failed:', err.message);
  process.exit(1);
});
