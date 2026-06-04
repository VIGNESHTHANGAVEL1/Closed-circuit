import { Router } from 'express';
import enquiryRoutes from './enquiry.routes.js';
import adminRoutes from './admin.routes.js';
import clientRoutes from './client.routes.js';

const router = Router();

router.use(enquiryRoutes);
router.use(clientRoutes);
router.use('/admin', adminRoutes);

export default router;
