import { Router } from 'express';
import {
  getDemoVideos,
  getDemoVideoDetail,
  uploadDemoVideoHandler,
  updateDemoVideoHandler,
  deleteDemoVideoHandler,
} from '../controllers/demoVideo.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validateDemoVideoBody } from '../middleware/validation.middleware.js';
import { demoVideoUpload } from '../middleware/upload.middleware.js';

const router = Router();

router.use(requireAuth);

router.post('/upload', demoVideoUpload, validateDemoVideoBody, uploadDemoVideoHandler);
router.get('/', getDemoVideos);
router.get('/:id', getDemoVideoDetail);
router.put('/:id', demoVideoUpload, updateDemoVideoHandler);
router.delete('/:id', deleteDemoVideoHandler);

export default router;
