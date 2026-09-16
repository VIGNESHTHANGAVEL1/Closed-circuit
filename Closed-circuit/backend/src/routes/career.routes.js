import { Router } from 'express';
import { submitCareerApplication } from '../controllers/careerApplication.controller.js';
import { validateCareerApplicationBody } from '../middleware/validation.middleware.js';
import { resumeUpload } from '../middleware/upload.middleware.js';
import { enquiryRateLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

router.post(
  '/careers',
  enquiryRateLimiter,
  resumeUpload,
  validateCareerApplicationBody,
  submitCareerApplication
);

export default router;
