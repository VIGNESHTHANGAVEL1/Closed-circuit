import { Router } from 'express';
import {
  requestMobileOtp,
  confirmMobileOtp,
  requestEmailOtp,
  confirmEmailOtp,
} from '../controllers/verification.controller.js';
import { verificationRateLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

router.post('/verification/mobile/send', verificationRateLimiter, requestMobileOtp);
router.post('/verification/mobile/verify', verificationRateLimiter, confirmMobileOtp);
router.post('/verification/email/send', verificationRateLimiter, requestEmailOtp);
router.post('/verification/email/verify', verificationRateLimiter, confirmEmailOtp);

export default router;
