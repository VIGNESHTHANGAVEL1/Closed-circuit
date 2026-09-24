/**
 * One-time helper: rewrite stored CDN URLs/keys from legacy root "Closed Circuit" to current DO_SPACES_ROOT_FOLDER.
 *
 * Usage (after setting DO_SPACES_ROOT_FOLDER=cc-website in .env):
 *   node scripts/update-spaces-root-urls.js
 */
import dotenv from 'dotenv';
import { bootstrapDatabase } from '../src/config/bootstrap.js';
import { config } from '../src/config/env.js';
import { db } from '../src/config/database.js';
import { getPool } from '../src/config/database.js';

dotenv.config();

const LEGACY = 'Closed Circuit';
const ROOT = config.spaces.rootFolder;

function rewrite(value) {
  if (!value || typeof value !== 'string') {
    return value;
  }
  const encodedLegacy = encodeURIComponent(LEGACY);
  return value
    .replace(new RegExp(encodedLegacy, 'gi'), encodeURIComponent(ROOT))
    .replace(new RegExp(LEGACY.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), ROOT);
}

async function main() {
  if (ROOT === LEGACY) {
    console.log('Root folder unchanged — no update needed.');
    return;
  }

  await bootstrapDatabase();

  const [clientResult] = await db.query(
    `UPDATE clients SET
      client_logo_key = REPLACE(client_logo_key, ?, ?),
      client_logo_url = REPLACE(client_logo_url, ?, ?),
      client_profile_pic_key = REPLACE(client_profile_pic_key, ?, ?),
      client_profile_pic_url = REPLACE(client_profile_pic_url, ?, ?)
     WHERE client_logo_key LIKE ? OR client_logo_url LIKE ?
        OR client_profile_pic_key LIKE ? OR client_profile_pic_url LIKE ?`,
    [
      `${LEGACY}/`,
      `${ROOT}/`,
      LEGACY,
      ROOT,
      `${LEGACY}/`,
      `${ROOT}/`,
      LEGACY,
      ROOT,
      `${LEGACY}%`,
      `%${LEGACY}%`,
      `${LEGACY}%`,
      `%${LEGACY}%`,
    ]
  );

  const [videoResult] = await db.query(
    `UPDATE demo_videos SET
      video_key = REPLACE(video_key, ?, ?),
      video_url = REPLACE(video_url, ?, ?)
     WHERE video_key LIKE ? OR video_url LIKE ?`,
    [`${LEGACY}/`, `${ROOT}/`, LEGACY, ROOT, `${LEGACY}%`, `%${LEGACY}%`]
  );

  const [careerResult] = await db.query(
    `UPDATE career_applications SET
      resume_key = REPLACE(resume_key, ?, ?),
      resume_url = REPLACE(resume_url, ?, ?)
     WHERE resume_key LIKE ? OR resume_url LIKE ?`,
    [`${LEGACY}/`, `${ROOT}/`, LEGACY, ROOT, `${LEGACY}%`, `%${LEGACY}%`]
  );

  console.log(`✅ Updated clients rows: ${clientResult.affectedRows || 0}`);
  console.log(`✅ Updated demo_videos rows: ${videoResult.affectedRows || 0}`);
  console.log(`✅ Updated career_applications rows: ${careerResult.affectedRows || 0}`);
  console.log(`Root folder: ${LEGACY} → ${ROOT}`);

  try {
    await getPool().end();
  } catch {
    // ignore
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
