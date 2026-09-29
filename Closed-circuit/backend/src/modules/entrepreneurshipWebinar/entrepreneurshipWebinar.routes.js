import { Router } from 'express';
import {
  getWebinarReviews,
  getWebinarReviewById,
  submitWebinarParticipation,
  ensureFeatureEnabled,
} from './entrepreneurshipWebinar.controller.js';
import { validateWebinarParticipationBody } from './entrepreneurshipWebinar.middleware.js';
import { enquiryRateLimiter } from '../../middleware/rateLimit.middleware.js';

const router = Router();

router.use(ensureFeatureEnabled);

router.get('/entrepreneurship-webinar/reviews', getWebinarReviews);
router.get('/entrepreneurship-webinar/reviews/:id', getWebinarReviewById);
router.post(
  '/entrepreneurship-webinar/participations',
  enquiryRateLimiter,
  validateWebinarParticipationBody,
  submitWebinarParticipation
);

export default router;
