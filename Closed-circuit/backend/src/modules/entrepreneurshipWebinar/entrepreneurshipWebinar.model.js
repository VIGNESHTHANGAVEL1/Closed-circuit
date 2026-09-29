import { db } from '../../config/database.js';

export async function insertWebinarParticipation(data) {
  const [result] = await db.query(
    `INSERT INTO entrepreneurship_webinar_participations (
      fullName, emailId, mobileNumber, branch, yearOfPassout, college, university,
      city, state, pinCode, webinarAttendanceDate, reviewComment, rating,
      email_verified, mobile_verified
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.fullName,
      data.emailId,
      data.mobileNumber,
      data.branch,
      data.yearOfPassout,
      data.college,
      data.university,
      data.city,
      data.state,
      data.pinCode,
      data.webinarAttendanceDate,
      data.reviewComment || null,
      data.rating ?? null,
      data.email_verified ? 1 : 0,
      data.mobile_verified ? 1 : 0,
    ]
  );
  return result.insertId;
}

export async function findWebinarParticipationById(id) {
  const [rows] = await db.query(
    `SELECT * FROM entrepreneurship_webinar_participations WHERE id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

const REVIEW_VISIBLE_SQL = `reviewComment IS NOT NULL AND TRIM(reviewComment) <> ''`;

export async function findWebinarReviews({ search, limit, offset }) {
  const conditions = [REVIEW_VISIBLE_SQL];
  const params = [];

  if (search) {
    conditions.push(
      `(fullName LIKE ? OR college LIKE ? OR university LIKE ? OR city LIKE ? OR reviewComment LIKE ?)`
    );
    const term = `%${search}%`;
    params.push(term, term, term, term, term);
  }

  const whereClause = `WHERE ${conditions.join(' AND ')}`;

  const [countRows] = await db.query(
    `SELECT COUNT(*) AS total FROM entrepreneurship_webinar_participations ${whereClause}`,
    params
  );

  const [rows] = await db.query(
    `SELECT id, fullName, college, university, city, state, rating, reviewComment,
            webinarAttendanceDate, created_at
     FROM entrepreneurship_webinar_participations
     ${whereClause}
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return {
    rows,
    total: countRows[0]?.total || 0,
  };
}

export async function getWebinarReviewStats() {
  const [rows] = await db.query(
    `SELECT
       COUNT(*) AS reviewCount,
       AVG(CASE WHEN rating BETWEEN 1 AND 5 THEN rating END) AS averageRating
     FROM entrepreneurship_webinar_participations
     WHERE ${REVIEW_VISIBLE_SQL}`
  );
  const row = rows[0] || {};
  return {
    reviewCount: Number(row.reviewCount) || 0,
    averageRating: row.averageRating !== null ? Number(row.averageRating) : null,
  };
}
