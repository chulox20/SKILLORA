import { apiClient } from './apiClient';
import { getLocalItem, setLocalItem, STORAGE_KEYS } from './storageHelper';
import { INITIAL_PROGRESS } from '../lib/initialData';
import { courseService } from './courseService';

export const progressService = {
  // Mark lesson as complete
  async markLessonComplete(userId, lessonId, courseId = null) {
    try {
      const response = await apiClient.post(`/lessons/${lessonId}/complete`, { courseId });
      if (response.data) return response.data;
    } catch (err) {
      console.warn('API markLessonComplete error, using local fallback:', err.message);
    }

    const progressList = getLocalItem(STORAGE_KEYS.PROGRESS, INITIAL_PROGRESS);
    const existingIndex = progressList.findIndex(
      (p) => p.user_id === userId && p.lesson_id === lessonId
    );

    if (existingIndex !== -1) {
      progressList[existingIndex].completed = true;
      progressList[existingIndex].completed_at = new Date().toISOString();
    } else {
      progressList.push({
        id: `prog-${Date.now()}`,
        user_id: userId,
        lesson_id: lessonId,
        completed: true,
        completed_at: new Date().toISOString(),
      });
    }

    setLocalItem(STORAGE_KEYS.PROGRESS, progressList);
    return true;
  },

  // Toggle completion
  async toggleLessonComplete(userId, lessonId, courseId = null) {
    const isCompleted = await this.isLessonCompleted(userId, lessonId);
    if (isCompleted) {
      try {
        await apiClient.delete(`/lessons/${lessonId}/complete`);
      } catch (err) {}
      const progressList = getLocalItem(STORAGE_KEYS.PROGRESS, INITIAL_PROGRESS);
      const filtered = progressList.filter(
        (p) => !(p.user_id === userId && p.lesson_id === lessonId)
      );
      setLocalItem(STORAGE_KEYS.PROGRESS, filtered);
      return false;
    } else {
      await this.markLessonComplete(userId, lessonId, courseId);
      return true;
    }
  },

  // Check if a single lesson is completed
  async isLessonCompleted(userId, lessonId) {
    const progressList = getLocalItem(STORAGE_KEYS.PROGRESS, INITIAL_PROGRESS);
    return progressList.some(
      (p) => p.user_id === userId && p.lesson_id === lessonId && p.completed
    );
  },

  // Calculate course progress stats
  async getCourseProgress(userId, courseId) {
    try {
      const response = await apiClient.get(`/courses/${courseId}/progress`);
      if (response.data) return response.data;
    } catch (err) {
      // Fallback
    }

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

    const progressList = getLocalItem(STORAGE_KEYS.PROGRESS, INITIAL_PROGRESS);
    const completedLessonIds = progressList
      .filter((p) => p.user_id === userId && p.completed && allLessons.some((l) => l.id === p.lesson_id))
      .map((p) => p.lesson_id);

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
};
