import { getDashboardStats } from '../services/enquiry.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function getAdminDashboardStats(req, res) {
  try {
    const stats = await getDashboardStats();
    return sendSuccess(res, { stats });
  } catch (err) {
    console.error('getAdminDashboardStats error:', err);
    return sendError(res, 'Unable to load dashboard stats.', 500);
  }
}
