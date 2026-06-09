import { config } from '../config/env.js';
import {
  insertVerificationOtp,
  findValidOtp,
  deleteOtpsForIdentifier,
  deleteExpiredOtps,
} from '../models/verificationOtp.model.js';
import {
  insertVerificationSession,
  findValidVerificationSession,
} from '../models/verificationSession.model.js';
import { generateOtp, hashOtp, generateVerificationToken } from '../utils/otp.js';
import { addMinutes } from '../utils/timezone.js';
import { sendTemplateSms } from './smsService.js';
import { sendTemplateEmail } from './emailService.js';
import { isSmsConfigured, isSmtpConfigured } from '../utils/notificationConfig.js';

function maskMobile(mobile) {
  const digits = String(mobile || '').replace(/\D/g, '');
  if (digits.length < 4) return '****';
  return `${digits.slice(0, 2)}****${digits.slice(-2)}`;
}

function logDevOtp(channel, identifier, otp, minutes) {
  console.log('');
  console.log(`[verification] DEV OTP (${channel}) — gateway not configured, use this OTP to test:`);
  console.log(`[verification]   ${channel === 'MOBILE' ? 'Mobile' : 'Email'}: ${identifier}`);
  console.log(`[verification]   OTP: ${otp}`);
  console.log(`[verification]   Valid for ${minutes} minutes`);
  console.log('[verification]   Configure .env credentials for real SMS/email delivery.');
  console.log('');
}

function assertDeliveryResult(sendResult, channel) {
  if (sendResult.success) {
    return;
  }

  if (sendResult.skipped) {
    return;
  }

  const error = new Error(
    `${channel} could not be sent: ${sendResult.error || 'provider error'}`
  );
  error.statusCode = 502;
  throw error;
}

const MOBILE_OTP_MINUTES = 2;
const EMAIL_OTP_MINUTES = 10;
const VERIFICATION_SESSION_MINUTES = 30;

function createHttpError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function normalizeMobile(mobile) {
  return String(mobile || '').trim();
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function isValidMobile(mobile) {
  const digits = mobile.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function issueVerificationSession(channel, identifier, clientName) {
  const token = generateVerificationToken();
  const expiresAt = addMinutes(new Date(), VERIFICATION_SESSION_MINUTES);

  await insertVerificationSession({
    token,
    channel,
    identifier,
    clientName,
    expiresAt,
  });

  return token;
}

export async function sendMobileVerificationOtp({ fullName, mobileNumber }) {
  const clientName = String(fullName || '').trim();
  const mobile = normalizeMobile(mobileNumber);

  if (!clientName) {
    throw createHttpError('Full Name is required before mobile verification.');
  }

  if (!isValidMobile(mobile)) {
    throw createHttpError('Please enter a valid mobile number.');
  }

  await deleteExpiredOtps();

  const otp = generateOtp(6);
  const expiresAt = addMinutes(new Date(), MOBILE_OTP_MINUTES);

  await insertVerificationOtp({
    channel: 'MOBILE',
    identifier: mobile,
    clientName,
    otpHash: hashOtp(otp),
    expiresAt,
  });

  console.log(`[verification] Mobile OTP requested | name=${clientName} | mobile=${maskMobile(mobile)}`);

  const smsResult = await sendTemplateSms({
    mobile,
    templateKey: 'MOBILE_VERIFICATION_OTP',
    variables: [clientName, otp],
    recipientType: 'CLIENT',
    notificationType: 'OTP_VERIFICATION',
    recipientName: clientName,
  });

  if (smsResult.skipped) {
    logDevOtp('MOBILE', mobile, otp, MOBILE_OTP_MINUTES);
    return {
      message: isSmsConfigured()
        ? 'Mobile OTP could not be sent. Check backend console logs.'
        : 'SMS gateway not configured. OTP printed in backend console for local testing.',
      expiresInMinutes: MOBILE_OTP_MINUTES,
      deliveryMode: 'console',
    };
  }

  assertDeliveryResult(smsResult, 'SMS');

  return {
    message: 'Mobile OTP sent successfully.',
    expiresInMinutes: MOBILE_OTP_MINUTES,
    deliveryMode: 'sms',
  };
}

export async function verifyMobileOtp({ mobileNumber, otp }) {
  const mobile = normalizeMobile(mobileNumber);
  const otpValue = String(otp || '').trim();

  if (!isValidMobile(mobile)) {
    throw createHttpError('Please enter a valid mobile number.');
  }

  if (!/^\d{4,8}$/.test(otpValue)) {
    throw createHttpError('Invalid OTP format.');
  }

  const record = await findValidOtp('MOBILE', mobile, hashOtp(otpValue));
  if (!record) {
    throw createHttpError('Invalid or expired OTP. Please request a new one.');
  }

  await deleteOtpsForIdentifier('MOBILE', mobile);

  const verificationToken = await issueVerificationSession(
    'MOBILE',
    mobile,
    record.client_name
  );

  return {
    verified: true,
    mobileVerificationToken: verificationToken,
    message: 'Mobile number verified successfully.',
  };
}

export async function sendEmailVerificationOtp({ fullName, emailId }) {
  const clientName = String(fullName || '').trim();
  const email = normalizeEmail(emailId);

  if (!clientName) {
    throw createHttpError('Full Name is required before email verification.');
  }

  if (!isValidEmail(email)) {
    throw createHttpError('Please enter a valid email address.');
  }

  await deleteExpiredOtps();

  const otp = generateOtp(6);
  const expiresAt = addMinutes(new Date(), EMAIL_OTP_MINUTES);

  await insertVerificationOtp({
    channel: 'EMAIL',
    identifier: email,
    clientName,
    otpHash: hashOtp(otp),
    expiresAt,
  });

  console.log(`[verification] Email OTP requested | name=${clientName} | email=${email}`);

  const emailResult = await sendTemplateEmail({
    to: email,
    templateKey: 'EMAIL_VERIFICATION_OTP',
    variables: { OTP_CODE: otp, clientName },
    recipientType: 'CLIENT',
    notificationType: 'OTP_VERIFICATION',
    recipientName: clientName,
  });

  if (emailResult.skipped) {
    logDevOtp('EMAIL', email, otp, EMAIL_OTP_MINUTES);
    return {
      message: isSmtpConfigured()
        ? 'Email OTP could not be sent. Check backend console logs.'
        : 'SMTP not configured. OTP printed in backend console for local testing.',
      expiresInMinutes: EMAIL_OTP_MINUTES,
      deliveryMode: 'console',
    };
  }

  assertDeliveryResult(emailResult, 'Email');

  return {
    message: 'Email OTP sent successfully.',
    expiresInMinutes: EMAIL_OTP_MINUTES,
    deliveryMode: 'email',
  };
}

export async function verifyEmailOtp({ emailId, otp }) {
  const email = normalizeEmail(emailId);
  const otpValue = String(otp || '').trim();

  if (!isValidEmail(email)) {
    throw createHttpError('Please enter a valid email address.');
  }

  if (!/^\d{4,8}$/.test(otpValue)) {
    throw createHttpError('Invalid OTP format.');
  }

  const record = await findValidOtp('EMAIL', email, hashOtp(otpValue));
  if (!record) {
    throw createHttpError('Invalid or expired OTP. Please request a new one.');
  }

  await deleteOtpsForIdentifier('EMAIL', email);

  const verificationToken = await issueVerificationSession(
    'EMAIL',
    email,
    record.client_name
  );

  await sendTemplateEmail({
    to: email,
    templateKey: 'EMAIL_VERIFICATION_SUCCESS',
    variables: { clientName: record.client_name },
    recipientType: 'CLIENT',
    notificationType: 'EMAIL_VERIFICATION_SUCCESS',
    recipientName: record.client_name,
  });

  return {
    verified: true,
    emailVerificationToken: verificationToken,
    message: 'Email verified successfully.',
  };
}

export async function assertVerificationTokens({
  fullName,
  mobileNumber,
  emailId,
  mobileVerificationToken,
  emailVerificationToken,
}) {
  const mobile = normalizeMobile(mobileNumber);
  const email = normalizeEmail(emailId);

  const mobileSession = await findValidVerificationSession(
    mobileVerificationToken,
    'MOBILE',
    mobile
  );

  if (!mobileSession) {
    throw createHttpError('Mobile verification is required before submitting.');
  }

  const emailSession = await findValidVerificationSession(
    emailVerificationToken,
    'EMAIL',
    email
  );

  if (!emailSession) {
    throw createHttpError('Email verification is required before submitting.');
  }

  const clientName = String(fullName || '').trim();
  if (
    mobileSession.client_name !== clientName ||
    emailSession.client_name !== clientName
  ) {
    throw createHttpError('Verification does not match the submitted details.');
  }

  return { mobileSession, emailSession };
}

export function getAdminNotificationConfig() {
  return config.notifications;
}
