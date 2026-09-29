import {
  normalizeWebinarInput,
  validateWebinarPayload,
} from './entrepreneurshipWebinar.service.js';

export function validateWebinarParticipationBody(req, res, next) {
  const payload = normalizeWebinarInput(req.body);
  const validationError = validateWebinarPayload(payload);

  if (validationError) {
    return res.status(400).json({
      success: false,
      message: validationError,
    });
  }

  if (!req.body?.mobileVerificationToken?.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Mobile verification is required before submitting.',
    });
  }

  if (!req.body?.emailVerificationToken?.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Email verification is required before submitting.',
    });
  }

  req.webinarPayload = payload;
  next();
}
