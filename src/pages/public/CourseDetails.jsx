import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Sparkles,
  Award,
  Layers,
  Clock,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { courseService } from '../../services/courseService';
import { enrollmentService } from '../../services/enrollmentService';
import { progressService } from '../../services/progressService';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { CourseHero } from '../../components/courses/CourseHero';
import { CourseCurriculum } from '../../components/courses/CourseCurriculum';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';

export function CourseDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const toast = useNotification();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [progressStats, setProgressStats] = useState({
    percentage: 0,
    completedLessonIds: [],
    lastLesson: null,
  });

  useEffect(() => {
    async function loadCourseDetails() {
      setLoading(true);
      try {
        const fetchedCourse = await courseService.getCourseBySlug(slug);
        setCourse(fetchedCourse);

        if (fetchedCourse && user) {
          const enrolled = await enrollmentService.isEnrolled(user.id, fetchedCourse.id);
          setIsEnrolled(enrolled);

          if (enrolled) {
            const stats = await progressService.getCourseProgress(user.id, fetchedCourse.id);
            setProgressStats(stats);
          }
        }
      } catch (err) {
        console.error('Error loading course details:', err);
      } finally {
        setLoading(false);
      }
    }

    loadCourseDetails();
  }, [slug, user]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast.info('Inicia sesión', 'Debes iniciar sesión para inscribirte en el curso.');
      navigate('/login');
      return;
    }

    setIsEnrolling(true);
    try {
      await enrollmentService.enroll(user.id, course.id);
      setIsEnrolled(true);
      toast.success('¡Inscripción exitosa!', `Te has inscrito correctamente en ${course.title}.`);

      // Find first lesson to start immediately
      const firstModule = course.modules?.[0];
      const firstLesson = firstModule?.lessons?.[0];

      if (firstLesson) {
        navigate(`/learn/${course.slug}/${firstLesson.slug}`);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error('Error', 'No pudimos procesar tu inscripción.');
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleContinue = () => {
    // Find next uncompleted lesson or first lesson
    const firstModule = course.modules?.[0];
    const targetLesson = progressStats.lastLesson || firstModule?.lessons?.[0];

    if (targetLesson) {
      navigate(`/learn/${course.slug}/${targetLesson.slug}`);
    } else {
      navigate('/dashboard/courses');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        <Skeleton className="w-full h-80 rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="lg:col-span-2 h-96 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <EmptyState
          title="Curso no encontrado"
          description="El curso que estás buscando no existe o ha sido movido."
          actionText="Ver catálogo de cursos"
          onAction={() => navigate('/courses')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {/* 1. Hero Section */}
      <CourseHero
        course={course}
        isEnrolled={isEnrolled}
        isCompleted={progressStats.percentage === 100}
        progress={progressStats.percentage}
        onEnroll={handleEnroll}
        onContinue={handleContinue}
        isEnrolling={isEnrolling}
      />

      {/* 2. Course Details Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-10">
            {/* Qué aprenderás */}
            {course.objectives && course.objectives.length > 0 && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-400" />
                  Qué aprenderás en este curso
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  {course.objectives.map((obj, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Temario / Curriculum */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-white">Contenido del curso</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {course.modules?.length || 0} módulos •{' '}
                    {course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0}{' '}
                    lecciones en total
                  </p>
                </div>
              </div>

              <CourseCurriculum
                modules={course.modules || []}
                completedLessonIds={progressStats.completedLessonIds}
                isEnrolled={isEnrolled}
                onSelectLesson={(lesson) => {
                  if (isEnrolled) {
                    navigate(`/learn/${course.slug}/${lesson.slug}`);
                  } else {
                    handleEnroll();
                  }
                }}
              />
            </div>

            {/* Requisitos */}
            {course.requirements && course.requirements.length > 0 && (
              <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 space-y-3">
                <h3 className="text-base font-bold text-white">Requisitos previos</h3>
                <ul className="space-y-2 text-sm text-slate-400 list-disc list-inside">
                  {course.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-6">
            {/* Certificate info widget */}
            <div className="bg-slate-900/80 border border-emerald-500/30 rounded-3xl p-6 space-y-4 backdrop-blur-md">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-glow-success">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">Certificado de Finalización</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Al completar el 100% de las lecciones y aprobar la evaluación final con $\ge 70\%$, recibirás un certificado oficial con código único de verificación.
              </p>
            </div>

            {/* Free enrollment note */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 space-y-3 text-xs text-slate-400">
              <div className="flex items-center gap-2 text-slate-200 font-semibold">
                <ShieldCheck className="w-4 h-4 text-brand-400" />
                <span>Garantía de Aprendizaje</span>
              </div>
              <p>
                Todos los cursos en Skillora son interactivos, actualizados constantemente y diseñados por expertos de la industria.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
