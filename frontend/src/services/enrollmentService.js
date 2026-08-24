import { apiClient } from './apiClient';
import { getLocalItem, setLocalItem, STORAGE_KEYS } from './storageHelper';
import { INITIAL_ENROLLMENTS } from '../lib/initialData';
import { courseService } from './courseService';
import { progressService } from './progressService';

export const enrollmentService = {
  // Enroll in course
  async enroll(userId, courseId) {
    try {
      const response = await apiClient.post(`/courses/${courseId}/enroll`);
      if (response.data) return response.data;
    } catch (err) {
      console.warn('API enroll error, using local fallback:', err.message);
    }

    const enrollments = getLocalItem(STORAGE_KEYS.ENROLLMENTS, INITIAL_ENROLLMENTS);
    const existing = enrollments.find((e) => e.user_id === userId && e.course_id === courseId);
    if (existing) return existing;

    const newEnrollment = {
      id: `enr-${Date.now()}`,
      user_id: userId,
      course_id: courseId,
      status: 'active',
      enrolled_at: new Date().toISOString(),
      completed_at: null,
    };

    enrollments.push(newEnrollment);
    setLocalItem(STORAGE_KEYS.ENROLLMENTS, enrollments);
    return newEnrollment;
  },

  // Check enrollment
  async isEnrolled(userId, courseId) {
    if (!userId || !courseId) return false;

    try {
      const response = await apiClient.get(`/me/courses/${courseId}`);
      if (response.data) return response.data.isEnrolled;
    } catch (err) {
      // Fallback
    }

    const enrollments = getLocalItem(STORAGE_KEYS.ENROLLMENTS, INITIAL_ENROLLMENTS);
    return enrollments.some((e) => e.user_id === userId && e.course_id === courseId);
  },

  // Get enrolled courses with progress
  async getUserEnrolledCourses(userId) {
    try {
      const response = await apiClient.get('/me/courses');
      if (response.data) return response.data;
    } catch (err) {
      console.warn('API getUserEnrolledCourses error, using local fallback:', err.message);
    }

    const enrollments = getLocalItem(STORAGE_KEYS.ENROLLMENTS, INITIAL_ENROLLMENTS);
    const userEnrollments = enrollments.filter((e) => e.user_id === userId);
    const allCourses = await courseService.getCourses({ includeAllForAdmin: true });

    const enriched = [];
    for (const enrollment of userEnrollments) {
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
};
