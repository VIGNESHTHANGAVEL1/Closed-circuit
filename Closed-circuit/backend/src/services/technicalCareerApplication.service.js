import {
  insertTechnicalCareerApplication,
  findTechnicalCareerApplicationById,
  findTechnicalCareerApplications,
  updateTechnicalCareerApplicationStatus,
  countAllTechnicalCareerApplications,
} from '../models/technicalCareerApplication.model.js';
import {
  DEFAULT_CAREER_STATUS,
  normalizeCareerStatus,
  resolveCareerStatus,
} from '../constants/careerStatus.js';
import { assertVerificationTokens } from './verificationService.js';
import { deleteVerificationSession } from '../models/verificationSession.model.js';
import { uploadResume, normalizeSpacesPublicUrl } from './spaces.service.js';

const REQUIRED_FIELDS = [
  'fullName',
  'emailId',
  'mobileNumber',
  'latestEducation',
  'specialization',
  'yearOfPassout',
  'universityCollege',
  'totalExperience',
  'relevantExperience',
  'currentLastCompany',
  'currentLastDesignation',
  'currentLocation',
  'city',
  'district',
  'state',
  'pinCode',
  'expectedSalary',
  'noticePeriod',
  'linkedinProfile',
  'githubPortfolio',
];

export function normalizeTechnicalCareerInput(body) {
  const normalized = {};

  for (const field of REQUIRED_FIELDS) {
    normalized[field] = String(body[field] || '').trim();
  }

  normalized.declarationAccepted =
    body.declarationAccepted === true ||
    body.declarationAccepted === 'true' ||
    body.declarationAccepted === '1' ||
    body.declarationAccepted === 'on';

  return normalized;
}

export function validateTechnicalCareerPayload(payload) {
  const missing = REQUIRED_FIELDS.filter((field) => !payload[field]);

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

export function mapTechnicalCareerForDashboard(row) {
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
    specialization: row.specialization,
    yearOfPassout: row.yearOfPassout,
    universityCollege: row.universityCollege,
    totalExperience: row.totalExperience,
    relevantExperience: row.relevantExperience,
    currentLastCompany: row.currentLastCompany,
    currentLastDesignation: row.currentLastDesignation,
    currentLocation: row.currentLocation,
    city: row.city,
    district: row.district,
    state: row.state,
    pinCode: row.pinCode,
    expectedSalary: row.expectedSalary,
    noticePeriod: row.noticePeriod,
    linkedinProfile: row.linkedinProfile,
    githubPortfolio: row.githubPortfolio,
    resume_url: normalizeSpacesPublicUrl(row.resume_url),
    resume_filename: row.resume_filename,
    email_verified: Boolean(row.email_verified),
    mobile_verified: Boolean(row.mobile_verified),
  };
}

export async function createTechnicalCareerApplication(payload, resumeFile) {
  const data = normalizeTechnicalCareerInput(payload);
  const validationError = validateTechnicalCareerPayload(data);

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

  const resume = await uploadResume(resumeFile, 'technical');

  const id = await insertTechnicalCareerApplication({
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

export async function listTechnicalCareerApplications(query) {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
  const offset = (page - 1) * limit;

  const { rows, total } = await findTechnicalCareerApplications({
    search: query.search?.trim(),
    status: normalizeCareerStatus(query.status) || undefined,
    dateFrom: query.dateFrom,
    dateTo: query.dateTo,
    limit,
    offset,
  });

  return {
    rows: rows.map(mapTechnicalCareerForDashboard),
    total,
    page,
    limit,
  };
}

export async function getTechnicalCareerApplicationDetail(id) {
  const row = await findTechnicalCareerApplicationById(id);
  if (!row) {
    return null;
  }
  return mapTechnicalCareerForDashboard(row);
}

export async function updateTechnicalCareerStatus(id, status) {
  const normalized = normalizeCareerStatus(status);
  if (!normalized) {
    const error = new Error('Invalid status.');
    error.statusCode = 400;
    throw error;
  }

  const existing = await findTechnicalCareerApplicationById(id);
  if (!existing) {
    const error = new Error('Application not found.');
    error.statusCode = 404;
    throw error;
  }

  await updateTechnicalCareerApplicationStatus(id, normalized);
  return getTechnicalCareerApplicationDetail(id);
}

export async function getTechnicalCareerStats() {
  const total = await countAllTechnicalCareerApplications();
  return { total };
}
