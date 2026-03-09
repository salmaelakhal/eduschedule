import { Router } from 'express';
import { body } from 'express-validator';
import {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
} from '../controllers/subject.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', getSubjects);

router.post('/',
  authorize('ADMIN'),
  [body('name').notEmpty().withMessage('Nom de matière requis.')],
  validate,
  createSubject
);

router.put('/:id', authorize('ADMIN'), updateSubject);
router.delete('/:id', authorize('ADMIN'), deleteSubject);

export default router;