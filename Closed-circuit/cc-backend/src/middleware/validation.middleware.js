import { normalizeEnquiryInput } from '../services/enquiry.service.js';

export function validateEnquiryBody(req, res, next) {
  const { name, email, phone, message } = normalizeEnquiryInput(req.body);

  if (!name || !email || !phone || !message) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, phone, and message are required.',
    });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address.',
    });
  }

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
