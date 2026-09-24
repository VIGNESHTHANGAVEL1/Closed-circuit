import { Router } from 'express';
import { adminLogin, getAdminProfile, changePassword } from '../controllers/auth.controller.js';
import {
  getEnquiries,
  getEnquiryDetail,
  exportEnquiriesExcel,
  exportEnquiriesPdf,
  patchEnquiryStatus,
} from '../controllers/enquiry.controller.js';
import { getAdminDashboardStats } from '../controllers/dashboard.controller.js';
import {
  getClients,
  getClientDetail,
  createClientHandler,
  updateClientHandler,
  patchClientDisplayStatus,
  deleteClientHandler,
} from '../controllers/client.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import {
  getCareerApplications,
  getCareerApplicationById,
  patchCareerApplicationStatus,
} from '../controllers/careerApplication.controller.js';
import {
  getTechnicalCareerApplications,
  getTechnicalCareerApplicationById,
  patchTechnicalCareerApplicationStatus,
} from '../controllers/technicalCareerApplication.controller.js';
import {
  validateAdminLoginBody,
  validateEnquiryStatusBody,
  validateCareerStatusBody,
  validateClientDisplayStatusBody,
  validateChangePasswordBody,
} from '../middleware/validation.middleware.js';
import { loginRateLimiter } from '../middleware/rateLimit.middleware.js';
import { clientImageUpload } from '../middleware/upload.middleware.js';

const router = Router();

router.post('/login', loginRateLimiter, validateAdminLoginBody, adminLogin);
router.get('/me', requireAuth, getAdminProfile);
router.post('/change-password', requireAuth, validateChangePasswordBody, changePassword);
router.get('/dashboard/stats', requireAuth, getAdminDashboardStats);

router.get('/enquiries', requireAuth, getEnquiries);
router.get('/enquiries/export/excel', requireAuth, exportEnquiriesExcel);
router.get('/enquiries/export/pdf', requireAuth, exportEnquiriesPdf);
router.patch('/enquiries/:id/status', requireAuth, validateEnquiryStatusBody, patchEnquiryStatus);
router.get('/enquiries/:id', requireAuth, getEnquiryDetail);

router.get('/clients', requireAuth, getClients);
router.get('/clients/:id', requireAuth, getClientDetail);
router.post('/clients', requireAuth, clientImageUpload, createClientHandler);
router.put('/clients/:id', requireAuth, clientImageUpload, updateClientHandler);
router.patch(
  '/clients/:id/display-status',
  requireAuth,
  validateClientDisplayStatusBody,
  patchClientDisplayStatus
);
router.delete('/clients/:id', requireAuth, deleteClientHandler);

router.get('/careers/sales', requireAuth, getCareerApplications);
router.patch('/careers/sales/:id/status', requireAuth, validateCareerStatusBody, patchCareerApplicationStatus);
router.get('/careers/sales/:id', requireAuth, getCareerApplicationById);

router.get('/careers/technical', requireAuth, getTechnicalCareerApplications);
router.patch(
  '/careers/technical/:id/status',
  requireAuth,
  validateCareerStatusBody,
  patchTechnicalCareerApplicationStatus
);
router.get('/careers/technical/:id', requireAuth, getTechnicalCareerApplicationById);

router.get('/careers', requireAuth, getCareerApplications);
router.patch('/careers/:id/status', requireAuth, validateCareerStatusBody, patchCareerApplicationStatus);
router.get('/careers/:id', requireAuth, getCareerApplicationById);

export default router;
