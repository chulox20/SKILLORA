import crypto from 'crypto';
import { query } from '../db/database.js';

export const courseService = {
  // Get Categories
  async getCategories() {
    const result = await query(`SELECT * FROM categories ORDER BY name ASC`);
    return result.rows;
  },

  // Save Category
  async saveCategory({ id, name, slug, description, image_url, icon }) {
    const catId = id || `cat-${crypto.randomUUID().split('-')[0]}`;
    const catSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const result = await query(
      `INSERT INTO categories (id, name, slug, description, image_url, icon)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO UPDATE
       SET name = EXCLUDED.name,
           slug = EXCLUDED.slug,
           description = EXCLUDED.description,
           image_url = EXCLUDED.image_url,
           icon = EXCLUDED.icon
       RETURNING *`,
      [catId, name, catSlug, description, image_url, icon]
    );
    return result.rows[0];
  },

  // Delete Category
  async deleteCategory(id) {
    await query(`DELETE FROM categories WHERE id = $1`, [id]);
    return true;
  },

  // Get Courses with filters
  async getCourses({
    category = 'all',
    level = 'all',
    duration = 'all',
    sortBy = 'popular',
    search = '',
    status = 'published',
    includeAllForAdmin = false,
  } = {}) {
    let queryText = `SELECT * FROM courses WHERE 1=1`;
    const params = [];

    if (!includeAllForAdmin) {
      params.push(status);
      queryText += ` AND status = $${params.length}`;
    }

    if (category && category !== 'all') {
      params.push(category);
      queryText += ` AND (category_id = $${params.length} OR LOWER(category_name) LIKE LOWER($${params.length}) OR LOWER(slug) LIKE LOWER($${params.length}))`;
    }

    if (level && level !== 'all') {
      params.push(level);
      queryText += ` AND LOWER(level) = LOWER($${params.length})`;
    }

    if (search && search.trim()) {
      params.push(`%${search.toLowerCase().trim()}%`);
      queryText += ` AND (LOWER(title) LIKE $${params.length} OR LOWER(description) LIKE $${params.length} OR LOWER(short_description) LIKE $${params.length})`;
    }

    if (sortBy === 'popular') queryText += ` ORDER BY students_count DESC`;
    else if (sortBy === 'rating') queryText += ` ORDER BY rating DESC`;
    else if (sortBy === 'newest') queryText += ` ORDER BY created_at DESC`;
    else queryText += ` ORDER BY created_at DESC`;

    const result = await query(queryText, params);
    return result.rows;
  },

  // Get Course by Slug or ID (with modules & lessons)
  async getCourseBySlug(slug) {
    const courseRes = await query(
      `SELECT * FROM courses WHERE slug = $1 OR id = $1`,
      [slug]
    );
    const course = courseRes.rows[0];
    if (!course) return null;

    // Fetch modules
    const modulesRes = await query(
      `SELECT * FROM course_modules WHERE course_id = $1 ORDER BY order_index ASC`,
      [course.id]
    );
    const modules = modulesRes.rows;

    for (const mod of modules) {
      const lessonsRes = await query(
        `SELECT * FROM lessons WHERE module_id = $1 ORDER BY order_index ASC`,
        [mod.id]
      );
      mod.lessons = lessonsRes.rows;
    }

    course.modules = modules;
    return course;
  },

  // Create Course
  async createCourse(courseData) {
    const id = `course-${crypto.randomUUID()}`;
    const slug =
      courseData.slug ||
      courseData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newCourse = {
      id,
      category_id: courseData.categoryId || courseData.category_id || 'cat-1',
      category_name: courseData.categoryName || courseData.category_name || 'Desarrollo',
      title: courseData.title,
      slug,
      short_description: courseData.shortDescription || courseData.short_description || '',
      description: courseData.description || '',
      thumbnail_url:
        courseData.thumbnailUrl ||
        courseData.thumbnail_url ||
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
      level: courseData.level || 'beginner',
      duration: courseData.duration || '4h 00m',
      rating: 5.0,
      reviews_count: 0,
      students_count: 0,
      status: courseData.status || 'draft',
      objectives: courseData.objectives || ['Aprender conceptos clave', 'Construir proyectos'],
      requirements: courseData.requirements || ['Sin requisitos previos'],
      instructor: courseData.instructor || {
        name: 'Profesor Skillora',
        role: 'Senior Instructor',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      },
      modules: courseData.modules || [],
    };

    const result = await query(
      `INSERT INTO courses (id, category_id, category_name, title, slug, short_description, description, thumbnail_url, level, duration, rating, reviews_count, students_count, status, objectives, requirements, instructor)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
       RETURNING *`,
      [
        newCourse.id,
        newCourse.category_id,
        newCourse.category_name,
        newCourse.title,
        newCourse.slug,
        newCourse.short_description,
        newCourse.description,
        newCourse.thumbnail_url,
        newCourse.level,
        newCourse.duration,
        newCourse.rating,
        newCourse.reviews_count,
        newCourse.students_count,
        newCourse.status,
        JSON.stringify(newCourse.objectives),
        JSON.stringify(newCourse.requirements),
        JSON.stringify(newCourse.instructor),
      ]
    );

    return result.rows[0] || newCourse;
  },

  // Update Course
  async updateCourse(id, courseData) {
    const result = await query(
      `UPDATE courses
       SET title = COALESCE($1, title),
           slug = COALESCE($2, slug),
           category_id = COALESCE($3, category_id),
           category_name = COALESCE($4, category_name),
           short_description = COALESCE($5, short_description),
           description = COALESCE($6, description),
           thumbnail_url = COALESCE($7, thumbnail_url),
           level = COALESCE($8, level),
           duration = COALESCE($9, duration),
           status = COALESCE($10, status),
           objectives = CASE WHEN $11::text IS NOT NULL THEN $11::jsonb ELSE objectives END,
           requirements = CASE WHEN $12::text IS NOT NULL THEN $12::jsonb ELSE requirements END,
           updated_at = NOW()
       WHERE id = $13
       RETURNING *`,
      [
        courseData.title,
        courseData.slug,
        courseData.categoryId || courseData.category_id,
        courseData.categoryName || courseData.category_name,
        courseData.shortDescription || courseData.short_description,
        courseData.description,
        courseData.thumbnailUrl || courseData.thumbnail_url,
        courseData.level,
        courseData.duration,
        courseData.status,
        courseData.objectives ? JSON.stringify(courseData.objectives) : null,
        courseData.requirements ? JSON.stringify(courseData.requirements) : null,
        id,
      ]
    );
    return result.rows[0] || null;
  },

  // Delete Course
  async deleteCourse(id) {
    await query(`DELETE FROM courses WHERE id = $1`, [id]);
    return true;
  },

  // Duplicate Course
  async duplicateCourse(id) {
    const original = await this.getCourseBySlug(id);
    if (!original) return null;

    const copy = {
      ...original,
      id: `course-${crypto.randomUUID()}`,
      title: `${original.title} (Copia)`,
      slug: `${original.slug}-copia-${crypto.randomUUID().split('-')[0]}`,
      status: 'draft',
      students_count: 0,
      reviews_count: 0,
    };

    return this.createCourse(copy);
  },

  // Save Modules & Lessons tree
  async saveCourseModules(courseId, modules) {
    const course = await this.getCourseBySlug(courseId);
    if (!course) return false;

    // Clear old modules & reinsert
    await query(`DELETE FROM course_modules WHERE course_id = $1`, [course.id]);
    for (const [mIdx, mod] of modules.entries()) {
      const modId = mod.id || `mod-${crypto.randomUUID()}`;
      await query(
        `INSERT INTO course_modules (id, course_id, title, description, order_index)
         VALUES ($1, $2, $3, $4, $5)`,
        [modId, course.id, mod.title, mod.description || '', mIdx + 1]
      );

      for (const [lIdx, les] of (mod.lessons || []).entries()) {
        const lesId = les.id || `les-${crypto.randomUUID()}`;
        await query(
          `INSERT INTO lessons (id, module_id, title, slug, description, type, content, video_url, duration, order_index, quiz_id)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
          [
            lesId,
            modId,
            les.title,
            les.slug || les.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            les.description || '',
            les.type || 'video',
            les.content || '',
            les.video_url || '',
            les.duration || '15 min',
            lIdx + 1,
            les.quiz_id || null,
          ]
        );
      }
    }

    return true;
  },
};
