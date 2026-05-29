import { db } from '../config/database.js';

const ENQUIRY_COLUMNS = `
  id, name, email, phone, message, source_page, ip_address, created_at, updated_at
`;

export async function insertEnquiry({ name, email, phone, message, sourcePage, ipAddress }) {
  const [result] = await db.query(
    `INSERT INTO enquiries (name, email, phone, message, source_page, ip_address)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, email, phone, message, sourcePage || null, ipAddress || null]
  );

  return result.insertId;
}

export async function findEnquiryById(id) {
  const [rows] = await db.query(
    `SELECT ${ENQUIRY_COLUMNS} FROM enquiries WHERE id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

export async function findEnquiries({ search, dateFrom, dateTo, page, limit }) {
  const conditions = [];
  const params = [];

  if (search) {
    conditions.push('(name LIKE ? OR email LIKE ? OR phone LIKE ? OR message LIKE ?)');
    const term = `%${search}%`;
    params.push(term, term, term, term);
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

  const [countRows] = await db.query(
    `SELECT COUNT(*) AS total FROM enquiries ${whereClause}`,
    params
  );
  const total = countRows[0]?.total || 0;

  const offset = (page - 1) * limit;
  const [rows] = await db.query(
    `SELECT ${ENQUIRY_COLUMNS}
     FROM enquiries
     ${whereClause}
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return { rows, total, page, limit };
}

export async function findEnquiriesForExport({ search, dateFrom, dateTo }) {
  const conditions = [];
  const params = [];

  if (search) {
    conditions.push('(name LIKE ? OR email LIKE ? OR phone LIKE ? OR message LIKE ?)');
    const term = `%${search}%`;
    params.push(term, term, term, term);
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

  const [rows] = await db.query(
    `SELECT ${ENQUIRY_COLUMNS}
     FROM enquiries
     ${whereClause}
     ORDER BY created_at DESC`,
    params
  );

  return rows;
}
