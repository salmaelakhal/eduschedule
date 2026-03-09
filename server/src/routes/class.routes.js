import { Router } from 'express';
import { body } from 'express-validator';
import {
  getClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  addStudentToClass,
  removeStudentFromClass,
} from '../controllers/class.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', getClasses);
router.get('/:id', getClassById);

router.post('/',
  authorize('ADMIN'),
  [body('name').notEmpty().withMessage('Nom de classe requis.')],
  validate,
  createClass
);

router.put('/:id',
  authorize('ADMIN'),
  [body('name').notEmpty().withMessage('Nom de classe requis.')],
  validate,
  updateClass
);

router.delete('/:id', authorize('ADMIN'), deleteClass);

router.post('/:id/students',
  authorize('ADMIN'),
  [body('studentId').notEmpty().withMessage('studentId requis.')],
  validate,
  addStudentToClass
);

router.delete('/:id/students/:studentId',
  authorize('ADMIN'),
  removeStudentFromClass
);

export default router;