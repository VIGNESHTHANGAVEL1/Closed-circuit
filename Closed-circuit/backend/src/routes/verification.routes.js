import { Router } from 'express';
import {
  requestMobileOtp,
  confirmMobileOtp,
  requestEmailOtp,
  confirmEmailOtp,
} from '../controllers/verification.controller.js';
const router = Router();

router.post('/verification/mobile/send', requestMobileOtp);
router.post('/verification/mobile/verify', confirmMobileOtp);
router.post('/verification/email/send', requestEmailOtp);
router.post('/verification/email/verify', confirmEmailOtp);

export default router;
