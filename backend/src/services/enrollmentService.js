import { pool, isDbConnected } from '../db/database.js';
import { courseService } from './courseService.js';
import { progressService } from './progressService.js';

let inMemoryEnrollments = [];

export const enrollmentService = {
  // Enroll user in course (unique user_id + course_id)
  async enroll(userId, courseId) {
    // Check if already enrolled
    const alreadyEnrolled = await this.isEnrolled(userId, courseId);
    if (alreadyEnrolled) {
      return alreadyEnrolled;
    }

    const id = `enr-${Date.now()}`;
    const enrolledAt = new Date().toISOString();

    if (isDbConnected()) {
      const result = await pool.query(
        `INSERT INTO enrollments (id, user_id, course_id, status, enrolled_at)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (user_id, course_id) DO UPDATE SET status = 'active'
         RETURNING *`,
        [id, userId, courseId, 'active', enrolledAt]
      );

      // Increment student count
      await pool.query(`UPDATE courses SET students_count = students_count + 1 WHERE id = $1`, [
        courseId,
      ]);

      return result.rows[0];
    }

    const newEnrollment = {
      id,
      user_id: userId,
      course_id: courseId,
      status: 'active',
      enrolled_at: enrolledAt,
      completed_at: null,
    };
    inMemoryEnrollments.push(newEnrollment);

    // Increment in-memory student count
    const course = await courseService.getCourseBySlug(courseId);
    if (course) {
      course.students_count = (course.students_count || 0) + 1;
    }

    return newEnrollment;
  },

  // Check if user is enrolled
  async isEnrolled(userId, courseId) {
    if (!userId || !courseId) return false;

    if (isDbConnected()) {
      const result = await pool.query(
        `SELECT * FROM enrollments WHERE user_id = $1 AND course_id = $2`,
        [userId, courseId]
      );
      return result.rows[0] || null;
    }

    return (
      inMemoryEnrollments.find(
        (e) => e.user_id === userId && (e.course_id === courseId || e.course_id === courseId)
      ) || null
    );
  },

  // Get enrolled courses with progress for user
  async getUserEnrolledCourses(userId) {
    let enrollments = [];

    if (isDbConnected()) {
      const result = await pool.query(
        `SELECT * FROM enrollments WHERE user_id = $1 ORDER BY enrolled_at DESC`,
        [userId]
      );
      enrollments = result.rows;
    } else {
      enrollments = inMemoryEnrollments.filter((e) => e.user_id === userId);
    }

    const allCourses = await courseService.getCourses({ includeAllForAdmin: true });
    const enriched = [];

    for (const enrollment of enrollments) {
      const course = allCourses.find((c) => c.id === enrollment.course_id);
      if (course) {
        const progressStats = await progressService.getCourseProgress(userId, course.id);
        enriched.push({
          ...course,
          enrollment,
          progress: progressStats.percentage,
          completedLessonsCount: progressStats.completedLessonsCount,
          totalLessonsCount: progressStats.totalLessonsCount,
          isCompleted: progressStats.percentage === 100,
          lastLesson: progressStats.lastLesson,
        });
      }
    }

    return enriched;
  },

  seedEnrollment(enrollment) {
    const idx = inMemoryEnrollments.findIndex(
      (e) => e.user_id === enrollment.user_id && e.course_id === enrollment.course_id
    );
    if (idx !== -1) inMemoryEnrollments[idx] = enrollment;
    else inMemoryEnrollments.push(enrollment);
  },
};
