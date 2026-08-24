import { Router } from 'express';
import { progressController } from '../controllers/progressController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Progress
router.post('/lessons/:lessonId/complete', authMiddleware, progressController.markComplete);
router.delete('/lessons/:lessonId/complete', authMiddleware, progressController.unmarkComplete);
router.get('/courses/:courseId/progress', authMiddleware, progressController.getCourseProgress);

export default router;
