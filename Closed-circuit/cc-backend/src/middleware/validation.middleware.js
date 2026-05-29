import { normalizeContactInput, validateContactPayload } from '../services/enquiry.service.js';

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
