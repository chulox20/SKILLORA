import { Router } from 'express';
import { categoryController } from '../controllers/categoryController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = Router();

router.get('/', categoryController.getAll);
router.post('/', authMiddleware, requireRole('admin'), categoryController.save);
router.delete('/:id', authMiddleware, requireRole('admin'), categoryController.delete);

export default router;
