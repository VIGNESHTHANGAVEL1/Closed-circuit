import { Router } from 'express';
import { submitCareerApplication } from '../controllers/careerApplication.controller.js';
import { submitTechnicalCareerApplication } from '../controllers/technicalCareerApplication.controller.js';
import { validateCareerApplicationBody } from '../middleware/validation.middleware.js';
import { resumeUpload } from '../middleware/upload.middleware.js';
import { enquiryRateLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

const salesApplicationHandlers = [
  enquiryRateLimiter,
  resumeUpload,
  validateCareerApplicationBody,
  submitCareerApplication,
];

router.post('/careers/sales', ...salesApplicationHandlers);
router.post('/careers', ...salesApplicationHandlers);

router.post(
  '/careers/technical',
  enquiryRateLimiter,
  resumeUpload,
  validateCareerApplicationBody,
  submitTechnicalCareerApplication
);

export default router;
