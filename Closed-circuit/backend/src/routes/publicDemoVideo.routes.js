import { Router } from 'express';
import { getPublicDemoVideos } from '../controllers/demoVideo.controller.js';

const router = Router();

router.get('/', getPublicDemoVideos);

export default router;
