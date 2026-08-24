import { Router } from 'express';
import { enrollmentController } from '../controllers/enrollmentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Inscriptions
router.post('/courses/:courseId/enroll', authMiddleware, enrollmentController.enroll);
router.get('/me/courses', authMiddleware, enrollmentController.getMyCourses);
router.get('/me/courses/:courseId', authMiddleware, enrollmentController.checkEnrollment);

export default router;
