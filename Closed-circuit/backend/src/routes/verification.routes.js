import { Router } from 'express';
import {
  requestMobileOtp,
  confirmMobileOtp,
  requestEmailOtp,
  confirmEmailOtp,
} from '../controllers/verification.controller.js';
import { enquiryRateLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

router.post('/verification/mobile/send', enquiryRateLimiter, requestMobileOtp);
router.post('/verification/mobile/verify', enquiryRateLimiter, confirmMobileOtp);
router.post('/verification/email/send', enquiryRateLimiter, requestEmailOtp);
router.post('/verification/email/verify', enquiryRateLimiter, confirmEmailOtp);

export default router;
