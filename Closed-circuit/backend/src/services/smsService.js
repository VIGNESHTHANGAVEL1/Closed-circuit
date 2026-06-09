import { config } from '../config/env.js';
import { buildSmsMessage } from './templateService.js';
import { logNotificationAttempt } from './notificationLogService.js';
import { truncateSafe } from '../utils/templateRender.js';

function normalizeMobile(mobile) {
  const digits = String(mobile || '').replace(/\D/g, '');
  if (digits.length === 10) {
    return digits;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }
  return digits;
}

export async function sendTemplateSms({
  mobile,
  templateKey,
  variables = [],
  recipientType = 'CLIENT',
  notificationType,
  recipientName,
  inquiryId = null,
}) {
  const sentAt = new Date();
  const normalizedMobile = normalizeMobile(mobile);

  if (!config.sms.enabled) {
    await logNotificationAttempt({
      inquiryId,
      recipientType,
      channel: 'SMS',
      notificationType,
      recipientName,
      recipientMobile: normalizedMobile,
      templateKey,
      status: 'SKIPPED',
      errorMessage: 'SMS gateway not configured',
    });
    return { success: false, skipped: true };
  }

  try {
    const { template, message } = await buildSmsMessage(templateKey, variables);
    const senderId = template.sender_id || config.sms.senderId;
    const variablesValues = variables.map((value) => String(value ?? '')).join('|');

    const url = new URL(config.sms.gatewayUrl);
    const body = {
      authorization: config.sms.apiKey,
      route: 'dlt',
      sender_id: senderId,
      message: template.template_id,
      variables_values: variablesValues,
      numbers: normalizedMobile,
      flash: '0',
    };

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const responseText = await response.text();
    let providerResponse = truncateSafe(responseText, 500);

    if (!response.ok) {
      throw new Error(providerResponse || `SMS gateway returned ${response.status}`);
    }

    await logNotificationAttempt({
      inquiryId,
      recipientType,
      channel: 'SMS',
      notificationType,
      recipientName,
      recipientMobile: normalizedMobile,
      templateKey,
      templateId: template.template_id,
      status: 'SENT',
      providerResponse,
      sentAt,
    });

    if (process.env.NODE_ENV === 'development') {
      console.log(`[sms] Sent ${templateKey} to ${normalizedMobile.slice(0, 2)}****`);
    }

    return { success: true, message };
  } catch (err) {
    await logNotificationAttempt({
      inquiryId,
      recipientType,
      channel: 'SMS',
      notificationType,
      recipientName,
      recipientMobile: normalizedMobile,
      templateKey,
      status: 'FAILED',
      errorMessage: truncateSafe(err.message, 500),
    });
    console.error(`[sms] Failed to send ${templateKey}:`, err.message);
    return { success: false, error: err.message };
  }
}
