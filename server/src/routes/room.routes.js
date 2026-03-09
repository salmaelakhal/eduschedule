import { Router } from 'express';
import { body } from 'express-validator';
import {
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} from '../controllers/room.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', getRooms);

router.post('/',
  authorize('ADMIN'),
  [
    body('name').notEmpty().withMessage('Nom de salle requis.'),
    body('capacity').isInt({ min: 1 }).withMessage('Capacité invalide.'),
  ],
  validate,
  createRoom
);

router.put('/:id', authorize('ADMIN'), updateRoom);
router.delete('/:id', authorize('ADMIN'), deleteRoom);

export default router;