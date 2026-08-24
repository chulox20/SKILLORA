import { Router } from 'express';
import { quizController } from '../controllers/quizController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import { validate } from '../middleware/validate.js';
import { submitQuizSchema, saveQuizSchema } from '../validators/quizValidators.js';

const router = Router();

// Student (Authenticated & Enrolled)
router.get('/:id', authMiddleware, quizController.getById);
router.post('/:id/submit', authMiddleware, validate(submitQuizSchema), quizController.submit);
router.get('/:id/attempts', authMiddleware, quizController.getAttempts);

// Admin only
router.post('/', authMiddleware, requireRole('admin'), validate(saveQuizSchema), quizController.saveQuiz);

export default router;
