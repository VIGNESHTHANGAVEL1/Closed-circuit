import {
  createTechnicalCareerApplication,
  listTechnicalCareerApplications,
  getTechnicalCareerApplicationDetail,
  updateTechnicalCareerStatus,
} from '../services/technicalCareerApplication.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function submitTechnicalCareerApplication(req, res) {
  try {
    const result = await createTechnicalCareerApplication(req.body, req.file);
    return sendSuccess(
      res,
      {
        id: result.id,
        message:
          'Your application has been submitted successfully. Our team will review it and contact you if shortlisted.',
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
    console.error('[careers/technical] submit error:', err);
    return sendError(res, 'Unable to submit your application. Please try again.', 500);
  }
}

export async function getTechnicalCareerApplications(req, res) {
  try {
    const data = await listTechnicalCareerApplications(req.query);
    return sendSuccess(res, data);
  } catch (err) {
    console.error('[careers/technical] list error:', err);
    return sendError(res, 'Unable to load technical applications.', 500);
  }
}

export async function getTechnicalCareerApplicationById(req, res) {
  try {
    const application = await getTechnicalCareerApplicationDetail(req.params.id);
    if (!application) {
      return sendError(res, 'Application not found.', 404);
    }
    return sendSuccess(res, { application });
  } catch (err) {
    console.error('[careers/technical] detail error:', err);
    return sendError(res, 'Unable to load application details.', 500);
  }
}

export async function patchTechnicalCareerApplicationStatus(req, res) {
  try {
    const application = await updateTechnicalCareerStatus(req.params.id, req.validatedStatus);
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
    console.error('[careers/technical] status update error:', err);
    return sendError(res, 'Unable to update application status.', 500);
  }
}
