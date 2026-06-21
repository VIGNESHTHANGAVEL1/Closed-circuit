import { Router } from 'express';
import { getPublicClients } from '../controllers/client.controller.js';

const router = Router();

router.get('/clients', getPublicClients);

export default router;
