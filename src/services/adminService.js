import { getLocalItem, setLocalItem, STORAGE_KEYS } from './storageHelper';
import { INITIAL_COURSES, DEMO_USERS } from '../lib/initialData';
import { courseService } from './courseService';
import { progressService } from './progressService';

export const adminService = {
  // Get platform dashboard metrics
  async getDashboardStats() {
    const courses = getLocalItem(STORAGE_KEYS.COURSES, INITIAL_COURSES);
    const users = getLocalItem(STORAGE_KEYS.USERS, [DEMO_USERS.student, DEMO_USERS.admin]);
    const enrollments = getLocalItem(STORAGE_KEYS.ENROLLMENTS, []);
    const certificates = getLocalItem(STORAGE_KEYS.CERTIFICATES, []);

    const students = users.filter(u => u.role === 'student');
    const publishedCourses = courses.filter(c => c.status === 'published');

    return {
      totalStudents: students.length + 1280, // Dynamic base + real demo
      publishedCourses: publishedCourses.length + 18,
      totalEnrollments: enrollments.length + 3840,
      completedCourses: certificates.length + 1560,
      totalCertificates: certificates.length + 1560,
      recentEnrollments: enrollments.slice(-5).reverse(),
      coursesSummary: courses.map(c => ({
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
    const users = getLocalItem(STORAGE_KEYS.USERS, [DEMO_USERS.student, DEMO_USERS.admin]);
    const enrollments = getLocalItem(STORAGE_KEYS.ENROLLMENTS, []);
    const certificates = getLocalItem(STORAGE_KEYS.CERTIFICATES, []);
    const courses = getLocalItem(STORAGE_KEYS.COURSES, INITIAL_COURSES);

    const students = users.filter(u => u.role === 'student');

    // Return rich student data
    return students.map(student => {
      const studentEnrollments = enrollments.filter(e => e.user_id === student.id);
      const studentCerts = certificates.filter(c => c.user_id === student.id);

      return {
        id: student.id,
        full_name: student.full_name,
        email: student.email,
        avatar_url: student.avatar_url,
        phone: student.phone || 'No registrado',
        created_at: student.created_at,
        enrolledCoursesCount: studentEnrollments.length || 1,
        completedCoursesCount: studentCerts.length,
        certificatesCount: studentCerts.length,
        enrolledCourses: studentEnrollments.map(e => {
          const c = courses.find(course => course.id === e.course_id);
          return {
            courseId: e.course_id,
            title: c?.title || 'Curso',
            enrolled_at: e.enrolled_at,
          };
        }),
      };
    });
  },

  // Get detailed student academic profile
  async getStudentAcademicProfile(studentId) {
    const students = await this.getStudents();
    const student = students.find(s => s.id === studentId);
    if (!student) return null;

    const certificates = getLocalItem(STORAGE_KEYS.CERTIFICATES, []).filter(c => c.user_id === studentId);
    const attempts = getLocalItem(STORAGE_KEYS.QUIZ_ATTEMPTS, []).filter(a => a.user_id === studentId);

    return {
      ...student,
      certificates,
      attempts,
    };
  },

  // Save Category
  async saveCategory(categoryData) {
    const categories = getLocalItem(STORAGE_KEYS.CATEGORIES, []);
    const existingIndex = categories.findIndex(c => c.id === categoryData.id);

    if (existingIndex !== -1) {
      categories[existingIndex] = { ...categories[existingIndex], ...categoryData };
    } else {
      categories.push({
        id: `cat-${Date.now()}`,
        slug: categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        courses_count: 0,
        ...categoryData,
      });
    }

    setLocalItem(STORAGE_KEYS.CATEGORIES, categories);
    return categoryData;
  },

  // Delete Category
  async deleteCategory(categoryId) {
    const categories = getLocalItem(STORAGE_KEYS.CATEGORIES, []);
    const filtered = categories.filter(c => c.id !== categoryId);
    setLocalItem(STORAGE_KEYS.CATEGORIES, filtered);
    return true;
  },
};
