import {
  createCareerApplication,
  listCareerApplications,
  getCareerApplicationDetail,
  updateCareerStatus,
} from '../services/careerApplication.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function submitCareerApplication(req, res) {
  try {
    const result = await createCareerApplication(req.body, req.file);
    return sendSuccess(
      res,
      {
        id: result.id,
        message: 'Your application has been submitted successfully. Our team will review it and contact you if shortlisted.',
      },
      201
    );
  } catch (err) {
    if (err.statusCode === 400) {
      return sendError(res, err.message, 400);
    }
    if (err.statusCode === 503) {
      return sendError(res, err.message, 503);
    }
    console.error('[careers] submit error:', err);
    return sendError(res, 'Unable to submit your application. Please try again.', 500);
  }
}

export async function getCareerApplications(req, res) {
  try {
    const data = await listCareerApplications(req.query);
    return sendSuccess(res, data);
  } catch (err) {
    console.error('[careers] list error:', err);
    return sendError(res, 'Unable to load job applications.', 500);
  }
}

export async function getCareerApplicationById(req, res) {
  try {
    const application = await getCareerApplicationDetail(req.params.id);
    if (!application) {
      return sendError(res, 'Application not found.', 404);
    }
    return sendSuccess(res, { application });
  } catch (err) {
    console.error('[careers] detail error:', err);
    return sendError(res, 'Unable to load application details.', 500);
  }
}

export async function patchCareerApplicationStatus(req, res) {
  try {
    const application = await updateCareerStatus(req.params.id, req.validatedStatus);
    return sendSuccess(res, {
      application,
      message: 'Application status updated successfully.',
    });
  } catch (err) {
    if (err.statusCode === 400) {
      return sendError(res, err.message, 400);
    }
    if (err.statusCode === 404) {
      return sendError(res, err.message, 404);
    }
    console.error('[careers] status update error:', err);
    return sendError(res, 'Unable to update application status.', 500);
  }
}
