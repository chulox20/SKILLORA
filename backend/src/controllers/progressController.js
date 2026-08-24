import { progressService } from '../services/progressService.js';
import { enrollmentService } from '../services/enrollmentService.js';
import { courseService } from '../services/courseService.js';

export const progressController = {
  // POST /api/lessons/:lessonId/complete
  async markComplete(req, res, next) {
    try {
      const { lessonId } = req.params;
      const { courseId } = req.body;

      // Optional enrollment verification
      if (courseId) {
        const isEnrolled = await enrollmentService.isEnrolled(req.user.id, courseId);
        if (!isEnrolled) {
          // Automatically auto-enroll or verify
          await enrollmentService.enroll(req.user.id, courseId);
        }
      }

      const progress = await progressService.markLessonComplete(req.user.id, lessonId);
      res.json({
        success: true,
        message: 'Lección marcada como completada.',
        data: progress,
      });
    } catch (err) {
      next(err);
    }
  },

  // DELETE /api/lessons/:lessonId/complete
  async unmarkComplete(req, res, next) {
    try {
      const { lessonId } = req.params;
      await progressService.unmarkLessonComplete(req.user.id, lessonId);
      res.json({
        success: true,
        message: 'Lección desmarcada.',
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/courses/:courseId/progress
  async getCourseProgress(req, res, next) {
    try {
      const { courseId } = req.params;
      const progress = await progressService.getCourseProgress(req.user.id, courseId);
      res.json({
        success: true,
        data: progress,
      });
    } catch (err) {
      next(err);
    }
  },
};
