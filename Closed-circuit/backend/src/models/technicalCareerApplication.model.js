import { db } from '../config/database.js';

export async function insertTechnicalCareerApplication(data) {
  const [result] = await db.query(
    `INSERT INTO technical_career_applications (
      fullName, emailId, mobileNumber, latestEducation, specialization, yearOfPassout, universityCollege,
      totalExperience, relevantExperience, currentLastCompany, currentLastDesignation,
      currentLocation, city, district, state, pinCode, expectedSalary, noticePeriod,
      linkedinProfile, githubPortfolio,
      resume_key, resume_url, resume_filename, email_verified, mobile_verified, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.fullName,
      data.emailId,
      data.mobileNumber,
      data.latestEducation,
      data.specialization,
      data.yearOfPassout,
      data.universityCollege,
      data.totalExperience,
      data.relevantExperience,
      data.currentLastCompany,
      data.currentLastDesignation,
      data.currentLocation,
      data.city,
      data.district,
      data.state,
      data.pinCode,
      data.expectedSalary,
      data.noticePeriod,
      data.linkedinProfile,
      data.githubPortfolio,
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

export async function findTechnicalCareerApplicationById(id) {
  const [rows] = await db.query(
    'SELECT * FROM technical_career_applications WHERE id = ? LIMIT 1',
    [id]
  );
  return rows[0] || null;
}

export async function findTechnicalCareerApplications({
  search,
  status,
  dateFrom,
  dateTo,
  limit,
  offset,
}) {
  const conditions = [];
  const params = [];

  if (search) {
    conditions.push(
      '(fullName LIKE ? OR emailId LIKE ? OR mobileNumber LIKE ? OR latestEducation LIKE ? OR specialization LIKE ? OR status LIKE ?)'
    );
    const term = `%${search}%`;
    params.push(term, term, term, term, term, term);
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
    `SELECT COUNT(*) AS total FROM technical_career_applications ${whereClause}`,
    params
  );

  const [rows] = await db.query(
    `SELECT * FROM technical_career_applications ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return {
    rows,
    total: countRows[0]?.total || 0,
  };
}

export async function updateTechnicalCareerApplicationStatus(id, status) {
  await db.query('UPDATE technical_career_applications SET status = ? WHERE id = ?', [status, id]);
}

export async function countAllTechnicalCareerApplications() {
  const [rows] = await db.query('SELECT COUNT(*) AS total FROM technical_career_applications');
  return rows[0]?.total || 0;
}
