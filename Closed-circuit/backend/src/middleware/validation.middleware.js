import { normalizeContactInput, validateContactPayload } from '../services/enquiry.service.js';
import { normalizeEnquiryStatus } from '../constants/enquiryStatus.js';

export function validateEnquiryBody(req, res, next) {
  const payload = normalizeContactInput(req.body);
  const validationError = validateContactPayload(payload);

  if (validationError) {
    return res.status(400).json({
      success: false,
      message: validationError,
    });
  }

  req.contactPayload = payload;
  next();
}

export function validateEnquiryStatusBody(req, res, next) {
  const status = normalizeEnquiryStatus(req.body?.status);

  if (!status) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status. Allowed: New, Processing, Rejected temporarily, Rejected permanently, Closed.',
    });
  }

  req.validatedStatus = status;
  next();
}

export function validateAdminLoginBody(req, res, next) {
  const { username, password } = req.body;

  if (!username?.trim() || !password) {
    return res.status(400).json({
      success: false,
      message: 'Username and password are required.',
    });
  }

  next();
}

export function validateClientDisplayStatusBody(req, res, next) {
  const raw = req.body?.display_status;
  if (raw === undefined || raw === null) {
    return res.status(400).json({
      success: false,
      message: 'display_status is required.',
    });
  }

  const isTruthy =
    raw === true || raw === 'true' || raw === '1' || raw === 1 || raw === 'on';
  const isFalsy =
    raw === false || raw === 'false' || raw === '0' || raw === 0 || raw === 'off';

  if (!isTruthy && !isFalsy) {
    return res.status(400).json({
      success: false,
      message: 'display_status must be a boolean value.',
    });
  }

  req.validatedDisplayStatus = isTruthy;
  next();
}

export function validateChangePasswordBody(req, res, next) {
  const { currentPassword, newPassword, confirmPassword } = req.body || {};

  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: 'Current password, new password, and confirm password are required.',
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: 'New password and confirm password must match.',
    });
  }

  if (String(newPassword).length < 8) {
    return res.status(400).json({
      success: false,
      message: 'New password must be at least 8 characters.',
    });
  }

  next();
}
