import {
  insertCareerApplication,
  findCareerApplicationById,
  findCareerApplications,
  updateCareerApplicationStatus,
  countAllCareerApplications,
} from '../models/careerApplication.model.js';
import {
  DEFAULT_CAREER_STATUS,
  normalizeCareerStatus,
  resolveCareerStatus,
} from '../constants/careerStatus.js';
import { assertVerificationTokens } from './verificationService.js';
import { deleteVerificationSession } from '../models/verificationSession.model.js';
import { uploadResume } from './spaces.service.js';

const REQUIRED_FIELDS = [
  'fullName',
  'emailId',
  'mobileNumber',
  'latestEducation',
  'currentLocation',
  'city',
  'district',
  'state',
  'salesExperience',
  'callsPerDay',
  'closuresPerDay',
  'languages',
  'hasLaptop',
  'hasMobilePhone',
  'hasSeparateSim',
  'hasWorkstation',
  'hasInternet',
  'reviewedProduct',
  'watchedProductVideo',
  'watchedCareerVideo',
  'productUnderstanding',
];

const YES_NO_FIELDS = [
  'hasLaptop',
  'hasMobilePhone',
  'hasSeparateSim',
  'hasWorkstation',
  'hasInternet',
  'reviewedProduct',
  'watchedProductVideo',
  'watchedCareerVideo',
];

function normalizeYesNo(value) {
  const normalized = String(value || '').trim().toLowerCase();
  if (normalized === 'yes' || normalized === 'true' || normalized === '1') {
    return 'Yes';
  }
  if (normalized === 'no' || normalized === 'false' || normalized === '0') {
    return 'No';
  }
  return null;
}

export function normalizeCareerInput(body) {
  const normalized = {};

  for (const field of REQUIRED_FIELDS) {
    normalized[field] = String(body[field] || '').trim();
  }

  for (const field of YES_NO_FIELDS) {
    normalized[field] = normalizeYesNo(body[field]);
  }

  normalized.declarationAccepted =
    body.declarationAccepted === true ||
    body.declarationAccepted === 'true' ||
    body.declarationAccepted === '1' ||
    body.declarationAccepted === 'on';

  return normalized;
}

export function validateCareerPayload(payload) {
  const missing = REQUIRED_FIELDS.filter((field) => {
    if (YES_NO_FIELDS.includes(field)) {
      return !payload[field];
    }
    return !payload[field];
  });

  if (missing.length) {
    return `Missing required fields: ${missing.join(', ')}`;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(payload.emailId)) {
    return 'Please provide a valid email address.';
  }

  const mobileDigits = String(payload.mobileNumber || '').replace(/\D/g, '');
  if (mobileDigits.length !== 10) {
    return 'Please provide a valid 10-digit mobile number.';
  }

  if (!payload.declarationAccepted) {
    return 'Please accept the declaration before submitting.';
  }

  return null;
}

export function mapCareerForDashboard(row) {
  return {
    id: row.id,
    name: row.fullName,
    email: row.emailId,
    phone: row.mobileNumber,
    latestEducation: row.latestEducation,
    status: resolveCareerStatus(row.status),
    created_at: row.created_at,
    fullName: row.fullName,
    emailId: row.emailId,
    mobileNumber: row.mobileNumber,
    currentLocation: row.currentLocation,
    city: row.city,
    district: row.district,
    state: row.state,
    salesExperience: row.salesExperience,
    callsPerDay: row.callsPerDay,
    closuresPerDay: row.closuresPerDay,
    languages: row.languages,
    hasLaptop: row.hasLaptop,
    hasMobilePhone: row.hasMobilePhone,
    hasSeparateSim: row.hasSeparateSim,
    hasWorkstation: row.hasWorkstation,
    hasInternet: row.hasInternet,
    reviewedProduct: row.reviewedProduct,
    watchedProductVideo: row.watchedProductVideo,
    watchedCareerVideo: row.watchedCareerVideo,
    productUnderstanding: row.productUnderstanding,
    resume_url: row.resume_url,
    resume_filename: row.resume_filename,
    email_verified: Boolean(row.email_verified),
    mobile_verified: Boolean(row.mobile_verified),
  };
}

export async function createCareerApplication(payload, resumeFile) {
  const data = normalizeCareerInput(payload);
  const validationError = validateCareerPayload(data);

  if (validationError) {
    const error = new Error(validationError);
    error.statusCode = 400;
    throw error;
  }

  if (!resumeFile) {
    const error = new Error('Resume upload is required.');
    error.statusCode = 400;
    throw error;
  }

  const { mobileSession, emailSession } = await assertVerificationTokens({
    fullName: data.fullName,
    mobileNumber: data.mobileNumber,
    emailId: data.emailId,
    mobileVerificationToken: payload.mobileVerificationToken,
    emailVerificationToken: payload.emailVerificationToken,
  });

  const resume = await uploadResume(resumeFile);

  const id = await insertCareerApplication({
    ...data,
    resume_key: resume.key,
    resume_url: resume.url,
    resume_filename: resume.filename,
    email_verified: true,
    mobile_verified: true,
    status: DEFAULT_CAREER_STATUS,
  });

  await Promise.allSettled([
    deleteVerificationSession(mobileSession.token),
    deleteVerificationSession(emailSession.token),
  ]);

  return { id };
}

export async function listCareerApplications(query) {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
  const offset = (page - 1) * limit;

  const { rows, total } = await findCareerApplications({
    search: query.search?.trim(),
    status: normalizeCareerStatus(query.status) || undefined,
    dateFrom: query.dateFrom,
    dateTo: query.dateTo,
    limit,
    offset,
  });

  return {
    rows: rows.map(mapCareerForDashboard),
    total,
    page,
    limit,
  };
}

export async function getCareerApplicationDetail(id) {
  const row = await findCareerApplicationById(id);
  if (!row) {
    return null;
  }
  return mapCareerForDashboard(row);
}

export async function updateCareerStatus(id, status) {
  const normalized = normalizeCareerStatus(status);
  if (!normalized) {
    const error = new Error('Invalid status.');
    error.statusCode = 400;
    throw error;
  }

  const existing = await findCareerApplicationById(id);
  if (!existing) {
    const error = new Error('Application not found.');
    error.statusCode = 404;
    throw error;
  }

  await updateCareerApplicationStatus(id, normalized);
  return getCareerApplicationDetail(id);
}

export async function getCareerStats() {
  const total = await countAllCareerApplications();
  return { total };
}
