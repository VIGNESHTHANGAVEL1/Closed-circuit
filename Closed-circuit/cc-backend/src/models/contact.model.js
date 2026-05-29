import { db } from '../config/database.js';

const CONTACT_COLUMNS = `
  id, fullName, mobileNumber, emailId, town, state, country,
  lookingFor, preferredContactMethod, preferredDate, preferredTime,
  description, created_at
`;

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
     (fullName, mobileNumber, emailId, town, state, country, lookingFor, preferredContactMethod, preferredDate, preferredTime, description)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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

function buildSearchClause(search) {
  if (!search) {
    return { clause: '', params: [] };
  }

  const term = `%${search}%`;
  const clause = `WHERE (
    fullName LIKE ? OR emailId LIKE ? OR mobileNumber LIKE ? OR town LIKE ? OR
    state LIKE ? OR country LIKE ? OR lookingFor LIKE ? OR description LIKE ?
  )`;

  return {
    clause,
    params: [term, term, term, term, term, term, term, term],
  };
}

export async function findContacts({ search, dateFrom, dateTo, page, limit }) {
  const { clause: searchClause, params: searchParams } = buildSearchClause(search);
  const conditions = [];
  const params = [...searchParams];

  if (searchClause) {
    conditions.push(searchClause.replace(/^WHERE /, ''));
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

export async function findContactsForExport({ search, dateFrom, dateTo }) {
  const { clause: searchClause, params: searchParams } = buildSearchClause(search);
  const conditions = [];
  const params = [...searchParams];

  if (searchClause) {
    conditions.push(searchClause.replace(/^WHERE /, ''));
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
    `SELECT ${CONTACT_COLUMNS}
     FROM contacts
     ${whereClause}
     ORDER BY created_at DESC, id DESC`,
    params
  );

  return rows;
}
