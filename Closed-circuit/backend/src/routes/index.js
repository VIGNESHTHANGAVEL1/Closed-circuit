import { Router } from 'express';
import enquiryRoutes from './enquiry.routes.js';
import verificationRoutes from './verification.routes.js';
import adminRoutes from './admin.routes.js';
import clientRoutes from './client.routes.js';
import demoVideoRoutes from './demoVideo.routes.js';
import publicDemoVideoRoutes from './publicDemoVideo.routes.js';
import publicDocumentsRoutes from './publicDocuments.routes.js';

const router = Router();

router.use(verificationRoutes);
router.use(enquiryRoutes);
router.use(clientRoutes);
router.use('/demo-videos', demoVideoRoutes);
router.use('/public/demo-videos', publicDemoVideoRoutes);
router.use('/public', publicDocumentsRoutes);
router.use('/admin', adminRoutes);

export default router;
