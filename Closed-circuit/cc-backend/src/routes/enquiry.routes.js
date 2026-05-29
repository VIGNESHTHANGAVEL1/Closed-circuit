import { Router } from 'express';
import { submitEnquiry, submitContact } from '../controllers/enquiry.controller.js';
import { validateEnquiryBody } from '../middleware/validation.middleware.js';
import { enquiryRateLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

router.post('/enquiries', enquiryRateLimiter, validateEnquiryBody, submitEnquiry);

// Backward compatibility for existing integrations
router.post('/contact', enquiryRateLimiter, validateEnquiryBody, submitContact);

export default router;
