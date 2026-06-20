import {
  insertContact,
  findContactById,
  findContacts,
  findContactsForExport,
  updateContactStatus,
  countContactsByStatus,
  countAllContacts,
  countTodayScheduledContacts,
} from '../models/contact.model.js';
import { countAllClients } from '../models/client.model.js';
import {
  DEFAULT_ENQUIRY_STATUS,
  normalizeEnquiryStatus,
  resolveEnquiryStatus,
} from '../constants/enquiryStatus.js';
import { assertVerificationTokens } from './verificationService.js';
import { sendInquirySubmissionNotifications } from './inquiryNotificationService.js';
import { getTodayDateString } from '../utils/timezone.js';
import {
  deleteVerificationSession,
} from '../models/verificationSession.model.js';
import { normalizePreferredContactMethod } from '../constants/preferredContactMethod.js';

const REQUIRED_CONTACT_FIELDS = [
  'fullName',
  'mobileNumber',
  'emailId',
  'town',
  'state',
  'country',
  'lookingFor',
  'preferredContactMethod',
  'preferredDate',
  'preferredTime',
];

export function normalizeContactInput(body) {
  return {
    fullName: (body.fullName || body.name || '').trim(),
    mobileNumber: (body.mobileNumber || body.phone || '').trim(),
    emailId: (body.emailId || body.email || '').trim(),
    town: (body.town || '').trim(),
    state: (body.state || '').trim(),
    country: (body.country || '').trim(),
    lookingFor: (body.lookingFor || '').trim(),
    preferredContactMethod: (body.preferredContactMethod || '').trim(),
    preferredDate: (body.preferredDate || '').trim(),
    preferredTime: (body.preferredTime || '').trim(),
    description: (body.description || body.message || '').trim(),
  };
}

export function validateContactPayload(payload) {
  const missing = REQUIRED_CONTACT_FIELDS.filter((field) => !payload[field]);

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

  if (!normalizePreferredContactMethod(payload.preferredContactMethod)) {
    return 'Please select a valid preferred contact method.';
  }

  return null;
}

export function formatContactSummary(row) {
  const lines = [];

  if (row.lookingFor) lines.push(`Looking For: ${row.lookingFor}`);
  if (row.town) lines.push(`Town/City: ${row.town}`);
  if (row.state) lines.push(`State: ${row.state}`);
  if (row.country) lines.push(`Country: ${row.country}`);
  if (row.preferredContactMethod) {
    lines.push(`Preferred Contact: ${row.preferredContactMethod}`);
  }
  if (row.preferredDate) lines.push(`Preferred Date: ${row.preferredDate}`);
  if (row.preferredTime) lines.push(`Preferred Time: ${row.preferredTime}`);
  if (row.description) lines.push(`Description: ${row.description}`);

  return lines.join('\n') || '-';
}

export function mapContactForDashboard(row) {
  return {
    id: row.id,
    name: row.fullName,
    email: row.emailId,
    phone: row.mobileNumber,
    message: formatContactSummary(row),
    status: resolveEnquiryStatus(row.status),
    source_page: '/contact',
    created_at: row.created_at,
    fullName: row.fullName,
    mobileNumber: row.mobileNumber,
    emailId: row.emailId,
    town: row.town,
    state: row.state,
    country: row.country,
    lookingFor: row.lookingFor,
    preferredContactMethod: row.preferredContactMethod,
    preferredDate: row.preferredDate,
    preferredTime: row.preferredTime,
    description: row.description,
  };
}

export async function createEnquiry(payload) {
  const data = normalizeContactInput(payload);
  const validationError = validateContactPayload(data);

  if (validationError) {
    const error = new Error(validationError);
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

  const id = await insertContact(data);

  try {
    await sendInquirySubmissionNotifications(data, id);
  } catch (err) {
    console.error('[enquiry] Post-submit notifications failed:', err.message);
  }

  await Promise.allSettled([
    deleteVerificationSession(mobileSession.token),
    deleteVerificationSession(emailSession.token),
  ]);

  return { id };
}

export async function getEnquiryById(id) {
  const row = await findContactById(id);
  return row ? mapContactForDashboard(row) : null;
}

export async function listEnquiries(filters) {
  const page = Math.max(1, Number(filters.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(filters.limit) || 10));

  const result = await findContacts({
    search: filters.search?.trim() || '',
    status: normalizeEnquiryStatus(filters.status) || '',
    dateFrom: filters.dateFrom || '',
    dateTo: filters.dateTo || '',
    page,
    limit,
  });

  return {
    rows: result.rows.map(mapContactForDashboard),
    total: result.total,
    page: result.page,
    limit: result.limit,
  };
}

export async function exportEnquiries(filters) {
  const rows = await findContactsForExport({
    search: filters.search?.trim() || '',
    status: normalizeEnquiryStatus(filters.status) || '',
    dateFrom: filters.dateFrom || '',
    dateTo: filters.dateTo || '',
  });

  return rows;
}

export async function updateEnquiryStatus(id, statusValue) {
  const status = normalizeEnquiryStatus(statusValue);

  if (!status) {
    const error = new Error('Invalid status value.');
    error.statusCode = 400;
    throw error;
  }

  const updated = await updateContactStatus(id, status);
  if (!updated) {
    return null;
  }

  const row = await findContactById(id);
  return mapContactForDashboard(row);
}

export async function getDashboardStats() {
  const todayDate = getTodayDateString();
  const [totalEnquiries, newEnquiries, totalClients, todayScheduledCalls] = await Promise.all([
    countAllContacts(),
    countContactsByStatus(DEFAULT_ENQUIRY_STATUS),
    countAllClients(),
    countTodayScheduledContacts(todayDate),
  ]);

  return { totalEnquiries, newEnquiries, totalClients, todayScheduledCalls };
}
