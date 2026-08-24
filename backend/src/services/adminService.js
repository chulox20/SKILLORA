import { query } from '../db/database.js';
import { courseService } from './courseService.js';

export const adminService = {
  // Get platform dashboard metrics
  async getDashboardStats() {
    const studentsRes = await query(`SELECT COUNT(*) FROM users WHERE role = 'student'`);
    const pubCoursesRes = await query(`SELECT COUNT(*) FROM courses WHERE status = 'published'`);
    const enrollmentsRes = await query(`SELECT COUNT(*) FROM enrollments`);
    const certsRes = await query(`SELECT COUNT(*) FROM certificates`);

    const totalStudents = parseInt(studentsRes.rows[0]?.count || 0, 10);
    const publishedCourses = parseInt(pubCoursesRes.rows[0]?.count || 0, 10);
    const totalEnrollments = parseInt(enrollmentsRes.rows[0]?.count || 0, 10);
    const completedCourses = parseInt(certsRes.rows[0]?.count || 0, 10);
    const totalCertificates = parseInt(certsRes.rows[0]?.count || 0, 10);

    const allCourses = await courseService.getCourses({ includeAllForAdmin: true });
    const coursesSummary = allCourses.map((c) => ({
      id: c.id,
      title: c.title,
      category: c.category_name,
      studentsCount: c.students_count || 0,
      status: c.status,
      rating: c.rating,
    }));

    return {
      totalStudents,
      publishedCourses,
      totalEnrollments,
      completedCourses,
      totalCertificates,
      coursesSummary,
    };
  },

  // Get Students List
  async getStudents() {
    const result = await query(
      `SELECT u.id, u.full_name, u.email, u.avatar_url, u.phone, u.bio, u.created_at,
              COUNT(DISTINCT e.id) AS enrolled_courses_count,
              COUNT(DISTINCT c.id) AS certificates_count
       FROM users u
       LEFT JOIN enrollments e ON e.user_id = u.id
       LEFT JOIN certificates c ON c.user_id = u.id
       WHERE u.role = 'student'
       GROUP BY u.id
       ORDER BY u.created_at DESC`
    );

    return result.rows.map((u) => ({
      ...u,
      enrolledCoursesCount: parseInt(u.enrolled_courses_count || 0, 10),
      certificatesCount: parseInt(u.certificates_count || 0, 10),
    }));
  },

  // Get single student detailed academic profile
  async getStudentAcademicProfile(studentId) {
    const userRes = await query(
      `SELECT id, full_name, email, avatar_url, phone, bio, created_at FROM users WHERE id = $1`,
      [studentId]
    );
    const student = userRes.rows[0];
    if (!student) return null;

    const certsRes = await query(
      `SELECT * FROM certificates WHERE user_id = $1 ORDER BY issued_at DESC`,
      [studentId]
    );

    const attemptsRes = await query(
      `SELECT a.*, q.title AS quiz_title
       FROM quiz_attempts a
       JOIN quizzes q ON q.id = a.quiz_id
       WHERE a.user_id = $1
       ORDER BY a.completed_at DESC`,
      [studentId]
    );

    const enrollmentsRes = await query(
      `SELECT e.*, c.title AS course_title
       FROM enrollments e
       JOIN courses c ON c.id = e.course_id
       WHERE e.user_id = $1`,
      [studentId]
    );

    return {
      ...student,
      enrolledCourses: enrollmentsRes.rows,
      certificates: certsRes.rows,
      attempts: attemptsRes.rows,
    };
  },
};
