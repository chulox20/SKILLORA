import { courseService } from '../services/courseService.js';

export const courseController = {
  // GET /api/courses
  async getAll(req, res, next) {
    try {
      const { category, level, duration, sortBy, search, status } = req.query;
      const isAdmin = req.user?.role === 'admin';
      const courses = await courseService.getCourses({
        category,
        level,
        duration,
        sortBy,
        search,
        status: status || 'published',
        includeAllForAdmin: isAdmin,
      });
      res.json({
        success: true,
        data: courses,
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/courses/:slug
  async getBySlug(req, res, next) {
    try {
      const course = await courseService.getCourseBySlug(req.params.slug);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Curso no encontrado.',
        });
      }
      res.json({
        success: true,
        data: course,
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/courses (Admin only)
  async create(req, res, next) {
    try {
      const course = await courseService.createCourse(req.body);
      res.status(201).json({
        success: true,
        message: 'Curso creado exitosamente.',
        data: course,
      });
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/courses/:id (Admin only)
  async update(req, res, next) {
    try {
      const updated = await courseService.updateCourse(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Curso no encontrado para actualizar.',
        });
      }
      res.json({
        success: true,
        message: 'Curso actualizado exitosamente.',
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  },

  // DELETE /api/courses/:id (Admin only)
  async delete(req, res, next) {
    try {
      await courseService.deleteCourse(req.params.id);
      res.json({
        success: true,
        message: 'Curso eliminado exitosamente.',
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/courses/:id/duplicate (Admin only)
  async duplicate(req, res, next) {
    try {
      const copy = await courseService.duplicateCourse(req.params.id);
      res.status(201).json({
        success: true,
        message: 'Curso duplicado exitosamente.',
        data: copy,
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/courses/:id/modules (Save entire modules tree)
  async saveModules(req, res, next) {
    try {
      const { modules } = req.body;
      await courseService.saveCourseModules(req.params.id, modules || []);
      res.json({
        success: true,
        message: 'Temario del curso guardado exitosamente.',
      });
    } catch (err) {
      next(err);
    }
  },
};
