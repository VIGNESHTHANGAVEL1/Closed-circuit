import { db } from '../config/database.js';

const CLIENT_COLUMNS = `
  id, name, mobile_number, email_id, address, client_type, business_type,
  onboard_date, client_logo_key, client_logo_url, client_profile_pic_key,
  client_profile_pic_url, domain_url, created_at, updated_at
`;

function buildClientFilterClauses({ search, clientType }) {
  const conditions = [];
  const params = [];

  if (search) {
    const term = `%${search}%`;
    conditions.push(`(
      name LIKE ? OR mobile_number LIKE ? OR email_id LIKE ? OR
      business_type LIKE ? OR address LIKE ? OR domain_url LIKE ?
    )`);
    params.push(term, term, term, term, term, term);
  }

  if (clientType === 'b2b' || clientType === 'b2c') {
    conditions.push('client_type = ?');
    params.push(clientType);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  return { whereClause, params };
}

export async function insertClient(data) {
  const [result] = await db.query(
    `INSERT INTO clients
     (name, mobile_number, email_id, address, client_type, business_type, onboard_date,
      client_logo_key, client_logo_url, client_profile_pic_key, client_profile_pic_url, domain_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.name,
      data.mobile_number,
      data.email_id,
      data.address || null,
      data.client_type,
      data.business_type,
      data.onboard_date,
      data.client_logo_key || null,
      data.client_logo_url || null,
      data.client_profile_pic_key || null,
      data.client_profile_pic_url || null,
      data.domain_url || null,
    ]
  );
  return result.insertId;
}

export async function findClientById(id) {
  const [rows] = await db.query(
    `SELECT ${CLIENT_COLUMNS} FROM clients WHERE id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

export async function updateClient(id, data) {
  const [result] = await db.query(
    `UPDATE clients SET
      name = ?,
      mobile_number = ?,
      email_id = ?,
      address = ?,
      client_type = ?,
      business_type = ?,
      onboard_date = ?,
      client_logo_key = ?,
      client_logo_url = ?,
      client_profile_pic_key = ?,
      client_profile_pic_url = ?,
      domain_url = ?
     WHERE id = ?`,
    [
      data.name,
      data.mobile_number,
      data.email_id,
      data.address || null,
      data.client_type,
      data.business_type,
      data.onboard_date,
      data.client_logo_key || null,
      data.client_logo_url || null,
      data.client_profile_pic_key || null,
      data.client_profile_pic_url || null,
      data.domain_url || null,
      id,
    ]
  );
  return result.affectedRows > 0;
}

export async function deleteClient(id) {
  const [result] = await db.query(`DELETE FROM clients WHERE id = ?`, [id]);
  return result.affectedRows > 0;
}

export async function findClients({ search, clientType, page, limit }) {
  const { whereClause, params } = buildClientFilterClauses({ search, clientType });

  const [countRows] = await db.query(
    `SELECT COUNT(*) AS total FROM clients ${whereClause}`,
    params
  );
  const total = countRows[0]?.total || 0;

  const offset = (page - 1) * limit;
  const [rows] = await db.query(
    `SELECT ${CLIENT_COLUMNS}
     FROM clients
     ${whereClause}
     ORDER BY onboard_date DESC, id DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return { rows, total, page, limit };
}

export async function findAllClientsPublic() {
  const [rows] = await db.query(
    `SELECT id, name, client_type, business_type, onboard_date,
            client_logo_url, client_profile_pic_url, domain_url
     FROM clients
     ORDER BY onboard_date DESC, name ASC`
  );
  return rows;
}

export async function countAllClients() {
  const [rows] = await db.query(`SELECT COUNT(*) AS total FROM clients`);
  return rows[0]?.total || 0;
}
