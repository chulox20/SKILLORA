import crypto from 'crypto';
import { query } from '../db/database.js';
import { courseService } from './courseService.js';
import { progressService } from './progressService.js';

export const enrollmentService = {
  // Enroll user in course (unique user_id + course_id)
  async enroll(userId, courseId) {
    const alreadyEnrolled = await this.isEnrolled(userId, courseId);
    if (alreadyEnrolled) {
      return alreadyEnrolled;
    }

    const id = `enr-${crypto.randomUUID()}`;
    const enrolledAt = new Date().toISOString();

    const result = await query(
      `INSERT INTO enrollments (id, user_id, course_id, status, enrolled_at)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, course_id) DO UPDATE SET status = 'active'
       RETURNING *`,
      [id, userId, courseId, 'active', enrolledAt]
    );

    // Increment student count in courses table
    await query(`UPDATE courses SET students_count = students_count + 1 WHERE id = $1`, [
      courseId,
    ]);

    return result.rows[0];
  },

  // Check if user is enrolled
  async isEnrolled(userId, courseId) {
    if (!userId || !courseId) return null;

    const result = await query(
      `SELECT * FROM enrollments WHERE user_id = $1 AND course_id = $2`,
      [userId, courseId]
    );
    return result.rows[0] || null;
  },

  // Get enrolled courses with progress for user
  async getUserEnrolledCourses(userId) {
    const result = await query(
      `SELECT e.*, c.title, c.slug, c.category_name, c.thumbnail_url, c.level, c.duration, c.rating
       FROM enrollments e
       JOIN courses c ON c.id = e.course_id
       WHERE e.user_id = $1
       ORDER BY e.enrolled_at DESC`,
      [userId]
    );

    const enrollments = result.rows;
    const enriched = [];

    for (const enrollment of enrollments) {
      const progressStats = await progressService.getCourseProgress(userId, enrollment.course_id);
      enriched.push({
        ...enrollment,
        id: enrollment.course_id,
        enrollment_id: enrollment.id,
        progress: progressStats.percentage,
        completedLessonsCount: progressStats.completedLessonsCount,
        totalLessonsCount: progressStats.totalLessonsCount,
        isCompleted: progressStats.percentage === 100,
        lastLesson: progressStats.lastLesson,
      });
    }

    return enriched;
  },
};
