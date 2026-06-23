import { db } from '../config/database.js';

const DEMO_VIDEO_COLUMNS = `
  id, title, video_url, video_key, display_order, created_at, updated_at
`;

function buildSearchClause(search) {
  if (!search?.trim()) {
    return { whereClause: '', params: [] };
  }

  return {
    whereClause: 'WHERE title LIKE ?',
    params: [`%${search.trim()}%`],
  };
}

/** Insert a new demo video record with auto-incremented display order. */
export async function insertDemoVideo({ title, videoUrl, videoKey }) {
  const [maxRows] = await db.query(
    'SELECT COALESCE(MAX(display_order), 0) AS max_order FROM demo_videos'
  );
  const displayOrder = (maxRows[0]?.max_order || 0) + 1;

  const [result] = await db.query(
    `INSERT INTO demo_videos (title, video_url, video_key, display_order)
     VALUES (?, ?, ?, ?)`,
    [title, videoUrl, videoKey || null, displayOrder]
  );

  return result.insertId;
}

export async function findDemoVideoById(id) {
  const [rows] = await db.query(
    `SELECT ${DEMO_VIDEO_COLUMNS} FROM demo_videos WHERE id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

export async function findAllDemoVideosPublic() {
  const [rows] = await db.query(
    `SELECT id, title, video_url AS videoUrl
     FROM demo_videos
     ORDER BY display_order ASC, id ASC`
  );
  return rows;
}

export async function findDemoVideos({ search, page, limit }) {
  const { whereClause, params } = buildSearchClause(search);

  const [countRows] = await db.query(
    `SELECT COUNT(*) AS total FROM demo_videos ${whereClause}`,
    params
  );
  const total = countRows[0]?.total || 0;

  const offset = (page - 1) * limit;
  const [rows] = await db.query(
    `SELECT ${DEMO_VIDEO_COLUMNS}
     FROM demo_videos
     ${whereClause}
     ORDER BY display_order ASC, id ASC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return { rows, total, page, limit };
}

export async function updateDemoVideo(id, data) {
  const fields = [];
  const params = [];

  if (data.title !== undefined) {
    fields.push('title = ?');
    params.push(data.title);
  }
  if (data.video_url !== undefined) {
    fields.push('video_url = ?');
    params.push(data.video_url);
  }
  if (data.video_key !== undefined) {
    fields.push('video_key = ?');
    params.push(data.video_key);
  }
  if (data.display_order !== undefined) {
    fields.push('display_order = ?');
    params.push(data.display_order);
  }

  if (!fields.length) {
    return false;
  }

  params.push(id);
  const [result] = await db.query(
    `UPDATE demo_videos SET ${fields.join(', ')} WHERE id = ?`,
    params
  );
  return result.affectedRows > 0;
}

export async function deleteDemoVideo(id) {
  const [result] = await db.query('DELETE FROM demo_videos WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

/** Update client image URLs/keys after Spaces folder migration. */
export async function updateClientImagePaths(oldPrefix, newPrefix) {
  const [clients] = await db.query(
    `SELECT id, client_logo_key, client_logo_url, client_profile_pic_key, client_profile_pic_url
     FROM clients
     WHERE client_logo_key LIKE ? OR client_profile_pic_key LIKE ?
        OR client_logo_url LIKE ? OR client_profile_pic_url LIKE ?`,
    [`${oldPrefix}%`, `${oldPrefix}%`, `%${oldPrefix}%`, `%${oldPrefix}%`]
  );

  let updated = 0;
  for (const client of clients) {
    const logoKey = client.client_logo_key?.replace(oldPrefix, newPrefix) || client.client_logo_key;
    const logoUrl = client.client_logo_url?.replace(oldPrefix, newPrefix) || client.client_logo_url;
    const profileKey =
      client.client_profile_pic_key?.replace(oldPrefix, newPrefix) || client.client_profile_pic_key;
    const profileUrl =
      client.client_profile_pic_url?.replace(oldPrefix, newPrefix) || client.client_profile_pic_url;

    await db.query(
      `UPDATE clients SET
        client_logo_key = ?, client_logo_url = ?,
        client_profile_pic_key = ?, client_profile_pic_url = ?
       WHERE id = ?`,
      [logoKey, logoUrl, profileKey, profileUrl, client.id]
    );
    updated += 1;
  }

  return updated;
}
