import { db } from '../config/database.js';
import { DEFAULT_ENQUIRY_STATUS } from '../constants/enquiryStatus.js';

const CONTACT_COLUMNS = `
  id, fullName, mobileNumber, emailId, town, state, country,
  lookingFor, preferredContactMethod, preferredDate, preferredTime,
  description, status, client_reminder_email_sent, client_reminder_sms_sent,
  admin_reminder_email_sent, admin_reminder_sms_sent, reminder_sent_at, created_at
`;

const EXCLUDED_REMINDER_STATUSES = [
  'Rejected temporarily',
  'Rejected permanently',
  'Closed',
];

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

export async function countTodayScheduledContacts(todayDate) {
  const [rows] = await db.query(
    `SELECT COUNT(*) AS total FROM contacts WHERE preferredDate = ?`,
    [todayDate]
  );
  return rows[0]?.total || 0;
}

export async function findContactsDueForReminder() {
  const placeholders = EXCLUDED_REMINDER_STATUSES.map(() => '?').join(', ');
  const [rows] = await db.query(
    `SELECT ${CONTACT_COLUMNS}
     FROM contacts
     WHERE COALESCE(status, 'New') NOT IN (${placeholders})
       AND (
         client_reminder_email_sent = 0 OR
         client_reminder_sms_sent = 0 OR
         admin_reminder_email_sent = 0 OR
         admin_reminder_sms_sent = 0
       )
       AND preferredDate IS NOT NULL
       AND preferredDate != ''
       AND preferredTime IS NOT NULL
       AND preferredTime != ''`,
    EXCLUDED_REMINDER_STATUSES
  );
  return rows;
}

export async function updateContactReminderFlags(id, flags) {
  const assignments = [];
  const params = [];

  const allowed = [
    'client_reminder_email_sent',
    'client_reminder_sms_sent',
    'admin_reminder_email_sent',
    'admin_reminder_sms_sent',
    'reminder_sent_at',
  ];

  for (const key of allowed) {
    if (flags[key] !== undefined) {
      assignments.push(`${key} = ?`);
      params.push(flags[key]);
    }
  }

  if (!assignments.length) {
    return false;
  }

  params.push(id);
  const [result] = await db.query(
    `UPDATE contacts SET ${assignments.join(', ')} WHERE id = ?`,
    params
  );
  return result.affectedRows > 0;
}
