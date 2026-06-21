import {
  createClient,
  getClientById,
  listClients,
  listPublicClients,
  updateClientById,
  updateClientDisplayStatusById,
  removeClient,
} from '../services/client.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function getPublicClients(req, res) {
  try {
    const clients = await listPublicClients();
    return sendSuccess(res, { clients });
  } catch (err) {
    console.error('getPublicClients error:', err);
    return sendError(res, 'Unable to load clients.', 500);
  }
}

export async function getClients(req, res) {
  try {
    const result = await listClients(req.query);
    return sendSuccess(res, result);
  } catch (err) {
    console.error('getClients error:', err);
    return sendError(res, 'Unable to load clients.', 500);
  }
}

export async function getClientDetail(req, res) {
  try {
    const client = await getClientById(req.params.id);
    if (!client) {
      return sendError(res, 'Client not found.', 404);
    }
    return sendSuccess(res, { client });
  } catch (err) {
    console.error('getClientDetail error:', err);
    return sendError(res, 'Unable to load client.', 500);
  }
}

export async function createClientHandler(req, res) {
  try {
    const client = await createClient(req.body, req.files);
    return sendSuccess(res, { client }, 201);
  } catch (err) {
    console.error('createClient error:', err);
    if (err.statusCode === 400 || err.statusCode === 503) {
      return sendError(res, err.message, err.statusCode);
    }
    return sendError(res, 'Unable to create client.', 500);
  }
}

export async function updateClientHandler(req, res) {
  try {
    const client = await updateClientById(req.params.id, req.body, req.files);
    if (!client) {
      return sendError(res, 'Client not found.', 404);
    }
    return sendSuccess(res, { client });
  } catch (err) {
    console.error('updateClient error:', err);
    if (err.statusCode === 400 || err.statusCode === 503) {
      return sendError(res, err.message, err.statusCode);
    }
    return sendError(res, 'Unable to update client.', 500);
  }
}

export async function patchClientDisplayStatus(req, res) {
  try {
    const client = await updateClientDisplayStatusById(
      req.params.id,
      req.validatedDisplayStatus
    );
    if (!client) {
      return sendError(res, 'Client not found.', 404);
    }
    return sendSuccess(res, { client });
  } catch (err) {
    console.error('patchClientDisplayStatus error:', err);
    return sendError(res, 'Unable to update display status.', 500);
  }
}

export async function deleteClientHandler(req, res) {
  try {
    const deleted = await removeClient(req.params.id);
    if (!deleted) {
      return sendError(res, 'Client not found.', 404);
    }
    return sendSuccess(res, { deleted: true });
  } catch (err) {
    console.error('deleteClient error:', err);
    return sendError(res, 'Unable to delete client.', 500);
  }
}
