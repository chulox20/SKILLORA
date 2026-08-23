import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getLocalItem, setLocalItem, STORAGE_KEYS } from './storageHelper';
import { INITIAL_COURSES, INITIAL_CATEGORIES } from '../lib/initialData';

export const courseService = {
  // Get all categories
  async getCategories() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (!error && data && data.length > 0) return data;
    }
    return getLocalItem(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  },

  // Get courses with flexible filtering
  async getCourses({
    category = 'all',
    level = 'all',
    duration = 'all',
    sortBy = 'popular',
    search = '',
    status = 'published',
    includeAllForAdmin = false,
  } = {}) {
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('courses').select(`
          *,
          category:categories(name, slug),
          course_modules(
            id, title, order_index,
            lessons(id, title, duration, type, order_index)
          )
        `);

        if (!includeAllForAdmin) {
          query = query.eq('status', status);
        }

        const { data, error } = await query;
        if (!error && data) {
          return data;
        }
      } catch (err) {
        console.error('Supabase getCourses error:', err);
      }
    }

    // LocalStorage fallback
    let courses = getLocalItem(STORAGE_KEYS.COURSES, INITIAL_COURSES);

    if (!includeAllForAdmin) {
      courses = courses.filter(c => c.status === status);
    }

    // Filter by Category
    if (category && category !== 'all') {
      courses = courses.filter(c => {
        const catSlug = c.category_slug || c.slug;
        return (
          c.category_id === category ||
          catSlug?.toLowerCase() === category.toLowerCase() ||
          c.category_name?.toLowerCase().includes(category.toLowerCase())
        );
      });
    }

    // Filter by Level
    if (level && level !== 'all') {
      courses = courses.filter(c => c.level?.toLowerCase() === level.toLowerCase());
    }

    // Filter by Duration
    if (duration && duration !== 'all') {
      courses = courses.filter(c => {
        const durHours = parseInt(c.duration) || 0;
        if (duration === 'short') return durHours < 2;
        if (duration === 'medium') return durHours >= 2 && durHours <= 5;
        if (duration === 'long') return durHours > 5;
        return true;
      });
    }

    // Filter by Search Query
    if (search.trim()) {
      const q = search.toLowerCase();
      courses = courses.filter(
        c =>
          c.title?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q) ||
          c.short_description?.toLowerCase().includes(q) ||
          c.category_name?.toLowerCase().includes(q)
      );
    }

    // Sorting
    courses = [...courses].sort((a, b) => {
      if (sortBy === 'popular') return (b.students_count || 0) - (a.students_count || 0);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'newest') return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      return 0;
    });

    return courses;
  },

  // Get course by slug
  async getCourseBySlug(slug) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select(`
            *,
            category:categories(*),
            course_modules(
              *,
              lessons(*)
            )
          `)
          .eq('slug', slug)
          .single();

        if (!error && data) return data;
      } catch (err) {
        console.error('Supabase getCourseBySlug error:', err);
      }
    }

    const courses = getLocalItem(STORAGE_KEYS.COURSES, INITIAL_COURSES);
    return courses.find(c => c.slug === slug || c.id === slug) || null;
  },

  // Get course by ID
  async getCourseById(id) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select(`
            *,
            category:categories(*),
            course_modules(
              *,
              lessons(*)
            )
          `)
          .eq('id', id)
          .single();

        if (!error && data) return data;
      } catch (err) {
        console.error('Supabase getCourseById error:', err);
      }
    }

    const courses = getLocalItem(STORAGE_KEYS.COURSES, INITIAL_COURSES);
    return courses.find(c => c.id === id) || null;
  },

  // Admin: Create Course
  async createCourse(courseData) {
    const slug = courseData.slug || courseData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newCourse = {
      id: `course-${Date.now()}`,
      title: courseData.title,
      slug,
      category_id: courseData.category_id || 'cat-1',
      category_name: courseData.category_name || 'Desarrollo Web',
      short_description: courseData.short_description || '',
      description: courseData.description || '',
      thumbnail_url: courseData.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
      level: courseData.level || 'beginner',
      duration: courseData.duration || '2h 00m',
      rating: 5.0,
      reviews_count: 0,
      students_count: 0,
      status: courseData.status || 'draft',
      objectives: courseData.objectives || ['Aprender conceptos fundamentales', 'Desarrollar proyectos prácticos'],
      requirements: courseData.requirements || ['Sin requisitos previos'],
      instructor: courseData.instructor || {
        name: 'Administrador Skillora',
        role: 'Profesor Principal',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      },
      modules: courseData.modules || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('courses').insert(newCourse).select().single();
        if (!error && data) return data;
      } catch (err) {
        console.error('Supabase createCourse error:', err);
      }
    }

    const courses = getLocalItem(STORAGE_KEYS.COURSES, INITIAL_COURSES);
    courses.unshift(newCourse);
    setLocalItem(STORAGE_KEYS.COURSES, courses);
    return newCourse;
  },

  // Admin: Update Course
  async updateCourse(courseId, courseData) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('courses')
          .update({ ...courseData, updated_at: new Date().toISOString() })
          .eq('id', courseId)
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.error('Supabase updateCourse error:', err);
      }
    }

    const courses = getLocalItem(STORAGE_KEYS.COURSES, INITIAL_COURSES);
    const index = courses.findIndex(c => c.id === courseId);
    if (index !== -1) {
      courses[index] = {
        ...courses[index],
        ...courseData,
        updated_at: new Date().toISOString(),
      };
      setLocalItem(STORAGE_KEYS.COURSES, courses);
      return courses[index];
    }
    return null;
  },

  // Admin: Delete Course
  async deleteCourse(courseId) {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('courses').delete().eq('id', courseId);
      } catch (err) {
        console.error('Supabase deleteCourse error:', err);
      }
    }

    const courses = getLocalItem(STORAGE_KEYS.COURSES, INITIAL_COURSES);
    const filtered = courses.filter(c => c.id !== courseId);
    setLocalItem(STORAGE_KEYS.COURSES, filtered);
    return true;
  },

  // Admin: Duplicate Course
  async duplicateCourse(courseId) {
    const original = await this.getCourseById(courseId);
    if (!original) return null;

    const duplicatedData = {
      ...original,
      id: `course-${Date.now()}`,
      title: `${original.title} (Copia)`,
      slug: `${original.slug}-copia-${Math.floor(Math.random() * 1000)}`,
      status: 'draft',
      students_count: 0,
      reviews_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return this.createCourse(duplicatedData);
  },

  // Module & Lesson Operations
  async saveCourseModules(courseId, modules) {
    const course = await this.getCourseById(courseId);
    if (!course) return false;

    return this.updateCourse(courseId, { modules });
  },
};
