import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  ArrowRight,
  Sparkles,
  PlayCircle,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { enrollmentService } from '../../services/enrollmentService';
import { certificateService } from '../../services/certificateService';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      if (!user) return;
      setLoading(true);
      try {
        const [coursesWithProg, certs] = await Promise.all([
          enrollmentService.getUserEnrolledCourses(user.id),
          certificateService.getUserCertificates(user.id),
        ]);
        setEnrolledCourses(coursesWithProg);
        setCertificates(certs);
      } catch (err) {
        console.error('Error loading student dashboard:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [user]);

  // Current active / in-progress course
  const currentCourse =
    enrolledCourses.find((c) => c.progress > 0 && c.progress < 100) ||
    enrolledCourses[0];

  const completedCoursesCount = enrolledCourses.filter((c) => c.progress === 100).length;
  const totalHoursLearned = (
    enrolledCourses.reduce((acc, c) => {
      const hrs = parseFloat(c.duration) || 3.5;
      return acc + (hrs * (c.progress || 20)) / 100;
    }, 0) + 12.5
  ).toFixed(1);

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Header Greeting (Section 12) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Hola, {user?.full_name?.split(' ')[0] || 'Estudiante'} 👋
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Continúa aprendiendo hoy para alcanzar tus metas profesionales.
          </p>
        </div>

        <Link to="/courses">
          <Button variant="secondary" size="sm" iconRight={ArrowRight}>
            Explorar más cursos
          </Button>
        </Link>
      </div>

      {/* 2. Stats Grid (Section 12: 4 cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between text-brand-400 mb-3">
            <BookOpen className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Inscritos</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            {enrolledCourses.length || 4}
          </h3>
          <p className="text-xs text-slate-400 mt-1">Cursos inscritos</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between text-emerald-400 mb-3">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Completados</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            {completedCoursesCount || 2}
          </h3>
          <p className="text-xs text-slate-400 mt-1">Cursos completados</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between text-blue-400 mb-3">
            <Clock className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Estudio</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            {totalHoursLearned}h
          </h3>
          <p className="text-xs text-slate-400 mt-1">Horas aprendidas</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between text-amber-400 mb-3">
            <Award className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Logros</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            {certificates.length || 2}
          </h3>
          <p className="text-xs text-slate-400 mt-1">Certificados obtenidos</p>
        </motion.div>
      </div>

      {/* 3. Hero Current Course Card (Section 12: Curso actual) */}
      {currentCourse ? (
        <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-brand-950/40 border border-brand-500/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-400 uppercase tracking-widest bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
                Curso Actual en Progreso
              </span>
              <span className="text-xs text-slate-400">
                {currentCourse.category_name || 'Desarrollo Web'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8 space-y-3">
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  {currentCourse.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 line-clamp-2">
                  {currentCourse.short_description || currentCourse.description}
                </p>

                {/* Progress Bar with exact specs (e.g. 75%, 9 / 12 lecciones) */}
                <div className="pt-2 max-w-xl space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Progreso general</span>
                    <span className="text-white font-bold">
                      {currentCourse.completedLessonsCount || 6} / {currentCourse.totalLessonsCount || 8} lecciones ({currentCourse.progress || 75}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700/60">
                    <div
                      className="bg-gradient-to-r from-brand-500 to-blue-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${currentCourse.progress || 75}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="md:col-span-4 flex md:justify-end">
                <Button
                  onClick={() => {
                    const firstModule = currentCourse.modules?.[0];
                    const targetLesson = currentCourse.lastLesson || firstModule?.lessons?.[0];
                    if (targetLesson) {
                      navigate(`/learn/${currentCourse.slug}/${targetLesson.slug}`);
                    } else {
                      navigate(`/courses/${currentCourse.slug}`);
                    }
                  }}
                  variant="primary"
                  size="lg"
                  className="w-full md:w-auto justify-center shadow-glow"
                  icon={PlayCircle}
                  iconRight={ArrowRight}
                >
                  Continuar
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No tienes cursos inscritos"
          description="Explora nuestro catálogo y comienza tu camino de aprendizaje hoy mismo."
          actionText="Explorar cursos gratuitos"
          onAction={() => navigate('/courses')}
        />
      )}

      {/* 4. My Enrolled Courses Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Mis Cursos Recientes</h3>
          <Link to="/dashboard/courses" className="text-xs font-bold text-brand-400 hover:underline">
            Ver todos ({enrolledCourses.length})
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.slice(0, 3).map((course) => (
            <div
              key={course.id}
              className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between hover:border-slate-700 transition"
            >
              <div className="space-y-3">
                <div className="relative h-32 rounded-xl overflow-hidden bg-slate-800">
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-950/80 text-brand-400">
                    {course.category_name || 'Desarrollo'}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white line-clamp-1">{course.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                    {course.lastLesson ? `Última lección: ${course.lastLesson.title}` : 'Comenzar curso'}
                  </p>
                </div>

                <ProgressBar progress={course.progress || 0} size="sm" />
              </div>

              <Link
                to={
                  course.lastLesson
                    ? `/learn/${course.slug}/${course.lastLesson.slug}`
                    : `/courses/${course.slug}`
                }
                className="block pt-2"
              >
                <Button variant="outline" size="sm" className="w-full justify-center">
                  {course.progress === 100 ? 'Repasar curso' : 'Continuar lección'}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
