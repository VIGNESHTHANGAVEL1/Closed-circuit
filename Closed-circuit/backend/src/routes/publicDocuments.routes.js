import { Router } from 'express';
import { getBrochures, getCertificates } from '../controllers/publicDocuments.controller.js';

const router = Router();

router.get('/brochures', getBrochures);
router.get('/certificates', getCertificates);

export default router;
