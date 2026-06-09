import { db } from '../config/database.js';

export async function findEmailTemplateByKey(templateKey) {
  const [rows] = await db.query(
    `SELECT id, template_key, template_name, subject, html_content, is_active
     FROM email_templates
     WHERE template_key = ? AND is_active = 1
     LIMIT 1`,
    [templateKey]
  );
  return rows[0] || null;
}

export async function countEmailTemplateByKey(templateKey) {
  const [rows] = await db.query(
    `SELECT COUNT(*) AS total FROM email_templates WHERE template_key = ?`,
    [templateKey]
  );
  return rows[0]?.total || 0;
}

export async function insertEmailTemplate({
  templateKey,
  templateName,
  subject,
  htmlContent,
}) {
  await db.query(
    `INSERT INTO email_templates (template_key, template_name, subject, html_content)
     VALUES (?, ?, ?, ?)`,
    [templateKey, templateName, subject, htmlContent]
  );
}
