import { apiClient } from './apiClient';
import { getLocalItem, setLocalItem, STORAGE_KEYS } from './storageHelper';
import { INITIAL_COURSES, INITIAL_CATEGORIES } from '../lib/initialData';

export const courseService = {
  // Get all categories
  async getCategories() {
    try {
      const response = await apiClient.get('/categories');
      if (response.data && response.data.length > 0) {
        setLocalItem(STORAGE_KEYS.CATEGORIES, response.data);
        return response.data;
      }
    } catch (err) {
      console.warn('API getCategories error, using local fallback:', err.message);
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
    try {
      const response = await apiClient.get('/courses', {
        category,
        level,
        duration,
        sortBy,
        search,
        status: includeAllForAdmin ? undefined : status,
      });
      if (response.data) {
        return response.data;
      }
    } catch (err) {
      console.warn('API getCourses error, using local fallback:', err.message);
    }

    // Local fallback
    let courses = getLocalItem(STORAGE_KEYS.COURSES, INITIAL_COURSES);

    if (!includeAllForAdmin) {
      courses = courses.filter((c) => c.status === status);
    }

    if (category && category !== 'all') {
      courses = courses.filter((c) => {
        const catSlug = c.category_slug || c.slug;
        return (
          c.category_id === category ||
          catSlug?.toLowerCase() === category.toLowerCase() ||
          c.category_name?.toLowerCase().includes(category.toLowerCase())
        );
      });
    }

    if (level && level !== 'all') {
      courses = courses.filter((c) => c.level?.toLowerCase() === level.toLowerCase());
    }

    if (duration && duration !== 'all') {
      courses = courses.filter((c) => {
        const durHours = parseInt(c.duration) || 0;
        if (duration === 'short') return durHours < 2;
        if (duration === 'medium') return durHours >= 2 && durHours <= 5;
        if (duration === 'long') return durHours > 5;
        return true;
      });
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      courses = courses.filter(
        (c) =>
          c.title?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q) ||
          c.short_description?.toLowerCase().includes(q) ||
          c.category_name?.toLowerCase().includes(q)
      );
    }

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
    try {
      const response = await apiClient.get(`/courses/${slug}`);
      if (response.data) return response.data;
    } catch (err) {
      console.warn('API getCourseBySlug error, using local fallback:', err.message);
    }

    const courses = getLocalItem(STORAGE_KEYS.COURSES, INITIAL_COURSES);
    return courses.find((c) => c.slug === slug || c.id === slug) || null;
  },

  // Get course by ID
  async getCourseById(id) {
    return this.getCourseBySlug(id);
  },

  // Admin: Create Course
  async createCourse(courseData) {
    try {
      const response = await apiClient.post('/courses', courseData);
      if (response.data) return response.data;
    } catch (err) {
      console.warn('API createCourse error, using local fallback:', err.message);
    }

    const slug =
      courseData.slug ||
      courseData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newCourse = {
      id: `course-${Date.now()}`,
      ...courseData,
      slug,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const courses = getLocalItem(STORAGE_KEYS.COURSES, INITIAL_COURSES);
    courses.unshift(newCourse);
    setLocalItem(STORAGE_KEYS.COURSES, courses);
    return newCourse;
  },

  // Admin: Update Course
  async updateCourse(courseId, courseData) {
    try {
      const response = await apiClient.put(`/courses/${courseId}`, courseData);
      if (response.data) return response.data;
    } catch (err) {
      console.warn('API updateCourse error, using local fallback:', err.message);
    }

    const courses = getLocalItem(STORAGE_KEYS.COURSES, INITIAL_COURSES);
    const index = courses.findIndex((c) => c.id === courseId);
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
    try {
      await apiClient.delete(`/courses/${courseId}`);
    } catch (err) {
      console.warn('API deleteCourse error, using local fallback:', err.message);
    }

    const courses = getLocalItem(STORAGE_KEYS.COURSES, INITIAL_COURSES);
    const filtered = courses.filter((c) => c.id !== courseId);
    setLocalItem(STORAGE_KEYS.COURSES, filtered);
    return true;
  },

  // Admin: Duplicate Course
  async duplicateCourse(courseId) {
    try {
      const response = await apiClient.post(`/courses/${courseId}/duplicate`);
      if (response.data) return response.data;
    } catch (err) {
      console.warn('API duplicateCourse error, using local fallback:', err.message);
    }

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
    };

    return this.createCourse(duplicatedData);
  },

  // Module & Lesson Operations
  async saveCourseModules(courseId, modules) {
    try {
      await apiClient.post(`/courses/${courseId}/modules`, { modules });
    } catch (err) {
      console.warn('API saveCourseModules error, using local fallback:', err.message);
    }

    return this.updateCourse(courseId, { modules });
  },
};
