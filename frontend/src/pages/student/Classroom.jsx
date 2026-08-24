import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  ArrowLeft,
  Menu,
  X,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Award,
  Sparkles,
} from 'lucide-react';
import { courseService } from '../../services/courseService';
import { progressService } from '../../services/progressService';
import { quizService } from '../../services/quizService';
import { enrollmentService } from '../../services/enrollmentService';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { VideoPlayer } from '../../components/learning/VideoPlayer';
import { ArticleViewer } from '../../components/learning/ArticleViewer';
import { LessonSidebar } from '../../components/learning/LessonSidebar';
import { NavigationBar } from '../../components/learning/NavigationBar';
import { QuizView } from '../../components/quizzes/QuizView';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';

export function Classroom() {
  const { courseSlug, lessonSlug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useNotification();

  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [completedLessonIds, setCompletedLessonIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);
  const [isTogglingProgress, setIsTogglingProgress] = useState(false);

  // Flatten all lessons across modules
  const allLessons = useMemo(() => {
    if (!course?.modules) return [];
    const flat = [];
    course.modules.forEach((mod) => {
      (mod.lessons || []).forEach((les) => {
        flat.push({ ...les, moduleTitle: mod.title });
      });
    });
    return flat;
  }, [course]);

  // Load Course and Current Lesson
  useEffect(() => {
    async function loadClassroom() {
      if (!user) return;
      setLoading(true);
      try {
        const fetchedCourse = await courseService.getCourseBySlug(courseSlug);
        if (!fetchedCourse) {
          setLoading(false);
          return;
        }

        setCourse(fetchedCourse);

        // Ensure user is enrolled
        const isEnrolled = await enrollmentService.isEnrolled(user.id, fetchedCourse.id);
        if (!isEnrolled) {
          await enrollmentService.enroll(user.id, fetchedCourse.id);
        }

        // Load progress
        const progressStats = await progressService.getCourseProgress(user.id, fetchedCourse.id);
        setCompletedLessonIds(progressStats.completedLessonIds);

        // Find active lesson by slug or default to first
        const flatLessons = [];
        (fetchedCourse.modules || []).forEach((m) => {
          (m.lessons || []).forEach((l) => flatLessons.push(l));
        });

        const activeLesson =
          flatLessons.find((l) => l.slug === lessonSlug || l.id === lessonSlug) ||
          flatLessons[0];

        setCurrentLesson(activeLesson);

        // If active lesson is a quiz, load quiz details
        if (activeLesson?.type === 'quiz') {
          const quiz =
            (await quizService.getQuizByLessonId(activeLesson.id)) ||
            (await quizService.getQuizById(activeLesson.quiz_id)) ||
            (await quizService.getQuizById('quiz-react-1'));
          setCurrentQuiz(quiz);
        }
      } catch (err) {
        console.error('Error loading classroom:', err);
      } finally {
        setLoading(false);
      }
    }

    loadClassroom();
  }, [courseSlug, lessonSlug, user]);

  // Handle Lesson Selection
  const handleSelectLesson = (lesson) => {
    navigate(`/learn/${course.slug}/${lesson.slug}`);
    setIsSidebarOpenMobile(false);
  };

  // Current Lesson Index & Navigation
  const currentIndex = allLessons.findIndex((l) => l.id === currentLesson?.id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < allLessons.length - 1;
  const isLastLesson = currentIndex === allLessons.length - 1;
  const isCurrentLessonCompleted = completedLessonIds.includes(currentLesson?.id);

  const handlePrevious = () => {
    if (hasPrevious) {
      handleSelectLesson(allLessons[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      handleSelectLesson(allLessons[currentIndex + 1]);
    }
  };

  // Toggle Lesson Completion
  const handleToggleComplete = async () => {
    if (!currentLesson || !user || !course) return;

    setIsTogglingProgress(true);
    try {
      if (isCurrentLessonCompleted) {
        await progressService.unmarkLessonCompleted(user.id, currentLesson.id);
        setCompletedLessonIds((prev) => prev.filter((id) => id !== currentLesson.id));
        toast.info('Progreso actualizado', 'Lección desmarcada.');
      } else {
        await progressService.markLessonCompleted(user.id, course.id, currentLesson.id);
        setCompletedLessonIds((prev) => [...prev, currentLesson.id]);
        toast.success('¡Excelente!', 'Lección completada ✓');

        // Auto-advance to next lesson if available
        if (hasNext && currentLesson.type !== 'quiz') {
          setTimeout(() => {
            handleNext();
          }, 800);
        }
      }
    } catch (err) {
      toast.error('Error', 'No se pudo actualizar el progreso.');
    } finally {
      setIsTogglingProgress(false);
    }
  };

  const progressPercentage = Math.round(
    ((completedLessonIds.length || 0) / (allLessons.length || 1)) * 100
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 flex flex-col items-center justify-center space-y-4">
        <Skeleton className="w-48 h-8 rounded-xl" />
        <Skeleton className="w-full max-w-4xl h-96 rounded-3xl" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 flex items-center justify-center">
        <EmptyState
          title="Curso no encontrado"
          description="No pudimos encontrar el aula de este curso."
          actionText="Volver al Dashboard"
          onAction={() => navigate('/dashboard')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-100">
      {/* 1. Immersive Classroom Header */}
      <header className="h-16 bg-slate-950/90 border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between shrink-0 sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-4 min-w-0">
          <Link
            to="/dashboard/courses"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0"
            title="Volver a Mis Cursos"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="truncate">
            <h2 className="text-xs sm:text-sm font-bold text-white truncate">
              {course.title}
            </h2>
            <p className="text-[11px] text-slate-400 truncate">
              {currentLesson?.title || 'Lección'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Progress preview in header */}
          <div className="hidden sm:flex items-center gap-3 w-44">
            <ProgressBar progress={progressPercentage} showLabel={false} size="sm" />
            <span className="text-xs font-bold text-slate-300 shrink-0">
              {progressPercentage}%
            </span>
          </div>

          {/* Toggle Mobile Drawer */}
          <button
            onClick={() => setIsSidebarOpenMobile(!isSidebarOpenMobile)}
            className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            {isSidebarOpenMobile ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* 2. Main Content + Sidebar Split Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Main Content Area (Video / Article / Quiz) */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-between space-y-8">
          <div className="max-w-4xl mx-auto w-full space-y-6">
            {/* Lesson Render based on type (Section 15) */}
            {currentLesson?.type === 'video' && (
              <div className="space-y-4">
                <VideoPlayer
                  url={currentLesson.video_url || 'https://www.youtube.com/watch?v=w7ejDZ8SWv8'}
                  title={currentLesson.title}
                />
              </div>
            )}

            {currentLesson?.type === 'article' && (
              <div className="space-y-4">
                <ArticleViewer
                  content={currentLesson.content || 'Contenido del artículo en preparación.'}
                  title={currentLesson.title}
                />
              </div>
            )}

            {currentLesson?.type === 'quiz' && (
              <div className="space-y-4">
                <QuizView
                  quiz={currentQuiz}
                  courseId={course.id}
                  onCompleted={() => {
                    if (!isCurrentLessonCompleted) {
                      handleToggleComplete();
                    }
                  }}
                />
              </div>
            )}

            {/* Lesson Details and Info */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 backdrop-blur-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[11px] font-bold text-brand-400 uppercase tracking-wider block">
                    {currentLesson?.moduleTitle || 'Módulo del Curso'}
                  </span>
                  <h1 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                    {currentLesson?.title}
                  </h1>
                </div>

                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-950 text-slate-300 border border-slate-800">
                  Duración: {currentLesson?.duration || '15 min'}
                </span>
              </div>

              {currentLesson?.description && (
                <p className="text-sm text-slate-300 leading-relaxed">
                  {currentLesson.description}
                </p>
              )}
            </div>
          </div>

          {/* Navigation Bar (Section 17: Anterior, Marcar como completada, Siguiente) */}
          <div className="max-w-4xl mx-auto w-full pt-4">
            <NavigationBar
              hasPrevious={hasPrevious}
              hasNext={hasNext}
              isLastLesson={isLastLesson}
              isCompleted={isCurrentLessonCompleted}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onToggleComplete={handleToggleComplete}
              onStartQuiz={() => {
                if (currentLesson?.type !== 'quiz') {
                  // Find quiz lesson
                  const quizLesson = allLessons.find((l) => l.type === 'quiz');
                  if (quizLesson) handleSelectLesson(quizLesson);
                }
              }}
              isToggling={isTogglingProgress}
            />
          </div>
        </main>

        {/* Desktop Sidebar (Section 14) */}
        <aside className="hidden lg:block w-80 xl:w-96 shrink-0 h-[calc(100vh-4rem)] sticky top-16">
          <LessonSidebar
            course={course}
            modules={course.modules || []}
            activeLessonId={currentLesson?.id}
            completedLessonIds={completedLessonIds}
            onSelectLesson={handleSelectLesson}
            progressPercentage={progressPercentage}
          />
        </aside>

        {/* Mobile Sidebar Drawer */}
        <AnimatePresence>
          {isSidebarOpenMobile && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed inset-y-0 right-0 z-50 w-80 bg-slate-950 border-l border-slate-800 lg:hidden shadow-2xl"
            >
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Temario del Curso</h3>
                <button
                  onClick={() => setIsSidebarOpenMobile(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="h-[calc(100vh-4rem)] overflow-y-auto">
                <LessonSidebar
                  course={course}
                  modules={course.modules || []}
                  activeLessonId={currentLesson?.id}
                  completedLessonIds={completedLessonIds}
                  onSelectLesson={handleSelectLesson}
                  progressPercentage={progressPercentage}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
