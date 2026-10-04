import { Router } from 'express';
import {
  getWebinarReviews,
  getWebinarReviewById,
  submitWebinarParticipation,
  ensureFeatureEnabled,
} from './leetcodeWebinar.controller.js';
import { validateWebinarParticipationBody } from './leetcodeWebinar.middleware.js';
import { enquiryRateLimiter } from '../../middleware/rateLimit.middleware.js';

const router = Router();

router.use(ensureFeatureEnabled);

router.get('/leetcode-webinar/reviews', getWebinarReviews);
router.get('/leetcode-webinar/reviews/:id', getWebinarReviewById);
router.post(
  '/leetcode-webinar/participations',
  enquiryRateLimiter,
  validateWebinarParticipationBody,
  submitWebinarParticipation
);

export default router;
