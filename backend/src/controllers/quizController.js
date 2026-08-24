import { quizService } from '../services/quizService.js';
import { certificateService } from '../services/certificateService.js';

export const quizController = {
  // GET /api/quizzes/:id (Section 30: NEVER sends is_correct to browser)
  async getById(req, res, next) {
    try {
      const quiz = await quizService.getQuizById(req.params.id);
      if (!quiz) {
        return res.status(404).json({
          success: false,
          message: 'Evaluación no encontrada.',
        });
      }
      res.json({
        success: true,
        data: quiz,
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/quizzes/:id/submit (Section 31: Evaluates and grades on server)
  async submit(req, res, next) {
    try {
      const { id } = req.params;
      const { answers, courseId } = req.body;

      const result = await quizService.submitQuizAttempt(id, req.user.id, answers);

      // If passed and courseId provided, issue certificate automatically
      let certificate = null;
      if (result.passed && courseId) {
        try {
          certificate = await certificateService.issueCertificate(req.user.id, courseId);
        } catch (certErr) {
          // If course is not 100% complete yet, certificate won't be created until lessons are completed
        }
      }

      res.json({
        success: true,
        message: result.passed
          ? '¡Felicitaciones! Has aprobado la evaluación.'
          : 'No has alcanzado el puntaje mínimo requerido. Puedes volver a intentarlo.',
        data: {
          ...result,
          certificate,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/quizzes/:id/attempts
  async getAttempts(req, res, next) {
    try {
      const attempts = await quizService.getUserAttempts(req.params.id, req.user.id);
      res.json({
        success: true,
        data: attempts,
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/quizzes (Admin only)
  async saveQuiz(req, res, next) {
    try {
      const quiz = await quizService.saveQuiz(req.body);
      res.status(201).json({
        success: true,
        message: 'Evaluación guardada exitosamente.',
        data: quiz,
      });
    } catch (err) {
      next(err);
    }
  },
};
