import { insertNotificationLog } from '../models/notificationLog.model.js';
import { truncateSafe } from '../utils/templateRender.js';

export async function logNotificationAttempt({
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
  try {
    await insertNotificationLog({
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
      providerResponse: truncateSafe(providerResponse, 500),
      errorMessage: truncateSafe(errorMessage, 500),
      sentAt,
    });
  } catch (err) {
    console.error('[notification-log] Failed to write log:', err.message);
  }
}
