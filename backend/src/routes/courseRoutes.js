import { Router } from 'express';
import { courseController } from '../controllers/courseController.js';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import { validate } from '../middleware/validate.js';
import { createCourseSchema, updateCourseSchema } from '../validators/courseValidators.js';

const router = Router();

// Public / Student
router.get('/', optionalAuthMiddleware, courseController.getAll);
router.get('/:slug', optionalAuthMiddleware, courseController.getBySlug);

// Admin only routes
router.post(
  '/',
  authMiddleware,
  requireRole('admin'),
  validate(createCourseSchema),
  courseController.create
);

router.put(
  '/:id',
  authMiddleware,
  requireRole('admin'),
  validate(updateCourseSchema),
  courseController.update
);

router.delete('/:id', authMiddleware, requireRole('admin'), courseController.delete);
router.post('/:id/duplicate', authMiddleware, requireRole('admin'), courseController.duplicate);
router.post('/:id/modules', authMiddleware, requireRole('admin'), courseController.saveModules);

export default router;
