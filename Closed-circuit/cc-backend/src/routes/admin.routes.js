import { Router } from 'express';
import { adminLogin, getAdminProfile } from '../controllers/auth.controller.js';
import {
  getEnquiries,
  getEnquiryDetail,
  exportEnquiriesExcel,
  exportEnquiriesPdf,
} from '../controllers/enquiry.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validateAdminLoginBody } from '../middleware/validation.middleware.js';
import { loginRateLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

router.post('/login', loginRateLimiter, validateAdminLoginBody, adminLogin);
router.get('/me', requireAuth, getAdminProfile);
router.get('/enquiries', requireAuth, getEnquiries);
router.get('/enquiries/export/excel', requireAuth, exportEnquiriesExcel);
router.get('/enquiries/export/pdf', requireAuth, exportEnquiriesPdf);
router.get('/enquiries/:id', requireAuth, getEnquiryDetail);

export default router;
