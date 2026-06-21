import { config } from '../config/env.js';
import { sendTemplateSms } from './smsService.js';
import { sendTemplateEmail } from './emailService.js';
import {
  updateContactReminderFlags,
  findContactsDueForReminder,
} from '../models/contact.model.js';
import {
  buildScheduledDate,
  formatPreferredCallDateDisplay,
} from '../utils/timezone.js';

function isDueWithinNextHour(contact, now = new Date()) {
  const scheduledAt = buildScheduledDate(contact.preferredDate, contact.preferredTime);
  if (!scheduledAt) {
    return false;
  }

  const windowStart = now.getTime();
  const windowEnd = windowStart + 60 * 60 * 1000;
  const scheduledTime = scheduledAt.getTime();

  return scheduledTime > windowStart && scheduledTime <= windowEnd;
}

export async function sendInquirySubmissionNotifications(contact, inquiryId) {
  const clientName = contact.fullName;
  const preferredCallDate = formatPreferredCallDateDisplay(contact.preferredDate);
  const preferredCallTime = String(contact.preferredTime || '').trim();
  const tasks = [];

  tasks.push(
    sendTemplateSms({
      mobile: contact.mobileNumber,
      templateKey: 'ENQUIRY_RECEIVED_CLIENT',
      variables: { clientName },
      recipientType: 'CLIENT',
      notificationType: 'INQUIRY_SUBMISSION',
      recipientName: clientName,
      inquiryId,
    })
  );

  tasks.push(
    sendTemplateEmail({
      to: contact.emailId,
      templateKey: 'ENQUIRY_RECEIVED_CLIENT_EMAIL',
      variables: {
        clientName,
        lookingFor: contact.lookingFor,
        preferredCallDate: contact.preferredDate,
        preferredCallTime: contact.preferredTime,
        submittedAt: new Date().toISOString(),
      },
      recipientType: 'CLIENT',
      notificationType: 'INQUIRY_SUBMISSION',
      recipientName: clientName,
      inquiryId,
    })
  );

  const adminMobile = config.notifications.adminMobile;
  const adminEmail = config.notifications.adminEmail;
  const adminName = config.notifications.adminName;

  if (adminMobile) {
    tasks.push(
      sendTemplateSms({
        mobile: adminMobile,
        templateKey: 'ENQUIRY_RECEIVED_ADMIN',
        variables: {
          clientName,
          lookingFor: contact.lookingFor,
          preferredCallDate,
          preferredCallTime,
        },
        recipientType: 'ADMIN',
        notificationType: 'INQUIRY_SUBMISSION',
        recipientName: adminName,
        inquiryId,
      })
    );
  }

  if (adminEmail) {
    tasks.push(
      sendTemplateEmail({
        to: adminEmail,
        templateKey: 'ENQUIRY_RECEIVED_ADMIN_EMAIL',
        variables: {
          clientName,
          mobileNumber: contact.mobileNumber,
          emailId: contact.emailId,
          lookingFor: contact.lookingFor,
          preferredCallDate: contact.preferredDate,
          preferredCallTime: contact.preferredTime,
        },
        recipientType: 'ADMIN',
        notificationType: 'INQUIRY_SUBMISSION',
        recipientName: adminName,
        inquiryId,
      })
    );
  }

  await Promise.allSettled(tasks);
}

export async function sendCallReminderNotifications(contact) {
  const clientName = contact.fullName;
  const adminName = config.notifications.adminName;
  const preferredCallTime = String(contact.preferredTime || '').trim();
  const updates = {};

  if (!contact.client_reminder_sms_sent) {
    const result = await sendTemplateSms({
      mobile: contact.mobileNumber,
      templateKey: 'CALL_REMINDER_CLIENT',
      variables: {
        clientName,
        preferredCallTime,
      },
      recipientType: 'CLIENT',
      notificationType: 'CALL_REMINDER',
      recipientName: clientName,
      inquiryId: contact.id,
    });

    if (result.success) {
      updates.client_reminder_sms_sent = true;
    }
  }

  if (!contact.client_reminder_email_sent) {
    const result = await sendTemplateEmail({
      to: contact.emailId,
      templateKey: 'CALL_REMINDER_CLIENT_EMAIL',
      variables: {
        clientName,
        SCHEDULED_DATE: contact.preferredDate,
        SCHEDULED_TIME: contact.preferredTime,
        preferredCallDate: contact.preferredDate,
        preferredCallTime: contact.preferredTime,
      },
      recipientType: 'CLIENT',
      notificationType: 'CALL_REMINDER',
      recipientName: clientName,
      inquiryId: contact.id,
    });

    if (result.success) {
      updates.client_reminder_email_sent = true;
    }
  }

  const adminMobile = config.notifications.adminMobile;
  const adminEmail = config.notifications.adminEmail;

  if (adminMobile && !contact.admin_reminder_sms_sent) {
    const result = await sendTemplateSms({
      mobile: adminMobile,
      templateKey: 'CALL_REMINDER_ADMIN',
      variables: {
        clientName,
        mobileNumber: contact.mobileNumber,
        lookingFor: contact.lookingFor,
        preferredCallTime,
      },
      recipientType: 'ADMIN',
      notificationType: 'CALL_REMINDER',
      recipientName: adminName,
      inquiryId: contact.id,
    });

    if (result.success) {
      updates.admin_reminder_sms_sent = true;
    }
  }

  if (adminEmail && !contact.admin_reminder_email_sent) {
    const result = await sendTemplateEmail({
      to: adminEmail,
      templateKey: 'CALL_REMINDER_ADMIN_EMAIL',
      variables: {
        clientName,
        mobileNumber: contact.mobileNumber,
        emailId: contact.emailId,
        lookingFor: contact.lookingFor,
        preferredCallDate: contact.preferredDate,
        preferredCallTime: contact.preferredTime,
      },
      recipientType: 'ADMIN',
      notificationType: 'CALL_REMINDER',
      recipientName: adminName,
      inquiryId: contact.id,
    });

    if (result.success) {
      updates.admin_reminder_email_sent = true;
    }
  }

  if (Object.keys(updates).length > 0) {
    const allSent =
      (contact.client_reminder_sms_sent || updates.client_reminder_sms_sent) &&
      (contact.client_reminder_email_sent || updates.client_reminder_email_sent) &&
      (contact.admin_reminder_sms_sent || updates.admin_reminder_sms_sent || !adminMobile) &&
      (contact.admin_reminder_email_sent || updates.admin_reminder_email_sent || !adminEmail);

    await updateContactReminderFlags(contact.id, {
      ...updates,
      reminder_sent_at: allSent ? new Date() : contact.reminder_sent_at,
    });
  }
}

export async function processDueCallReminders() {
  const candidates = await findContactsDueForReminder();
  const contacts = candidates.filter((contact) => isDueWithinNextHour(contact));
  let processed = 0;

  for (const contact of contacts) {
    try {
      await sendCallReminderNotifications(contact);
      processed += 1;
    } catch (err) {
      console.error(`[scheduler] Reminder failed for contact ${contact.id}:`, err.message);
    }
  }

  return processed;
}
