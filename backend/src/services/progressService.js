import { pool, isDbConnected } from '../db/database.js';
import { courseService } from './courseService.js';

let inMemoryProgress = [];

export const progressService = {
  // Mark lesson as complete
  async markLessonComplete(userId, lessonId) {
    const id = `prog-${Date.now()}`;
    const completedAt = new Date().toISOString();

    if (isDbConnected()) {
      const result = await pool.query(
        `INSERT INTO lesson_progress (id, user_id, lesson_id, completed, completed_at)
         VALUES ($1, $2, $3, true, $4)
         ON CONFLICT (user_id, lesson_id) DO UPDATE
         SET completed = true, completed_at = EXCLUDED.completed_at
         RETURNING *`,
        [id, userId, lessonId, completedAt]
      );
      return result.rows[0];
    }

    const idx = inMemoryProgress.findIndex(
      (p) => p.user_id === userId && p.lesson_id === lessonId
    );
    if (idx !== -1) {
      inMemoryProgress[idx].completed = true;
      inMemoryProgress[idx].completed_at = completedAt;
      return inMemoryProgress[idx];
    }

    const newProgress = { id, user_id: userId, lesson_id: lessonId, completed: true, completed_at: completedAt };
    inMemoryProgress.push(newProgress);
    return newProgress;
  },

  // Unmark lesson complete
  async unmarkLessonComplete(userId, lessonId) {
    if (isDbConnected()) {
      await pool.query(
        `DELETE FROM lesson_progress WHERE user_id = $1 AND lesson_id = $2`,
        [userId, lessonId]
      );
      return true;
    }

    inMemoryProgress = inMemoryProgress.filter(
      (p) => !(p.user_id === userId && p.lesson_id === lessonId)
    );
    return true;
  },

  // Get progress stats for a course
  async getCourseProgress(userId, courseId) {
    const course = await courseService.getCourseBySlug(courseId);
    if (!course) {
      return { percentage: 0, completedLessonsCount: 0, totalLessonsCount: 0, completedLessonIds: [], lastLesson: null, isFinished: false };
    }

    const allLessons = [];
    (course.modules || []).forEach((m) => {
      (m.lessons || []).forEach((l) => allLessons.push(l));
    });

    const totalLessonsCount = allLessons.length;
    if (totalLessonsCount === 0) {
      return { percentage: 0, completedLessonsCount: 0, totalLessonsCount: 0, completedLessonIds: [], lastLesson: null, isFinished: false };
    }

    let completedLessonIds = [];

    if (isDbConnected()) {
      const lessonIds = allLessons.map((l) => l.id);
      if (lessonIds.length > 0) {
        const result = await pool.query(
          `SELECT lesson_id FROM lesson_progress WHERE user_id = $1 AND lesson_id = ANY($2) AND completed = true`,
          [userId, lessonIds]
        );
        completedLessonIds = result.rows.map((r) => r.lesson_id);
      }
    } else {
      completedLessonIds = inMemoryProgress
        .filter((p) => p.user_id === userId && p.completed && allLessons.some((l) => l.id === p.lesson_id))
        .map((p) => p.lesson_id);
    }

    const completedLessonsCount = completedLessonIds.length;
    const percentage = Math.round((completedLessonsCount / totalLessonsCount) * 100);

    const firstIncompleteLesson = allLessons.find((l) => !completedLessonIds.includes(l.id));
    const lastLesson = firstIncompleteLesson || allLessons[allLessons.length - 1] || null;

    return {
      percentage: Math.min(percentage, 100),
      completedLessonsCount,
      totalLessonsCount,
      completedLessonIds,
      lastLesson,
      isFinished: completedLessonsCount === totalLessonsCount,
    };
  },

  seedProgress(progress) {
    const idx = inMemoryProgress.findIndex(
      (p) => p.user_id === progress.user_id && p.lesson_id === progress.lesson_id
    );
    if (idx !== -1) inMemoryProgress[idx] = progress;
    else inMemoryProgress.push(progress);
  },
};
