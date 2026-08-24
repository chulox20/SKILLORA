import { adminService } from '../services/adminService.js';
import { courseService } from '../services/courseService.js';
import { quizService } from '../services/quizService.js';

export const adminController = {
  // GET /api/admin/dashboard
  async getDashboard(req, res, next) {
    try {
      const stats = await adminService.getDashboardStats();
      res.json({
        success: true,
        data: stats,
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/admin/students
  async getStudents(req, res, next) {
    try {
      const students = await adminService.getStudents();
      res.json({
        success: true,
        data: students,
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/admin/students/:id
  async getStudentDetails(req, res, next) {
    try {
      const student = await adminService.getStudentAcademicProfile(req.params.id);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Estudiante no encontrado.',
        });
      }
      res.json({
        success: true,
        data: student,
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/admin/courses
  async getCourses(req, res, next) {
    try {
      const courses = await courseService.getCourses({ includeAllForAdmin: true });
      res.json({
        success: true,
        data: courses,
      });
    } catch (err) {
      next(err);
    }
  },
};
