import { Router } from 'express';
import { body } from 'express-validator';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/user.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';

const router = Router();

router.use(authenticate, authorize('ADMIN'));

router.get('/', getUsers);
router.get('/:id', getUserById);

router.post('/',
  [
    body('fullName').notEmpty().withMessage('Nom complet requis.'),
    body('email').isEmail().withMessage('Email invalide.'),
    body('password').isLength({ min: 6 }).withMessage('6 caractères minimum.'),
    body('role').optional().isIn(['ADMIN', 'TEACHER', 'STUDENT']),
  ],
  validate,
  createUser
);

router.put('/:id',
  [
    body('email').optional().isEmail().withMessage('Email invalide.'),
    body('password').optional().isLength({ min: 6 }).withMessage('6 caractères minimum.'),
    body('role').optional().isIn(['ADMIN', 'TEACHER', 'STUDENT']),
  ],
  validate,
  updateUser
);

router.delete('/:id', deleteUser);

export default router;