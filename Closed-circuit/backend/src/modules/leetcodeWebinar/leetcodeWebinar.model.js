import { db } from '../../config/database.js';
import { buildPrefixSearchClause } from '../webinar/webinarSearch.js';

const TABLE = 'leetcode_webinar_participations';
const REVIEW_VISIBLE_SQL = `reviewComment IS NOT NULL AND TRIM(reviewComment) <> ''`;

export async function insertWebinarParticipation(data) {
  const [result] = await db.query(
    `INSERT INTO ${TABLE} (
      fullName, emailId, mobileNumber, branch, yearOfPassout, college, university,
      city, state, pinCode, webinarAttendanceDate, reviewComment, rating,
      email_verified, mobile_verified, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
      data.status,
    ]
  );
  return result.insertId;
}

export async function findWebinarParticipationById(id) {
  const [rows] = await db.query(`SELECT * FROM ${TABLE} WHERE id = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

export async function findWebinarReviews({ search, limit, offset }) {
  const conditions = [REVIEW_VISIBLE_SQL];
  const params = [];

  const { clause, params: searchParams } = buildPrefixSearchClause(search);
  if (clause) {
    conditions.push(clause);
    params.push(...searchParams);
  }

  const whereClause = `WHERE ${conditions.join(' AND ')}`;

  const [countRows] = await db.query(`SELECT COUNT(*) AS total FROM ${TABLE} ${whereClause}`, params);

  const [rows] = await db.query(
    `SELECT id, fullName, college, university, city, state, rating, reviewComment,
            webinarAttendanceDate, created_at
     FROM ${TABLE}
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
     FROM ${TABLE}
     WHERE ${REVIEW_VISIBLE_SQL}`
  );
  const row = rows[0] || {};
  return {
    reviewCount: Number(row.reviewCount) || 0,
    averageRating: row.averageRating !== null ? Number(row.averageRating) : null,
  };
}

export async function findWebinarParticipationsAdmin({ search, status, dateFrom, dateTo, limit, offset }) {
  const conditions = [];
  const params = [];

  if (search) {
    conditions.push(
      '(fullName LIKE ? OR emailId LIKE ? OR mobileNumber LIKE ? OR college LIKE ? OR university LIKE ? OR city LIKE ? OR status LIKE ?)'
    );
    const term = `%${search}%`;
    params.push(term, term, term, term, term, term, term);
  }

  if (status) {
    conditions.push('status = ?');
    params.push(status);
  }

  if (dateFrom) {
    conditions.push('DATE(created_at) >= ?');
    params.push(dateFrom);
  }

  if (dateTo) {
    conditions.push('DATE(created_at) <= ?');
    params.push(dateTo);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const [countRows] = await db.query(`SELECT COUNT(*) AS total FROM ${TABLE} ${whereClause}`, params);

  const [rows] = await db.query(
    `SELECT * FROM ${TABLE} ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return { rows, total: countRows[0]?.total || 0 };
}

export async function updateWebinarParticipationStatus(id, status) {
  await db.query(`UPDATE ${TABLE} SET status = ? WHERE id = ?`, [status, id]);
}

export async function countAllWebinarParticipations() {
  const [rows] = await db.query(`SELECT COUNT(*) AS total FROM ${TABLE}`);
  return rows[0]?.total || 0;
}
