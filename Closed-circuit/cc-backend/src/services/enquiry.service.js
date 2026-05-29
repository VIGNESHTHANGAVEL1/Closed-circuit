import { insertEnquiry, findEnquiryById, findEnquiries, findEnquiriesForExport } from '../models/enquiry.model.js';

export function buildMessageFromContactPayload(body) {
  if (body.message?.trim()) {
    return body.message.trim();
  }

  const lines = [];

  if (body.lookingFor) lines.push(`Looking For: ${body.lookingFor}`);
  if (body.town) lines.push(`Town/City: ${body.town}`);
  if (body.state) lines.push(`State: ${body.state}`);
  if (body.country) lines.push(`Country: ${body.country}`);
  if (body.preferredContactMethod) lines.push(`Preferred Contact: ${body.preferredContactMethod}`);
  if (body.preferredDate) lines.push(`Preferred Date: ${body.preferredDate}`);
  if (body.preferredTime) lines.push(`Preferred Time: ${body.preferredTime}`);
  if (body.description) lines.push(`Description: ${body.description}`);
  if (body.consentAccepted !== undefined) {
    lines.push(`Consent Accepted: ${body.consentAccepted ? 'Yes' : 'No'}`);
  }

  return lines.join('\n') || 'Contact form submission';
}

export function normalizeEnquiryInput(body) {
  const name = body.name || body.fullName;
  const email = body.email || body.emailId;
  const phone = body.phone || body.mobileNumber;
  const message = buildMessageFromContactPayload(body);

  return {
    name: name?.trim(),
    email: email?.trim(),
    phone: phone?.trim(),
    message: message?.trim(),
    sourcePage: body.source_page || body.sourcePage || '/contact',
  };
}

export async function createEnquiry(payload, ipAddress) {
  const data = normalizeEnquiryInput(payload);

  const id = await insertEnquiry({
    name: data.name,
    email: data.email,
    phone: data.phone,
    message: data.message,
    sourcePage: data.sourcePage,
    ipAddress,
  });

  return { id };
}

export async function getEnquiryById(id) {
  return findEnquiryById(id);
}

export async function listEnquiries(filters) {
  const page = Math.max(1, Number(filters.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(filters.limit) || 10));

  return findEnquiries({
    search: filters.search?.trim() || '',
    dateFrom: filters.dateFrom || '',
    dateTo: filters.dateTo || '',
    page,
    limit,
  });
}

export async function exportEnquiries(filters) {
  return findEnquiriesForExport({
    search: filters.search?.trim() || '',
    dateFrom: filters.dateFrom || '',
    dateTo: filters.dateTo || '',
  });
}
