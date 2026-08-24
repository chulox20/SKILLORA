import { apiClient } from './apiClient';
import { getLocalItem, setLocalItem, STORAGE_KEYS } from './storageHelper';
import { INITIAL_USERS, INITIAL_CATEGORIES } from '../lib/initialData';
import { courseService } from './courseService';

export const adminService = {
  // Get dashboard metrics
  async getDashboardStats() {
    try {
      const response = await apiClient.get('/admin/dashboard');
      if (response.data) return response.data;
    } catch (err) {
      console.warn('API getDashboardStats error, using local fallback:', err.message);
    }

    const courses = await courseService.getCourses({ includeAllForAdmin: true });
    return {
      totalStudents: 1284,
      publishedCourses: courses.filter((c) => c.status === 'published').length || 24,
      totalEnrollments: 3842,
      completedCourses: 1562,
      totalCertificates: 1562,
      coursesSummary: courses.map((c) => ({
        id: c.id,
        title: c.title,
        category: c.category_name,
        studentsCount: c.students_count || 0,
        status: c.status,
        rating: c.rating,
      })),
    };
  },

  // Get Students List
  async getStudents() {
    try {
      const response = await apiClient.get('/admin/students');
      if (response.data) return response.data;
    } catch (err) {
      console.warn('API getStudents error, using local fallback:', err.message);
    }

    const users = getLocalItem(STORAGE_KEYS.USERS, INITIAL_USERS);
    const students = users.filter((u) => u.role === 'student');

    return students.map((st) => ({
      ...st,
      enrolledCoursesCount: 1,
      completedCoursesCount: 1,
      certificatesCount: 1,
      enrolledCourses: [
        {
          courseId: 'course-1',
          title: 'React desde cero',
          progress: 100,
          completed: true,
          enrolled_at: '2026-02-01T10:00:00Z',
        },
      ],
    }));
  },

  // Get Single Student detailed profile
  async getStudentAcademicProfile(studentId) {
    try {
      const response = await apiClient.get(`/admin/students/${studentId}`);
      if (response.data) return response.data;
    } catch (err) {
      console.warn('API getStudentAcademicProfile error, using local fallback:', err.message);
    }

    const students = await this.getStudents();
    const student = students.find((s) => s.id === studentId) || students[0];

    return {
      ...student,
      certificates: [
        {
          id: 'cert-1',
          course_title: 'REACT DESDE CERO',
          certificate_code: 'SKL-2026-00042',
          issued_at: '2026-08-23T18:00:00Z',
        },
      ],
      attempts: [
        {
          id: 'att-1',
          quiz_title: 'Evaluación de Certificación: React desde Cero',
          score: 80,
          passed: true,
          completed_at: '2026-08-23T17:55:00Z',
        },
      ],
    };
  },

  // Save Category
  async saveCategory(catData) {
    try {
      const response = await apiClient.post('/categories', catData);
      if (response.data) return response.data;
    } catch (err) {
      console.warn('API saveCategory error, using local fallback:', err.message);
    }

    const categories = getLocalItem(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    const id = catData.id || `cat-${Date.now()}`;
    const slug = catData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newCat = { ...catData, id, slug };

    const idx = categories.findIndex((c) => c.id === id);
    if (idx !== -1) categories[idx] = newCat;
    else categories.push(newCat);

    setLocalItem(STORAGE_KEYS.CATEGORIES, categories);
    return newCat;
  },

  // Delete Category
  async deleteCategory(id) {
    try {
      await apiClient.delete(`/categories/${id}`);
    } catch (err) {
      console.warn('API deleteCategory error, using local fallback:', err.message);
    }

    const categories = getLocalItem(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    const filtered = categories.filter((c) => c.id !== id);
    setLocalItem(STORAGE_KEYS.CATEGORIES, filtered);
    return true;
  },
};
