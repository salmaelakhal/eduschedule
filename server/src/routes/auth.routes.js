import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, getMe, logout } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';

const router = Router();

// POST /api/auth/register
router.post(
  '/register',
  [
    body('fullName').notEmpty().withMessage('Le nom complet est requis.'),
    body('email').isEmail().withMessage('Email invalide.'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Mot de passe : 6 caractères minimum.'),
    body('role')
      .optional()
      .isIn(['ADMIN', 'TEACHER', 'STUDENT'])
      .withMessage('Rôle invalide.'),
  ],
  validate,
  register
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email invalide.'),
    body('password').notEmpty().withMessage('Mot de passe requis.'),
  ],
  validate,
  login
);

// GET /api/auth/me (protégée)
router.get('/me', authenticate, getMe);

// POST /api/auth/logout (protégée)
router.post('/logout', authenticate, logout);

export default router;