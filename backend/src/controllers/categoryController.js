import { courseService } from '../services/courseService.js';

export const categoryController = {
  // GET /api/categories
  async getAll(req, res, next) {
    try {
      const categories = await courseService.getCategories();
      res.json({
        success: true,
        data: categories,
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/categories (Admin only)
  async save(req, res, next) {
    try {
      const category = await courseService.saveCategory(req.body);
      res.status(201).json({
        success: true,
        message: 'Categoría guardada exitosamente.',
        data: category,
      });
    } catch (err) {
      next(err);
    }
  },

  // DELETE /api/categories/:id (Admin only)
  async delete(req, res, next) {
    try {
      await courseService.deleteCategory(req.params.id);
      res.json({
        success: true,
        message: 'Categoría eliminada exitosamente.',
      });
    } catch (err) {
      next(err);
    }
  },
};
