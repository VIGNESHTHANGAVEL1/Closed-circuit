import { config } from '../config/env.js';
import {
  countSmsTemplateByKey,
  insertSmsTemplate,
  updateSmsTemplateContent,
} from '../models/smsTemplate.model.js';
import {
  countEmailTemplateByKey,
  insertEmailTemplate,
  updateEmailTemplate,
} from '../models/emailTemplate.model.js';
import { wrapEmailHtml } from '../utils/emailLayout.js';
import {
  CALL_REMINDER_CLIENT_BODY,
  EMAIL_VERIFICATION_OTP_BODY,
  EMAIL_VERIFICATION_SUCCESS_BODY,
  ENQUIRY_RECEIVED_CLIENT_BODY,
} from '../templates/clientEmailBodies.js';

const SMS_TEMPLATES = [
  {
    templateKey: 'MOBILE_VERIFICATION_OTP',
    templateId: '1107178097971411003',
    templateName: 'Mobile Verification OTP',
    senderId: null,
    templateContent:
      'Dear {#alphanumeric#}\nThis is the OTP: {#numeric#} to verify your  mobile number.\nIt will be valid only for 2 mins.\nClosed Circuit AI Pvt Ltd\nhttps://closedcircuit.in',
  },
  {
    templateKey: 'ENQUIRY_RECEIVED_CLIENT',
    templateId: '1107178089489748985',
    templateName: 'Enquiry Received for Client',
    senderId: null,
    templateContent:
      'Dear {#alphanumeric#},\nWe have received your enquery.\nWe will call/message you on your specified date and time to explain the details.\nClosed Circuit AI Pvt Ltd.',
  },
  {
    templateKey: 'ENQUIRY_RECEIVED_ADMIN',
    templateId: '1107178089528191303',
    templateName: 'Enquiry Received for Admin',
    senderId: null,
    templateContent:
      'Enquery Received from {#alphanumeric#} for a product {#alphanumeric#}. We have to explain on {#alphanumeric#} at {#alphanumeric#}.\nClosed Circuit AI Pvt Ltd.',
  },
  {
    templateKey: 'CALL_REMINDER_CLIENT',
    templateId: '1107178091751804980',
    templateName: 'Call Reminder to Client',
    senderId: null,
    templateContent:
      'Dear {#alphanumeric#},\nThis is a reminder regarding the discussion scheduled with you at {#alphanumeric#}.\nKindly keep 10 minutes available for the conversation.\nClosed Circuit AI Pvt Ltd',
  },
  {
    templateKey: 'CALL_REMINDER_ADMIN',
    templateId: '1107178091731358255',
    templateName: 'Call Reminder to Admin',
    senderId: null,
    templateContent:
      'Calendar Reminder\nDiscussion with: {#alphanumeric#}\nOn his/her Mobile: {#alphanumeric#}\nProduct: {#alphanumeric#}\nTime: {#alphanumeric#}\nClosed Circuit AI Pvt Ltd',
  },
];

const SMS_TEMPLATE_ENV_CONTENT = {
  MOBILE_VERIFICATION_OTP: 'SMS_TEMPLATE_CONTENT_MOBILE_VERIFICATION_OTP',
  ENQUIRY_RECEIVED_CLIENT: 'SMS_TEMPLATE_CONTENT_ENQUIRY_RECEIVED_CLIENT',
  ENQUIRY_RECEIVED_ADMIN: 'SMS_TEMPLATE_CONTENT_ENQUIRY_RECEIVED_ADMIN',
  CALL_REMINDER_CLIENT: 'SMS_TEMPLATE_CONTENT_CALL_REMINDER_CLIENT',
  CALL_REMINDER_ADMIN: 'SMS_TEMPLATE_CONTENT_CALL_REMINDER_ADMIN',
};

async function syncSmsTemplateContentFromEnv() {
  let synced = 0;

  for (const [templateKey, envName] of Object.entries(SMS_TEMPLATE_ENV_CONTENT)) {
    const content = String(process.env[envName] || '').trim();
    if (!content) continue;

    const exists = await countSmsTemplateByKey(templateKey);
    if (!exists) continue;

    await updateSmsTemplateContent(templateKey, content);
    synced += 1;
    console.log(`[templates] Synced ${templateKey} content from ${envName}`);
  }

  return synced;
}

const EMAIL_TEMPLATES = [
  {
    templateKey: 'EMAIL_VERIFICATION_OTP',
    templateName: 'Verify Email Address',
    subject: 'Verify Your Email Address – OTP for Closed Circuit Account Activation',
    htmlContent: wrapEmailHtml({
      title: 'Verify Your Email Address',
      bodyHtml: EMAIL_VERIFICATION_OTP_BODY,
    }),
    syncOnStartup: true,
  },
  {
    templateKey: 'EMAIL_VERIFICATION_SUCCESS',
    templateName: 'Email Verification Success',
    subject: 'Welcome to Closed Circuit – Your Secure Digital Community',
    htmlContent: wrapEmailHtml({
      title: 'Welcome to Closed Circuit',
      bodyHtml: EMAIL_VERIFICATION_SUCCESS_BODY,
    }),
    syncOnStartup: true,
  },
  {
    templateKey: 'ENQUIRY_RECEIVED_CLIENT_EMAIL',
    templateName: 'Enquiry Submitted Client Email',
    subject: 'Thank You for Your Enquiry – We Will Connect with You as Scheduled',
    htmlContent: wrapEmailHtml({
      title: 'Enquiry Received',
      bodyHtml: ENQUIRY_RECEIVED_CLIENT_BODY,
    }),
    syncOnStartup: true,
  },
  {
    templateKey: 'ENQUIRY_RECEIVED_ADMIN_EMAIL',
    templateName: 'Enquiry Received Admin Email',
    subject: 'New Enquiry Received – Action Required',
    htmlContent: wrapEmailHtml({
      title: 'New Enquiry',
      bodyHtml: `
        <h2 style="margin:0 0 16px;color:#ffffff;font-size:20px;">New Enquiry Received</h2>
        <p style="margin:0 0 16px;">A new enquiry has been submitted on the Closed Circuit website.</p>
        <div style="margin:20px 0;padding:18px;background:rgba(255,255,255,0.04);border-radius:12px;border:1px solid rgba(255,255,255,0.08);">
          <p style="margin:0 0 8px;"><strong>Client Name:</strong> {{clientName}}</p>
          <p style="margin:0 0 8px;"><strong>Mobile Number:</strong> {{mobileNumber}}</p>
          <p style="margin:0 0 8px;"><strong>Email ID:</strong> {{emailId}}</p>
          <p style="margin:0 0 8px;"><strong>Product / Looking For:</strong> {{lookingFor}}</p>
          <p style="margin:0 0 8px;"><strong>Scheduled Date:</strong> {{preferredCallDate}}</p>
          <p style="margin:0;"><strong>Scheduled Time:</strong> {{preferredCallTime}}</p>
        </div>
        <p style="margin:0;">Please contact the client as scheduled.</p>
      `,
    }),
  },
  {
    templateKey: 'CALL_REMINDER_CLIENT_EMAIL',
    templateName: 'Call Reminder Client Email',
    subject: 'Reminder: Your Closed Circuit Product Discussion is Scheduled in One Hour',
    htmlContent: wrapEmailHtml({
      title: 'Call Reminder',
      bodyHtml: CALL_REMINDER_CLIENT_BODY,
    }),
    syncOnStartup: true,
  },
  {
    templateKey: 'CALL_REMINDER_ADMIN_EMAIL',
    templateName: 'Call Reminder Admin Email',
    subject: 'Reminder: Client Discussion Scheduled in One Hour',
    htmlContent: wrapEmailHtml({
      title: 'Admin Call Reminder',
      bodyHtml: `
        <h2 style="margin:0 0 16px;color:#ffffff;font-size:20px;">Client Discussion Reminder</h2>
        <p style="margin:0 0 16px;">Dear Admin,</p>
        <p style="margin:0 0 16px;">This is a reminder that a client discussion is scheduled in one hour.</p>
        <div style="margin:20px 0;padding:18px;background:rgba(255,255,255,0.04);border-radius:12px;border:1px solid rgba(255,255,255,0.08);">
          <p style="margin:0 0 8px;"><strong>Client Name:</strong> {{clientName}}</p>
          <p style="margin:0 0 8px;"><strong>Mobile Number:</strong> {{mobileNumber}}</p>
          <p style="margin:0 0 8px;"><strong>Email ID:</strong> {{emailId}}</p>
          <p style="margin:0 0 8px;"><strong>Product / Looking For:</strong> {{lookingFor}}</p>
          <p style="margin:0 0 8px;"><strong>Scheduled Date:</strong> {{preferredCallDate}}</p>
          <p style="margin:0;"><strong>Scheduled Time:</strong> {{preferredCallTime}}</p>
        </div>
        <p style="margin:0;">Please contact the client as scheduled.</p>
      `,
    }),
  },
];

export async function seedDefaultTemplates() {
  let smsSeeded = 0;
  let emailSeeded = 0;
  let emailSynced = 0;

  for (const template of SMS_TEMPLATES) {
    const exists = await countSmsTemplateByKey(template.templateKey);
    if (exists > 0) continue;

    await insertSmsTemplate({
      templateKey: template.templateKey,
      templateId: template.templateId,
      templateName: template.templateName,
      senderId: template.senderId || config.sms.senderId || null,
      templateContent: template.templateContent,
    });
    smsSeeded += 1;
  }

  for (const template of EMAIL_TEMPLATES) {
    const exists = await countEmailTemplateByKey(template.templateKey);
    if (!exists) {
      await insertEmailTemplate({
        templateKey: template.templateKey,
        templateName: template.templateName,
        subject: template.subject,
        htmlContent: template.htmlContent,
      });
      emailSeeded += 1;
      continue;
    }

    if (template.syncOnStartup) {
      await updateEmailTemplate({
        templateKey: template.templateKey,
        templateName: template.templateName,
        subject: template.subject,
        htmlContent: template.htmlContent,
      });
      emailSynced += 1;
      console.log(`[templates] Updated email template: ${template.templateKey}`);
    }
  }

  const smsSynced = await syncSmsTemplateContentFromEnv();

  if (smsSeeded > 0 || emailSeeded > 0 || emailSynced > 0 || smsSynced > 0) {
    console.log(
      `✅ Templates seeded (SMS: ${smsSeeded}, Email: ${emailSeeded}, email sync: ${emailSynced}, SMS env sync: ${smsSynced})`
    );
  } else {
    console.log('✅ Templates checked (no new seeds required)');
  }
}
