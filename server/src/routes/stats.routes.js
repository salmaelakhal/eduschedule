import { Router } from 'express';
import { getStats } from '../controllers/stats.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', authenticate, authorize('ADMIN'), getStats);

export default router;