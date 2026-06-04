import {
  insertClient,
  findClientById,
  updateClient,
  deleteClient,
  findClients,
  findAllClientsPublic,
} from '../models/client.model.js';
import { uploadClientImage, deleteObjectByKey } from './spaces.service.js';
import { validateDomainUrlOptional } from '../utils/domainUrl.js';

const CLIENT_TYPES = new Set(['b2b', 'b2c']);

function parseClientBody(body) {
  return {
    name: (body.name || '').trim(),
    mobile_number: (body.mobile_number || body.mobile || '').trim(),
    email_id: (body.email_id || body.email || '').trim(),
    address: (body.address || '').trim(),
    client_type: (body.client_type || '').trim().toLowerCase(),
    business_type: (body.business_type || '').trim(),
    onboard_date: (body.onboard_date || '').trim(),
    domain_url: (body.domain_url || body.domainUrl || body.domainName || '').trim(),
  };
}

function validateClientPayload(payload) {
  const required = ['name', 'mobile_number', 'email_id', 'client_type', 'business_type', 'onboard_date'];
  const missing = required.filter((field) => !payload[field]);

  if (missing.length) {
    return `Missing required fields: ${missing.join(', ')}`;
  }

  if (!CLIENT_TYPES.has(payload.client_type)) {
    return 'client_type must be b2b or b2c.';
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(payload.email_id)) {
    return 'Please provide a valid email address.';
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(payload.onboard_date)) {
    return 'onboard_date must be YYYY-MM-DD.';
  }

  const domainCheck = validateDomainUrlOptional(payload.domain_url);
  if (!domainCheck.ok) {
    return domainCheck.message;
  }

  return null;
}

function resolveDomainForSave(payload) {
  const domainCheck = validateDomainUrlOptional(payload.domain_url);
  if (!domainCheck.ok) {
    const error = new Error(domainCheck.message);
    error.statusCode = 400;
    throw error;
  }
  return domainCheck.url;
}

function mapClientRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    mobile_number: row.mobile_number,
    email_id: row.email_id,
    address: row.address,
    client_type: row.client_type,
    business_type: row.business_type,
    onboard_date: row.onboard_date,
    client_logo_key: row.client_logo_key,
    client_logo_url: row.client_logo_url,
    client_profile_pic_key: row.client_profile_pic_key,
    client_profile_pic_url: row.client_profile_pic_url,
    domain_url: row.domain_url || null,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function mapClientPublic(row) {
  return {
    id: row.id,
    name: row.name,
    client_type: row.client_type,
    business_type: row.business_type,
    onboard_date: row.onboard_date,
    logo_url: row.client_logo_url || null,
    profile_pic_url: row.client_profile_pic_url || null,
    domain_url: row.domain_url || null,
  };
}

async function applyUploadedImages(files, existing = {}) {
  const logoFile = files?.client_logo?.[0];
  const profileFile = files?.client_profile_pic?.[0];

  let client_logo_key = existing.client_logo_key || null;
  let client_logo_url = existing.client_logo_url || null;
  let client_profile_pic_key = existing.client_profile_pic_key || null;
  let client_profile_pic_url = existing.client_profile_pic_url || null;

  if (logoFile) {
    const uploaded = await uploadClientImage(logoFile, 'logo');
    if (existing.client_logo_key) {
      await deleteObjectByKey(existing.client_logo_key);
    }
    client_logo_key = uploaded.key;
    client_logo_url = uploaded.url;
  }

  if (profileFile) {
    const uploaded = await uploadClientImage(profileFile, 'profile');
    if (existing.client_profile_pic_key) {
      await deleteObjectByKey(existing.client_profile_pic_key);
    }
    client_profile_pic_key = uploaded.key;
    client_profile_pic_url = uploaded.url;
  }

  return {
    client_logo_key,
    client_logo_url,
    client_profile_pic_key,
    client_profile_pic_url,
  };
}

export async function createClient(body, files) {
  const payload = parseClientBody(body);
  const validationError = validateClientPayload(payload);

  if (validationError) {
    const error = new Error(validationError);
    error.statusCode = 400;
    throw error;
  }

  const images = await applyUploadedImages(files);
  const domain_url = resolveDomainForSave(payload);
  const id = await insertClient({ ...payload, domain_url, ...images });
  const row = await findClientById(id);
  return mapClientRow(row);
}

export async function getClientById(id) {
  const row = await findClientById(id);
  return mapClientRow(row);
}

export async function listClients(filters) {
  const page = Math.max(1, Number(filters.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(filters.limit) || 10));

  const result = await findClients({
    search: filters.search?.trim() || '',
    clientType: filters.clientType || filters.client_type || '',
    page,
    limit,
  });

  return {
    rows: result.rows.map(mapClientRow),
    total: result.total,
    page: result.page,
    limit: result.limit,
  };
}

export async function listPublicClients() {
  const rows = await findAllClientsPublic();
  return rows.map(mapClientPublic);
}

export async function updateClientById(id, body, files) {
  const existing = await findClientById(id);
  if (!existing) {
    return null;
  }

  const payload = parseClientBody(body);
  const validationError = validateClientPayload(payload);

  if (validationError) {
    const error = new Error(validationError);
    error.statusCode = 400;
    throw error;
  }

  const images = await applyUploadedImages(files, existing);
  const domain_url = resolveDomainForSave(payload);
  await updateClient(id, { ...payload, domain_url, ...images });
  const row = await findClientById(id);
  return mapClientRow(row);
}

export async function removeClient(id) {
  const existing = await findClientById(id);
  if (!existing) {
    return false;
  }

  const deleted = await deleteClient(id);
  if (deleted) {
    await deleteObjectByKey(existing.client_logo_key);
    await deleteObjectByKey(existing.client_profile_pic_key);
  }
  return deleted;
}
