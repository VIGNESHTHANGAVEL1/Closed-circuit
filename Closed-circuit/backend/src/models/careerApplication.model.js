import { db } from '../config/database.js';

export async function insertCareerApplication(data) {
  const [result] = await db.query(
    `INSERT INTO career_applications (
      fullName, emailId, mobileNumber, latestEducation, currentLocation, city, district, state,
      salesExperience, callsPerDay, closuresPerDay, languages,
      hasLaptop, hasMobilePhone, hasSeparateSim, hasWorkstation, hasInternet,
      reviewedProduct, watchedProductVideo, watchedCareerVideo, productUnderstanding,
      resume_key, resume_url, resume_filename, email_verified, mobile_verified, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.fullName,
      data.emailId,
      data.mobileNumber,
      data.latestEducation,
      data.currentLocation,
      data.city,
      data.district,
      data.state,
      data.salesExperience,
      data.callsPerDay,
      data.closuresPerDay,
      data.languages,
      data.hasLaptop,
      data.hasMobilePhone,
      data.hasSeparateSim,
      data.hasWorkstation,
      data.hasInternet,
      data.reviewedProduct,
      data.watchedProductVideo,
      data.watchedCareerVideo,
      data.productUnderstanding,
      data.resume_key,
      data.resume_url,
      data.resume_filename,
      data.email_verified ? 1 : 0,
      data.mobile_verified ? 1 : 0,
      data.status,
    ]
  );

  return result.insertId;
}

export async function findCareerApplicationById(id) {
  const [rows] = await db.query('SELECT * FROM career_applications WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

export async function findCareerApplications({ search, status, dateFrom, dateTo, limit, offset }) {
  const conditions = [];
  const params = [];

  if (search) {
    conditions.push(
      '(fullName LIKE ? OR emailId LIKE ? OR mobileNumber LIKE ? OR latestEducation LIKE ? OR status LIKE ?)'
    );
    const term = `%${search}%`;
    params.push(term, term, term, term, term);
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

  const [countRows] = await db.query(
    `SELECT COUNT(*) AS total FROM career_applications ${whereClause}`,
    params
  );

  const [rows] = await db.query(
    `SELECT * FROM career_applications ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return {
    rows,
    total: countRows[0]?.total || 0,
  };
}

export async function updateCareerApplicationStatus(id, status) {
  await db.query('UPDATE career_applications SET status = ? WHERE id = ?', [status, id]);
}

export async function countCareerApplicationsByStatus() {
  const [rows] = await db.query(
    `SELECT status, COUNT(*) AS count FROM career_applications GROUP BY status`
  );
  return rows;
}

export async function countAllCareerApplications() {
  const [rows] = await db.query('SELECT COUNT(*) AS total FROM career_applications');
  return rows[0]?.total || 0;
}
