import { quizService } from '../services/quizService.js';
import { certificateService } from '../services/certificateService.js';
import { enrollmentService } from '../services/enrollmentService.js';

export const quizController = {
  // GET /api/quizzes/:id (Authenticated + Enrolled requirement, Point 5)
  async getById(req, res, next) {
    try {
      const fullQuiz = await quizService.getFullQuizById(req.params.id);
      if (!fullQuiz) {
        return res.status(404).json({
          success: false,
          message: 'Evaluación no encontrada.',
        });
      }

      // Check if user is enrolled or admin
      if (req.user.role !== 'admin' && fullQuiz.course_id) {
        const isEnrolled = await enrollmentService.isEnrolled(req.user.id, fullQuiz.course_id);
        if (!isEnrolled) {
          return res.status(403).json({
            success: false,
            message: 'Debes estar inscrito en este curso para acceder a la evaluación.',
          });
        }
      }

      // Sanitize: never send is_correct to student
      const sanitizedQuiz = await quizService.getQuizById(req.params.id);
      res.json({
        success: true,
        data: sanitizedQuiz,
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/quizzes/:id/submit (Evaluates on server + anti-cheat)
  async submit(req, res, next) {
    try {
      const { id } = req.params;
      const { answers, courseId } = req.body;

      const result = await quizService.submitQuizAttempt(id, req.user.id, answers);

      // If passed and courseId provided, attempt automatic certificate issuance if all conditions are met
      let certificate = null;
      if (result.passed && courseId) {
        try {
          certificate = await certificateService.issueCertificate(req.user.id, courseId);
        } catch (certErr) {
          // If lessons are not yet 100% completed, certificate issuance waits until course is complete
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
