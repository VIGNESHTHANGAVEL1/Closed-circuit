import {
  insertWebinarParticipation,
  findWebinarParticipationById,
  findWebinarReviews,
  getWebinarReviewStats,
} from './entrepreneurshipWebinar.model.js';
import { assertVerificationTokens } from '../../services/verificationService.js';
import { deleteVerificationSession } from '../../models/verificationSession.model.js';
import { getTodayDateString } from '../../utils/timezone.js';

const REQUIRED_FIELDS = [
  'fullName',
  'emailId',
  'mobileNumber',
  'branch',
  'yearOfPassout',
  'college',
  'university',
  'city',
  'state',
  'pinCode',
  'webinarAttendanceDate',
];

function parseIsoDate(value) {
  const trimmed = String(value || '').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return null;
  }
  const [year, month, day] = trimmed.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return trimmed;
}

function addDaysToIsoDate(isoDate, deltaDays) {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + deltaDays);
  return date.toISOString().slice(0, 10);
}

export function validateWebinarAttendanceDate(value) {
  const parsed = parseIsoDate(value);
  if (!parsed) {
    return 'Please select a valid webinar attendance date.';
  }

  const today = getTodayDateString();
  const earliest = addDaysToIsoDate(today, -3);

  if (parsed > today) {
    return 'Webinar attendance date cannot be in the future.';
  }

  if (parsed < earliest) {
    return 'Webinar attendance date can be today or up to 3 days earlier only.';
  }

  return null;
}

export function normalizeWebinarInput(body) {
  const normalized = {};
  for (const field of REQUIRED_FIELDS) {
    normalized[field] = String(body[field] || '').trim();
  }

  normalized.reviewComment = String(body.reviewComment || body.review || '').trim();
  const ratingRaw = body.rating;
  if (ratingRaw === '' || ratingRaw === null || ratingRaw === undefined) {
    normalized.rating = null;
  } else {
    normalized.rating = Number(ratingRaw);
  }

  return normalized;
}

export function validateWebinarPayload(payload) {
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

  const pinDigits = String(payload.pinCode || '').replace(/\D/g, '');
  if (pinDigits.length !== 6) {
    return 'Please provide a valid 6-digit PIN code.';
  }

  const dateError = validateWebinarAttendanceDate(payload.webinarAttendanceDate);
  if (dateError) {
    return dateError;
  }

  if (payload.rating !== null) {
    if (!Number.isInteger(payload.rating) || payload.rating < 1 || payload.rating > 5) {
      return 'Rating must be a whole number from 1 to 5.';
    }
  }

  return null;
}

function mapReviewSummary(row) {
  const comment = String(row.reviewComment || '').trim();
  const excerpt =
    comment.length > 160 ? `${comment.slice(0, 157).trim()}…` : comment;

  return {
    id: row.id,
    fullName: row.fullName,
    college: row.college,
    university: row.university,
    city: row.city,
    state: row.state,
    rating: row.rating,
    reviewExcerpt: excerpt,
    webinarAttendanceDate: row.webinarAttendanceDate,
    created_at: row.created_at,
  };
}

function mapReviewDetail(row) {
  return {
    id: row.id,
    fullName: row.fullName,
    branch: row.branch,
    yearOfPassout: row.yearOfPassout,
    college: row.college,
    university: row.university,
    city: row.city,
    state: row.state,
    pinCode: row.pinCode,
    webinarAttendanceDate: row.webinarAttendanceDate,
    reviewComment: row.reviewComment,
    rating: row.rating,
    created_at: row.created_at,
  };
}

export async function listPublicWebinarReviews(query) {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 8, 1), 50);
  const offset = (page - 1) * limit;

  const [{ rows, total }, stats] = await Promise.all([
    findWebinarReviews({
      search: query.search?.trim(),
      limit,
      offset,
    }),
    getWebinarReviewStats(),
  ]);

  return {
    rows: rows.map(mapReviewSummary),
    total,
    page,
    limit,
    averageRating: stats.averageRating,
    reviewCount: stats.reviewCount,
  };
}

export async function getPublicWebinarReviewDetail(id) {
  const row = await findWebinarParticipationById(id);
  if (!row || !String(row.reviewComment || '').trim()) {
    return null;
  }
  return mapReviewDetail(row);
}

export async function createWebinarParticipation(body) {
  const payload = normalizeWebinarInput(body);
  const validationError = validateWebinarPayload(payload);
  if (validationError) {
    const error = new Error(validationError);
    error.statusCode = 400;
    throw error;
  }

  const { mobileSession, emailSession } = await assertVerificationTokens({
    fullName: payload.fullName,
    mobileNumber: payload.mobileNumber,
    emailId: payload.emailId,
    mobileVerificationToken: body.mobileVerificationToken,
    emailVerificationToken: body.emailVerificationToken,
  });

  const id = await insertWebinarParticipation({
    ...payload,
    pinCode: String(payload.pinCode).replace(/\D/g, ''),
    mobileNumber: String(payload.mobileNumber).replace(/\D/g, '').slice(-10),
    email_verified: true,
    mobile_verified: true,
  });

  await Promise.allSettled([
    deleteVerificationSession(mobileSession.token),
    deleteVerificationSession(emailSession.token),
  ]);

  return { id };
}
