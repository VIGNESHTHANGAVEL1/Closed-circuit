import { db } from '../config/database.js';

export async function findSmsTemplateByKey(templateKey) {
  const [rows] = await db.query(
    `SELECT id, template_key, template_id, template_name, sender_id, template_content, is_active
     FROM sms_templates
     WHERE template_key = ? AND is_active = 1
     LIMIT 1`,
    [templateKey]
  );
  return rows[0] || null;
}

export async function countSmsTemplateByKey(templateKey) {
  const [rows] = await db.query(
    `SELECT COUNT(*) AS total FROM sms_templates WHERE template_key = ?`,
    [templateKey]
  );
  return rows[0]?.total || 0;
}

export async function insertSmsTemplate({
  templateKey,
  templateId,
  templateName,
  senderId,
  templateContent,
}) {
  await db.query(
    `INSERT INTO sms_templates (template_key, template_id, template_name, sender_id, template_content)
     VALUES (?, ?, ?, ?, ?)`,
    [templateKey, templateId, templateName, senderId, templateContent]
  );
}
