import { config } from '../config/env.js';
import {
  countSmsTemplateByKey,
  insertSmsTemplate,
  updateSmsTemplateContent,
} from '../models/smsTemplate.model.js';
import { countEmailTemplateByKey, insertEmailTemplate } from '../models/emailTemplate.model.js';
import { wrapEmailHtml } from '../utils/emailLayout.js';

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
      title: 'Verify Your Email',
      bodyHtml: `
        <h2 style="margin:0 0 16px;color:#ffffff;font-size:20px;">Verify Your Email Address</h2>
        <p style="margin:0 0 16px;">Thank you for starting your enquiry with Closed Circuit. Use the one-time password below to verify your email address.</p>
        <div style="margin:24px 0;padding:20px;background:rgba(99,102,241,0.15);border:1px solid rgba(99,102,241,0.35);border-radius:12px;text-align:center;">
          <p style="margin:0 0 8px;color:#94a3b8;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;">Your OTP</p>
          <p style="margin:0;color:#ffffff;font-size:32px;font-weight:700;letter-spacing:6px;">{{OTP_CODE}}</p>
        </div>
        <p style="margin:0 0 12px;">This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
        <p style="margin:0;color:#94a3b8;font-size:14px;">If you did not request this verification, you can safely ignore this email.</p>
      `,
    }),
  },
  {
    templateKey: 'EMAIL_VERIFICATION_SUCCESS',
    templateName: 'Email Verification Success',
    subject: 'Welcome to Closed Circuit – Your Secure Digital Community',
    htmlContent: wrapEmailHtml({
      title: 'Welcome to Closed Circuit',
      bodyHtml: `
        <h2 style="margin:0 0 16px;color:#ffffff;font-size:20px;">Welcome, {{clientName}}!</h2>
        <p style="margin:0 0 16px;">Your email address has been verified successfully. You are one step closer to building your secure digital community with Closed Circuit.</p>
        <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:24px 0;" />
        <p style="margin:0 0 12px;">Complete the enquiry form to schedule your preferred discussion time. Our team will connect with you as requested.</p>
        <p style="margin:0;color:#94a3b8;font-size:14px;">Thank you for choosing Closed Circuit AI Pvt Ltd.</p>
      `,
    }),
  },
  {
    templateKey: 'ENQUIRY_RECEIVED_CLIENT_EMAIL',
    templateName: 'Enquiry Submitted Client Email',
    subject: 'Thank You for Your Enquiry – We Will Connect with You as Scheduled',
    htmlContent: wrapEmailHtml({
      title: 'Enquiry Received',
      bodyHtml: `
        <h2 style="margin:0 0 16px;color:#ffffff;font-size:20px;">Thank You, {{clientName}}!</h2>
        <p style="margin:0 0 16px;">We have received your enquiry and appreciate your interest in Closed Circuit.</p>
        <div style="margin:20px 0;padding:18px;background:rgba(255,255,255,0.04);border-radius:12px;border:1px solid rgba(255,255,255,0.08);">
          <p style="margin:0 0 8px;"><strong>Looking For:</strong> {{lookingFor}}</p>
          <p style="margin:0 0 8px;"><strong>Preferred Date:</strong> {{preferredCallDate}}</p>
          <p style="margin:0;"><strong>Preferred Time:</strong> {{preferredCallTime}}</p>
        </div>
        <p style="margin:0 0 12px;">We will call or message you on your specified date and time to explain the details.</p>
        <p style="margin:0;color:#94a3b8;font-size:14px;">Submitted at: {{submittedAt}}</p>
      `,
    }),
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
      bodyHtml: `
        <h2 style="margin:0 0 16px;color:#ffffff;font-size:20px;">Discussion Reminder</h2>
        <p style="margin:0 0 16px;">Dear {{clientName}},</p>
        <p style="margin:0 0 16px;">This is a friendly reminder that your Closed Circuit product discussion is scheduled in approximately one hour.</p>
        <div style="margin:20px 0;padding:18px;background:rgba(99,102,241,0.12);border-radius:12px;border:1px solid rgba(99,102,241,0.25);">
          <p style="margin:0 0 8px;"><strong>Date:</strong> {{SCHEDULED_DATE}}</p>
          <p style="margin:0;"><strong>Time:</strong> {{SCHEDULED_TIME}}</p>
        </div>
        <p style="margin:0;">Kindly keep 10 minutes available for the conversation. We look forward to speaking with you.</p>
      `,
    }),
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
    if (exists > 0) continue;

    await insertEmailTemplate({
      templateKey: template.templateKey,
      templateName: template.templateName,
      subject: template.subject,
      htmlContent: template.htmlContent,
    });
    emailSeeded += 1;
  }

  const smsSynced = await syncSmsTemplateContentFromEnv();

  if (smsSeeded > 0 || emailSeeded > 0 || smsSynced > 0) {
    console.log(
      `✅ Templates seeded (SMS: ${smsSeeded}, Email: ${emailSeeded}, env sync: ${smsSynced})`
    );
  } else {
    console.log('✅ Templates checked (no new seeds required)');
  }
}
