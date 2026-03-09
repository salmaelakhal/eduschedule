import { Router } from 'express';
import { body } from 'express-validator';
import {
  getSchedules,
  getMySchedule,
  getTimeSlots,
  createSchedule,
  deleteSchedule,
} from '../controllers/schedule.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';

const router = Router();

router.use(authenticate);

// GET /api/schedules/timeslots → tous les créneaux (tous rôles)
router.get('/timeslots', getTimeSlots);

// GET /api/schedules/my → emploi du temps personnel (Teacher + Student)
router.get('/my',
  authorize('TEACHER', 'STUDENT'),
  getMySchedule
);

// GET /api/schedules?classId=1 → Admin seulement
router.get('/',
  authorize('ADMIN'),
  getSchedules
);

// POST /api/schedules → créer une séance (Admin)
router.post('/',
  authorize('ADMIN'),
  [
    body('classId').notEmpty().withMessage('classId requis.'),
    body('teacherId').notEmpty().withMessage('teacherId requis.'),
    body('subjectId').notEmpty().withMessage('subjectId requis.'),
    body('timeSlotId').notEmpty().withMessage('timeSlotId requis.'),
    body('isOnline').isBoolean().withMessage('isOnline doit être true ou false.'),
  ],
  validate,
  createSchedule
);

// DELETE /api/schedules/:id → Admin seulement
router.delete('/:id',
  authorize('ADMIN'),
  deleteSchedule
);

export default router;