import { pool, isDbConnected } from '../db/database.js';

// In-Memory store for fallback
let inMemoryCategories = [];
let inMemoryCourses = [];

export const courseService = {
  // Get Categories
  async getCategories() {
    if (isDbConnected()) {
      const result = await pool.query(`SELECT * FROM categories ORDER BY name ASC`);
      return result.rows;
    }
    return inMemoryCategories;
  },

  // Save Category
  async saveCategory({ id, name, slug, description, image_url, icon }) {
    const catId = id || `cat-${Date.now()}`;
    const catSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (isDbConnected()) {
      const result = await pool.query(
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
    }

    const existingIdx = inMemoryCategories.findIndex((c) => c.id === catId);
    const category = { id: catId, name, slug: catSlug, description, image_url, icon };
    if (existingIdx !== -1) {
      inMemoryCategories[existingIdx] = category;
    } else {
      inMemoryCategories.push(category);
    }
    return category;
  },

  // Delete Category
  async deleteCategory(id) {
    if (isDbConnected()) {
      await pool.query(`DELETE FROM categories WHERE id = $1`, [id]);
      return true;
    }
    inMemoryCategories = inMemoryCategories.filter((c) => c.id !== id);
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
    let courses = [];

    if (isDbConnected()) {
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

      if (search.trim()) {
        params.push(`%${search.toLowerCase().trim()}%`);
        queryText += ` AND (LOWER(title) LIKE $${params.length} OR LOWER(description) LIKE $${params.length} OR LOWER(short_description) LIKE $${params.length})`;
      }

      if (sortBy === 'popular') queryText += ` ORDER BY students_count DESC`;
      else if (sortBy === 'rating') queryText += ` ORDER BY rating DESC`;
      else if (sortBy === 'newest') queryText += ` ORDER BY created_at DESC`;

      const result = await pool.query(queryText, params);
      courses = result.rows;
    } else {
      courses = [...inMemoryCourses];
      if (!includeAllForAdmin) {
        courses = courses.filter((c) => c.status === status);
      }
      if (category && category !== 'all') {
        courses = courses.filter(
          (c) =>
            c.category_id === category ||
            c.category_name?.toLowerCase().includes(category.toLowerCase()) ||
            c.slug?.toLowerCase().includes(category.toLowerCase())
        );
      }
      if (level && level !== 'all') {
        courses = courses.filter((c) => c.level?.toLowerCase() === level.toLowerCase());
      }
      if (duration && duration !== 'all') {
        courses = courses.filter((c) => {
          const hrs = parseInt(c.duration) || 0;
          if (duration === 'short') return hrs < 2;
          if (duration === 'medium') return hrs >= 2 && hrs <= 5;
          if (duration === 'long') return hrs > 5;
          return true;
        });
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        courses = courses.filter(
          (c) =>
            c.title?.toLowerCase().includes(q) ||
            c.description?.toLowerCase().includes(q) ||
            c.short_description?.toLowerCase().includes(q)
        );
      }
      courses.sort((a, b) => {
        if (sortBy === 'popular') return (b.students_count || 0) - (a.students_count || 0);
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'newest') return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        return 0;
      });
    }

    return courses;
  },

  // Get Course by Slug or ID (with modules & lessons)
  async getCourseBySlug(slug) {
    if (isDbConnected()) {
      const courseRes = await pool.query(
        `SELECT * FROM courses WHERE slug = $1 OR id = $1`,
        [slug]
      );
      const course = courseRes.rows[0];
      if (!course) return null;

      // Fetch modules and lessons
      const modulesRes = await pool.query(
        `SELECT * FROM course_modules WHERE course_id = $1 ORDER BY order_index ASC`,
        [course.id]
      );
      const modules = modulesRes.rows;

      for (const mod of modules) {
        const lessonsRes = await pool.query(
          `SELECT * FROM lessons WHERE module_id = $1 ORDER BY order_index ASC`,
          [mod.id]
        );
        mod.lessons = lessonsRes.rows;
      }

      course.modules = modules;
      return course;
    }

    return (
      inMemoryCourses.find((c) => c.slug === slug || c.id === slug) || null
    );
  },

  // Create Course
  async createCourse(courseData) {
    const id = `course-${Date.now()}`;
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
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isDbConnected()) {
      await pool.query(
        `INSERT INTO courses (id, category_id, category_name, title, slug, short_description, description, thumbnail_url, level, duration, rating, reviews_count, students_count, status, objectives, requirements, instructor)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
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
    }

    inMemoryCourses.unshift(newCourse);
    return newCourse;
  },

  // Update Course
  async updateCourse(id, courseData) {
    if (isDbConnected()) {
      await pool.query(
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
             objectives = COALESCE($11, objectives),
             requirements = COALESCE($12, requirements),
             updated_at = NOW()
         WHERE id = $13`,
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
    }

    const idx = inMemoryCourses.findIndex((c) => c.id === id);
    if (idx !== -1) {
      inMemoryCourses[idx] = {
        ...inMemoryCourses[idx],
        ...courseData,
        updated_at: new Date().toISOString(),
      };
      return inMemoryCourses[idx];
    }
    return null;
  },

  // Delete Course
  async deleteCourse(id) {
    if (isDbConnected()) {
      await pool.query(`DELETE FROM courses WHERE id = $1`, [id]);
    }
    inMemoryCourses = inMemoryCourses.filter((c) => c.id !== id);
    return true;
  },

  // Duplicate Course
  async duplicateCourse(id) {
    const original = await this.getCourseBySlug(id);
    if (!original) return null;

    const copy = {
      ...original,
      id: `course-${Date.now()}`,
      title: `${original.title} (Copia)`,
      slug: `${original.slug}-copia-${Math.floor(Math.random() * 1000)}`,
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

    if (isDbConnected()) {
      // Clear old modules & reinsert
      await pool.query(`DELETE FROM course_modules WHERE course_id = $1`, [courseId]);
      for (const [mIdx, mod] of modules.entries()) {
        const modId = mod.id || `mod-${Date.now()}-${mIdx}`;
        await pool.query(
          `INSERT INTO course_modules (id, course_id, title, description, order_index)
           VALUES ($1, $2, $3, $4, $5)`,
          [modId, courseId, mod.title, mod.description || '', mIdx + 1]
        );

        for (const [lIdx, les] of (mod.lessons || []).entries()) {
          const lesId = les.id || `les-${Date.now()}-${lIdx}`;
          await pool.query(
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
    }

    const idx = inMemoryCourses.findIndex((c) => c.id === courseId || c.slug === courseId);
    if (idx !== -1) {
      inMemoryCourses[idx].modules = modules;
    }
    return true;
  },

  // Seed Helpers
  seedCategory(category) {
    const idx = inMemoryCategories.findIndex((c) => c.id === category.id);
    if (idx !== -1) inMemoryCategories[idx] = category;
    else inMemoryCategories.push(category);
  },

  seedCourse(course) {
    const idx = inMemoryCourses.findIndex((c) => c.id === course.id);
    if (idx !== -1) inMemoryCourses[idx] = course;
    else inMemoryCourses.push(course);
  },
};
