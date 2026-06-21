import { db } from '../config/database.js';

export async function insertNotificationLog({
  tenantId = null,
  inquiryId = null,
  recipientType,
  channel,
  notificationType,
  recipientName,
  recipientEmail = null,
  recipientMobile = null,
  templateKey,
  templateId = null,
  status,
  providerResponse = null,
  errorMessage = null,
  sentAt = null,
}) {
  const [result] = await db.query(
    `INSERT INTO notification_logs (
      tenant_id, inquiry_id, recipient_type, channel, notification_type,
      recipient_name, recipient_email, recipient_mobile, template_key, template_id,
      status, provider_response, error_message, sent_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      tenantId,
      inquiryId,
      recipientType,
      channel,
      notificationType,
      recipientName,
      recipientEmail,
      recipientMobile,
      templateKey,
      templateId,
      status,
      providerResponse,
      errorMessage,
      sentAt,
    ]
  );
  return result.insertId;
}
