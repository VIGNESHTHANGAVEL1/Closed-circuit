import { config } from '../../config/env.js';
import { sendSuccess, sendError } from '../../utils/response.js';
import {
  listPublicWebinarReviews,
  getPublicWebinarReviewDetail,
  createWebinarParticipation,
  listAdminWebinarParticipations,
  getAdminWebinarParticipationDetail,
  updateAdminWebinarParticipationStatus,
} from './leetcodeWebinar.service.js';

function ensureFeatureEnabled(_req, res, next) {
  if (!config.features.leetcodeWebinar) {
    return sendError(res, 'LeetCode Webinar is not available.', 404);
  }
  return next();
}

export async function getWebinarReviews(req, res) {
  try {
    const data = await listPublicWebinarReviews(req.query);
    return sendSuccess(res, data);
  } catch (err) {
    console.error('[webinar] list reviews error:', err);
    return sendError(res, 'Unable to load webinar reviews.', 500);
  }
}

export async function getWebinarReviewById(req, res) {
  try {
    const review = await getPublicWebinarReviewDetail(req.params.id);
    if (!review) {
      return sendError(res, 'Review not found.', 404);
    }
    return sendSuccess(res, { review });
  } catch (err) {
    console.error('[webinar] review detail error:', err);
    return sendError(res, 'Unable to load review details.', 500);
  }
}

export async function submitWebinarParticipation(req, res) {
  try {
    const result = await createWebinarParticipation(req.body);
    return sendSuccess(
      res,
      {
        id: result.id,
        message: 'Thank you for participating in the LeetCode Webinar.',
      },
      201
    );
  } catch (err) {
    if (err.statusCode === 400) {
      return sendError(res, err.message, 400);
    }
    console.error('[webinar] submit error:', err);
    return sendError(res, 'Unable to submit your participation. Please try again.', 500);
  }
}

export async function getAdminWebinarParticipations(req, res) {
  try {
    const data = await listAdminWebinarParticipations(req.query);
    return sendSuccess(res, data);
  } catch (err) {
    console.error('[leetcode-webinar/admin] list error:', err);
    return sendError(res, 'Unable to load webinar candidates.', 500);
  }
}

export async function getAdminWebinarParticipationById(req, res) {
  try {
    const row = await getAdminWebinarParticipationDetail(req.params.id);
    if (!row) return sendError(res, 'Participation not found.', 404);
    return sendSuccess(res, { application: row });
  } catch (err) {
    console.error('[leetcode-webinar/admin] detail error:', err);
    return sendError(res, 'Unable to load participation details.', 500);
  }
}

export async function patchAdminWebinarParticipationStatus(req, res) {
  try {
    const application = await updateAdminWebinarParticipationStatus(req.params.id, req.validatedStatus);
    return sendSuccess(res, { application, message: 'Status updated successfully.' });
  } catch (err) {
    if (err.statusCode === 400) return sendError(res, err.message, 400);
    if (err.statusCode === 404) return sendError(res, err.message, 404);
    console.error('[leetcode-webinar/admin] status error:', err);
    return sendError(res, 'Unable to update status.', 500);
  }
}

export { ensureFeatureEnabled };
