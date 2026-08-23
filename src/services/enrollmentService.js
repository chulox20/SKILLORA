import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getLocalItem, setLocalItem, STORAGE_KEYS } from './storageHelper';
import { INITIAL_ENROLLMENTS } from '../lib/initialData';
import { courseService } from './courseService';
import { progressService } from './progressService';

export const enrollmentService = {
  // Enroll user in course (strictly enforcing unique user_id + course_id)
  async enroll(userId, courseId) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('enrollments')
          .insert({
            user_id: userId,
            course_id: courseId,
            status: 'active',
          })
          .select()
          .single();

        if (!error && data) return data;
      } catch (err) {
        console.error('Supabase enroll error:', err);
      }
    }

    // LocalStorage fallback
    const enrollments = getLocalItem(STORAGE_KEYS.ENROLLMENTS, INITIAL_ENROLLMENTS);
    const existing = enrollments.find(e => e.user_id === userId && e.course_id === courseId);

    if (existing) {
      return existing; // Already enrolled
    }

    const newEnrollment = {
      id: `enr-${Date.now()}`,
      user_id: userId,
      course_id: courseId,
      enrolled_at: new Date().toISOString(),
      completed_at: null,
      status: 'active',
    };

    enrollments.push(newEnrollment);
    setLocalItem(STORAGE_KEYS.ENROLLMENTS, enrollments);

    // Increase course student count in storage
    const courses = getLocalItem(STORAGE_KEYS.COURSES, []);
    const courseIndex = courses.findIndex(c => c.id === courseId);
    if (courseIndex !== -1) {
      courses[courseIndex].students_count = (courses[courseIndex].students_count || 0) + 1;
      setLocalItem(STORAGE_KEYS.COURSES, courses);
    }

    return newEnrollment;
  },

  // Check if user is enrolled
  async isEnrolled(userId, courseId) {
    if (!userId || !courseId) return false;

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('enrollments')
          .select('id')
          .eq('user_id', userId)
          .eq('course_id', courseId)
          .maybeSingle();

        if (!error && data) return true;
      } catch (err) {
        console.error('Supabase isEnrolled error:', err);
      }
    }

    const enrollments = getLocalItem(STORAGE_KEYS.ENROLLMENTS, INITIAL_ENROLLMENTS);
    return enrollments.some(e => e.user_id === userId && e.course_id === courseId);
  },

  // Get enrolled courses with progress for a user
  async getUserEnrolledCourses(userId) {
    const enrollments = getLocalItem(STORAGE_KEYS.ENROLLMENTS, INITIAL_ENROLLMENTS)
      .filter(e => e.user_id === userId);

    const allCourses = await courseService.getCourses({ includeAllForAdmin: true });
    
    const enrichedCourses = [];
    for (const enrollment of enrollments) {
      const course = allCourses.find(c => c.id === enrollment.course_id);
      if (course) {
        const progressStats = await progressService.getCourseProgress(userId, course.id);
        enrichedCourses.push({
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

    return enrichedCourses;
  },
};
