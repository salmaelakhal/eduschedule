import { Router } from 'express';
import {
  getScheduleLogs,
  getScheduleLogById,
  manualReset,
} from '../controllers/scheduleLog.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate, authorize('ADMIN'));

router.get('/',         getScheduleLogs);
router.get('/:id',      getScheduleLogById);
router.post('/reset',   manualReset);  // ← reset manuel

export default router;