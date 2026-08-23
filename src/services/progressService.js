import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getLocalItem, setLocalItem, STORAGE_KEYS } from './storageHelper';
import { INITIAL_PROGRESS } from '../lib/initialData';
import { courseService } from './courseService';

export const progressService = {
  // Check if a specific lesson is completed
  async isLessonCompleted(userId, lessonId) {
    if (!userId || !lessonId) return false;

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('lesson_progress')
          .select('completed')
          .eq('user_id', userId)
          .eq('lesson_id', lessonId)
          .maybeSingle();

        if (!error && data) return data.completed;
      } catch (err) {
        console.error('Supabase isLessonCompleted error:', err);
      }
    }

    const progress = getLocalItem(STORAGE_KEYS.PROGRESS, INITIAL_PROGRESS);
    return progress.some(p => p.user_id === userId && p.lesson_id === lessonId && p.completed);
  },

  // Mark lesson as completed
  async markLessonCompleted(userId, courseId, lessonId) {
    if (!userId || !lessonId) return null;

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('lesson_progress')
          .upsert({
            user_id: userId,
            lesson_id: lessonId,
            completed: true,
            completed_at: new Date().toISOString(),
          }, { onConflict: 'user_id,lesson_id' })
          .select()
          .single();

        if (!error && data) return data;
      } catch (err) {
        console.error('Supabase markLessonCompleted error:', err);
      }
    }

    // LocalStorage fallback
    const progressList = getLocalItem(STORAGE_KEYS.PROGRESS, INITIAL_PROGRESS);
    const existingIndex = progressList.findIndex(p => p.user_id === userId && p.lesson_id === lessonId);

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

  // Unmark lesson completed
  async unmarkLessonCompleted(userId, lessonId) {
    if (!userId || !lessonId) return null;

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('lesson_progress')
          .delete()
          .eq('user_id', userId)
          .eq('lesson_id', lessonId);
      } catch (err) {
        console.error('Supabase unmarkLessonCompleted error:', err);
      }
    }

    const progressList = getLocalItem(STORAGE_KEYS.PROGRESS, INITIAL_PROGRESS);
    const filtered = progressList.filter(p => !(p.user_id === userId && p.lesson_id === lessonId));
    setLocalItem(STORAGE_KEYS.PROGRESS, filtered);
    return true;
  },

  // Get complete progress for a course
  async getCourseProgress(userId, courseId) {
    const course = await courseService.getCourseById(courseId);
    if (!course) {
      return {
        percentage: 0,
        completedLessonsCount: 0,
        totalLessonsCount: 0,
        completedLessonIds: [],
        lastLesson: null,
      };
    }

    // Extract all lessons from modules
    const allLessons = [];
    (course.modules || []).forEach(m => {
      (m.lessons || []).forEach(l => {
        allLessons.push(l);
      });
    });

    const totalLessonsCount = allLessons.length;
    if (totalLessonsCount === 0) {
      return {
        percentage: 0,
        completedLessonsCount: 0,
        totalLessonsCount: 0,
        completedLessonIds: [],
        lastLesson: null,
      };
    }

    const progressList = getLocalItem(STORAGE_KEYS.PROGRESS, INITIAL_PROGRESS)
      .filter(p => p.user_id === userId && p.completed);

    const completedLessonIds = progressList
      .filter(p => allLessons.some(l => l.id === p.lesson_id))
      .map(p => p.lesson_id);

    const completedLessonsCount = completedLessonIds.length;
    const percentage = Math.round((completedLessonsCount / totalLessonsCount) * 100);

    // Find last lesson or next incompleted lesson
    const firstIncompleteLesson = allLessons.find(l => !completedLessonIds.includes(l.id));
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
