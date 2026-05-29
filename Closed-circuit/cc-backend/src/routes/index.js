import { Router } from 'express';
import enquiryRoutes from './enquiry.routes.js';
import adminRoutes from './admin.routes.js';

const router = Router();

router.use(enquiryRoutes);
router.use('/admin', adminRoutes);

export default router;
