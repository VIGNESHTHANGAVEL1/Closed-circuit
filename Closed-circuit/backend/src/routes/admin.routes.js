import { Router } from 'express';
import {
  adminLogin,
  getAdminProfile,
  changePassword,
  setRolePassword,
} from '../controllers/auth.controller.js';
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
import { requireRoles, requireAdmin } from '../middleware/rbac.middleware.js';
import { ADMIN_ROLES } from '../constants/adminRoles.js';
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
  getAdminWebinarParticipations as getEntrepreneurshipWebinarParticipations,
  getAdminWebinarParticipationById as getEntrepreneurshipWebinarParticipationById,
  patchAdminWebinarParticipationStatus as patchEntrepreneurshipWebinarParticipationStatus,
} from '../modules/entrepreneurshipWebinar/entrepreneurshipWebinar.controller.js';
import {
  getAdminWebinarParticipations as getLeetcodeWebinarParticipations,
  getAdminWebinarParticipationById as getLeetcodeWebinarParticipationById,
  patchAdminWebinarParticipationStatus as patchLeetcodeWebinarParticipationStatus,
} from '../modules/leetcodeWebinar/leetcodeWebinar.controller.js';
import {
  validateAdminLoginBody,
  validateEnquiryStatusBody,
  validateCareerStatusBody,
  validateWebinarStatusBody,
  validateClientDisplayStatusBody,
  validateChangePasswordBody,
  validateSetRolePasswordBody,
} from '../middleware/validation.middleware.js';
import { loginRateLimiter } from '../middleware/rateLimit.middleware.js';
import { clientImageUpload } from '../middleware/upload.middleware.js';

const router = Router();

const allRoles = [
  ADMIN_ROLES.ADMIN,
  ADMIN_ROLES.ISE,
  ADMIN_ROLES.HR,
  ADMIN_ROLES.WEBINAR_ADMIN,
];

router.post('/login', loginRateLimiter, validateAdminLoginBody, adminLogin);
router.get('/me', requireAuth, getAdminProfile);
router.post(
  '/change-password',
  requireAuth,
  requireAdmin,
  validateChangePasswordBody,
  changePassword
);
router.post(
  '/role-password',
  requireAuth,
  requireAdmin,
  validateSetRolePasswordBody,
  setRolePassword
);
router.get(
  '/dashboard/stats',
  requireAuth,
  requireRoles(...allRoles),
  getAdminDashboardStats
);

router.get('/enquiries', requireAuth, requireRoles(ADMIN_ROLES.ADMIN, ADMIN_ROLES.ISE), getEnquiries);
router.get(
  '/enquiries/export/excel',
  requireAuth,
  requireRoles(ADMIN_ROLES.ADMIN, ADMIN_ROLES.ISE),
  exportEnquiriesExcel
);
router.get(
  '/enquiries/export/pdf',
  requireAuth,
  requireRoles(ADMIN_ROLES.ADMIN, ADMIN_ROLES.ISE),
  exportEnquiriesPdf
);
router.patch(
  '/enquiries/:id/status',
  requireAuth,
  requireRoles(ADMIN_ROLES.ADMIN, ADMIN_ROLES.ISE),
  validateEnquiryStatusBody,
  patchEnquiryStatus
);
router.get(
  '/enquiries/:id',
  requireAuth,
  requireRoles(ADMIN_ROLES.ADMIN, ADMIN_ROLES.ISE),
  getEnquiryDetail
);

router.get('/clients', requireAuth, requireRoles(ADMIN_ROLES.ADMIN), getClients);
router.get('/clients/:id', requireAuth, requireRoles(ADMIN_ROLES.ADMIN), getClientDetail);
router.post('/clients', requireAuth, requireRoles(ADMIN_ROLES.ADMIN), clientImageUpload, createClientHandler);
router.put('/clients/:id', requireAuth, requireRoles(ADMIN_ROLES.ADMIN), clientImageUpload, updateClientHandler);
router.patch(
  '/clients/:id/display-status',
  requireAuth,
  requireRoles(ADMIN_ROLES.ADMIN),
  validateClientDisplayStatusBody,
  patchClientDisplayStatus
);
router.delete('/clients/:id', requireAuth, requireRoles(ADMIN_ROLES.ADMIN), deleteClientHandler);

router.get(
  '/careers/sales',
  requireAuth,
  requireRoles(ADMIN_ROLES.ADMIN, ADMIN_ROLES.HR),
  getCareerApplications
);
router.patch(
  '/careers/sales/:id/status',
  requireAuth,
  requireRoles(ADMIN_ROLES.ADMIN, ADMIN_ROLES.HR),
  validateCareerStatusBody,
  patchCareerApplicationStatus
);
router.get(
  '/careers/sales/:id',
  requireAuth,
  requireRoles(ADMIN_ROLES.ADMIN, ADMIN_ROLES.HR),
  getCareerApplicationById
);

router.get(
  '/careers/technical',
  requireAuth,
  requireRoles(ADMIN_ROLES.ADMIN, ADMIN_ROLES.HR),
  getTechnicalCareerApplications
);
router.patch(
  '/careers/technical/:id/status',
  requireAuth,
  requireRoles(ADMIN_ROLES.ADMIN, ADMIN_ROLES.HR),
  validateCareerStatusBody,
  patchTechnicalCareerApplicationStatus
);
router.get(
  '/careers/technical/:id',
  requireAuth,
  requireRoles(ADMIN_ROLES.ADMIN, ADMIN_ROLES.HR),
  getTechnicalCareerApplicationById
);

router.get(
  '/webinars/entrepreneurship/participations',
  requireAuth,
  requireRoles(ADMIN_ROLES.ADMIN, ADMIN_ROLES.WEBINAR_ADMIN),
  getEntrepreneurshipWebinarParticipations
);
router.patch(
  '/webinars/entrepreneurship/participations/:id/status',
  requireAuth,
  requireRoles(ADMIN_ROLES.ADMIN, ADMIN_ROLES.WEBINAR_ADMIN),
  validateWebinarStatusBody,
  patchEntrepreneurshipWebinarParticipationStatus
);
router.get(
  '/webinars/entrepreneurship/participations/:id',
  requireAuth,
  requireRoles(ADMIN_ROLES.ADMIN, ADMIN_ROLES.WEBINAR_ADMIN),
  getEntrepreneurshipWebinarParticipationById
);

router.get(
  '/webinars/leetcode/participations',
  requireAuth,
  requireRoles(ADMIN_ROLES.ADMIN, ADMIN_ROLES.WEBINAR_ADMIN),
  getLeetcodeWebinarParticipations
);
router.patch(
  '/webinars/leetcode/participations/:id/status',
  requireAuth,
  requireRoles(ADMIN_ROLES.ADMIN, ADMIN_ROLES.WEBINAR_ADMIN),
  validateWebinarStatusBody,
  patchLeetcodeWebinarParticipationStatus
);
router.get(
  '/webinars/leetcode/participations/:id',
  requireAuth,
  requireRoles(ADMIN_ROLES.ADMIN, ADMIN_ROLES.WEBINAR_ADMIN),
  getLeetcodeWebinarParticipationById
);

export default router;
