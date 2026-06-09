import {
  sendMobileVerificationOtp,
  verifyMobileOtp,
  sendEmailVerificationOtp,
  verifyEmailOtp,
} from '../services/verificationService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function requestMobileOtp(req, res) {
  try {
    console.log('[verification] POST /api/verification/mobile/send');
    const result = await sendMobileVerificationOtp(req.body);
    console.log(`[verification] Mobile OTP result: deliveryMode=${result.deliveryMode || 'unknown'}`);
    return sendSuccess(res, result);
  } catch (err) {
    if (err.statusCode === 400) {
      return sendError(res, err.message, 400);
    }
    console.error('[verification] mobile send error:', err.message);
    return sendError(res, 'Unable to send mobile OTP. Please try again.', 500);
  }
}

export async function confirmMobileOtp(req, res) {
  try {
    const result = await verifyMobileOtp(req.body);
    return sendSuccess(res, result);
  } catch (err) {
    if (err.statusCode === 400) {
      return sendError(res, err.message, 400);
    }
    console.error('[verification] mobile verify error:', err.message);
    return sendError(res, 'Unable to verify mobile OTP. Please try again.', 500);
  }
}

export async function requestEmailOtp(req, res) {
  try {
    console.log('[verification] POST /api/verification/email/send');
    const result = await sendEmailVerificationOtp(req.body);
    console.log(`[verification] Email OTP result: deliveryMode=${result.deliveryMode || 'unknown'}`);
    return sendSuccess(res, result);
  } catch (err) {
    if (err.statusCode === 400) {
      return sendError(res, err.message, 400);
    }
    console.error('[verification] email send error:', err.message);
    return sendError(res, 'Unable to send email OTP. Please try again.', 500);
  }
}

export async function confirmEmailOtp(req, res) {
  try {
    const result = await verifyEmailOtp(req.body);
    return sendSuccess(res, result);
  } catch (err) {
    if (err.statusCode === 400) {
      return sendError(res, err.message, 400);
    }
    console.error('[verification] email verify error:', err.message);
    return sendError(res, 'Unable to verify email OTP. Please try again.', 500);
  }
}
