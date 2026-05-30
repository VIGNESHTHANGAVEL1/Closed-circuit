import { db } from '../config/database.js';
import { DEFAULT_ENQUIRY_STATUS } from '../constants/enquiryStatus.js';

const CONTACT_COLUMNS = `
  id, fullName, mobileNumber, emailId, town, state, country,
  lookingFor, preferredContactMethod, preferredDate, preferredTime,
  description, status, created_at
`;

function buildFilterClauses({ search, status, dateFrom, dateTo }) {
  const conditions = [];
  const params = [];

  if (search) {
    const term = `%${search}%`;
    conditions.push(`(
      fullName LIKE ? OR emailId LIKE ? OR mobileNumber LIKE ? OR town LIKE ? OR
      state LIKE ? OR country LIKE ? OR lookingFor LIKE ? OR description LIKE ? OR
      COALESCE(status, ?) LIKE ?
    )`);
    params.push(term, term, term, term, term, term, term, term, DEFAULT_ENQUIRY_STATUS, term);
  }

  if (status) {
    conditions.push('COALESCE(status, ?) = ?');
    params.push(DEFAULT_ENQUIRY_STATUS, status);
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
  return { whereClause, params };
}

export async function insertContact({
  fullName,
  mobileNumber,
  emailId,
  town,
  state,
  country,
  lookingFor,
  preferredContactMethod,
  preferredDate,
  preferredTime,
  description,
}) {
  const [result] = await db.query(
    `INSERT INTO contacts
     (fullName, mobileNumber, emailId, town, state, country, lookingFor, preferredContactMethod, preferredDate, preferredTime, description, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      fullName,
      mobileNumber,
      emailId,
      town,
      state,
      country,
      lookingFor,
      preferredContactMethod,
      preferredDate,
      preferredTime,
      description || null,
      DEFAULT_ENQUIRY_STATUS,
    ]
  );

  return result.insertId;
}

export async function findContactById(id) {
  const [rows] = await db.query(
    `SELECT ${CONTACT_COLUMNS} FROM contacts WHERE id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

export async function updateContactStatus(id, status) {
  const [result] = await db.query(
    `UPDATE contacts SET status = ? WHERE id = ?`,
    [status, id]
  );
  return result.affectedRows > 0;
}

export async function findContacts({ search, status, dateFrom, dateTo, page, limit }) {
  const { whereClause, params } = buildFilterClauses({ search, status, dateFrom, dateTo });

  const [countRows] = await db.query(
    `SELECT COUNT(*) AS total FROM contacts ${whereClause}`,
    params
  );
  const total = countRows[0]?.total || 0;

  const offset = (page - 1) * limit;
  const [rows] = await db.query(
    `SELECT ${CONTACT_COLUMNS}
     FROM contacts
     ${whereClause}
     ORDER BY created_at DESC, id DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return { rows, total, page, limit };
}

export async function findContactsForExport({ search, status, dateFrom, dateTo }) {
  const { whereClause, params } = buildFilterClauses({ search, status, dateFrom, dateTo });

  const [rows] = await db.query(
    `SELECT ${CONTACT_COLUMNS}
     FROM contacts
     ${whereClause}
     ORDER BY created_at DESC, id DESC`,
    params
  );

  return rows;
}

export async function countContactsByStatus(status) {
  const [rows] = await db.query(
    `SELECT COUNT(*) AS total FROM contacts WHERE COALESCE(status, ?) = ?`,
    [DEFAULT_ENQUIRY_STATUS, status]
  );
  return rows[0]?.total || 0;
}

export async function countAllContacts() {
  const [rows] = await db.query(`SELECT COUNT(*) AS total FROM contacts`);
  return rows[0]?.total || 0;
}
