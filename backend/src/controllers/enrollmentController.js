import { enrollmentService } from '../services/enrollmentService.js';

export const enrollmentController = {
  // POST /api/courses/:courseId/enroll
  async enroll(req, res, next) {
    try {
      const { courseId } = req.params;
      const enrollment = await enrollmentService.enroll(req.user.id, courseId);
      res.status(201).json({
        success: true,
        message: 'Inscripción realizada exitosamente.',
        data: enrollment,
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/me/courses
  async getMyCourses(req, res, next) {
    try {
      const courses = await enrollmentService.getUserEnrolledCourses(req.user.id);
      res.json({
        success: true,
        data: courses,
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/me/courses/:courseId
  async checkEnrollment(req, res, next) {
    try {
      const isEnrolled = await enrollmentService.isEnrolled(req.user.id, req.params.courseId);
      res.json({
        success: true,
        data: { isEnrolled: Boolean(isEnrolled) },
      });
    } catch (err) {
      next(err);
    }
  },
};
