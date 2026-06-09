import nodemailer from 'nodemailer';
import { config } from '../config/env.js';
import { buildEmailMessage } from './templateService.js';
import { logNotificationAttempt } from './notificationLogService.js';
import { truncateSafe } from '../utils/templateRender.js';

let transporter = null;

function getTransporter() {
  if (!config.smtp.enabled) {
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
    });
  }

  return transporter;
}

function normalizeMobileForLog(mobile) {
  if (!mobile) return null;
  const digits = String(mobile).replace(/\D/g, '');
  if (digits.length < 4) return '****';
  return `${digits.slice(0, 2)}****${digits.slice(-2)}`;
}

export async function sendTemplateEmail({
  to,
  templateKey,
  variables = {},
  recipientType = 'CLIENT',
  notificationType,
  recipientName,
  inquiryId = null,
}) {
  const sentAt = new Date();

  if (!config.smtp.enabled) {
    console.warn(`[email] SKIPPED ${templateKey} → ${to} | SMTP not configured in .env`);
    await logNotificationAttempt({
      inquiryId,
      recipientType,
      channel: 'EMAIL',
      notificationType,
      recipientName,
      recipientEmail: to,
      recipientMobile: normalizeMobileForLog(variables.mobileNumber),
      templateKey,
      status: 'SKIPPED',
      errorMessage: 'SMTP not configured',
    });
    return { success: false, skipped: true, reason: 'SMTP not configured in .env' };
  }

  try {
    const { template, subject, html } = await buildEmailMessage(templateKey, variables);
    console.log(`[email] Sending ${templateKey} → ${to} | subject="${subject.slice(0, 50)}..."`);
    const transport = getTransporter();

    const info = await transport.sendMail({
      from: `"${config.smtp.fromName}" <${config.smtp.fromEmail}>`,
      to,
      subject,
      html,
    });

    await logNotificationAttempt({
      inquiryId,
      recipientType,
      channel: 'EMAIL',
      notificationType,
      recipientName,
      recipientEmail: to,
      templateKey,
      status: 'SENT',
      providerResponse: truncateSafe(info.messageId || 'sent', 500),
      sentAt,
    });

    console.log(`[email] SENT ${templateKey} → ${to} | messageId=${info.messageId || 'ok'}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    await logNotificationAttempt({
      inquiryId,
      recipientType,
      channel: 'EMAIL',
      notificationType,
      recipientName,
      recipientEmail: to,
      templateKey,
      status: 'FAILED',
      errorMessage: truncateSafe(err.message, 500),
    });
    console.error(`[email] Failed to send ${templateKey}:`, err.message);
    return { success: false, error: err.message };
  }
}
