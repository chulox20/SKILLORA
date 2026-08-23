import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, CheckCircle2, Clock, PlayCircle, Award, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { enrollmentService } from '../../services/enrollmentService';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { Skeleton } from '../../components/common/Skeleton';

export function MyCourses() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // all | in_progress | completed

  useEffect(() => {
    async function loadCourses() {
      if (!user) return;
      setLoading(true);
      try {
        const enrolled = await enrollmentService.getUserEnrolledCourses(user.id);
        setCourses(enrolled);
      } catch (err) {
        console.error('Error loading enrolled courses:', err);
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, [user]);

  const filteredCourses = courses.filter((c) => {
    if (activeTab === 'in_progress') return c.progress < 100;
    if (activeTab === 'completed') return c.progress === 100;
    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Mis Cursos
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Gestiona tus capacitaciones activas y retoma donde lo dejaste.
          </p>
        </div>

        <Link to="/courses">
          <Button variant="primary" size="sm" icon={Sparkles}>
            Explorar más cursos
          </Button>
        </Link>
      </div>

      {/* Filter Tabs (Todos, En progreso, Completados) */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'all'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          Todos ({courses.length})
        </button>
        <button
          onClick={() => setActiveTab('in_progress')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'in_progress'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          En Progreso ({courses.filter((c) => c.progress < 100).length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'completed'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          Completados ({courses.filter((c) => c.progress === 100).length})
        </button>
      </div>

      {/* Courses Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-3">
              <Skeleton className="w-full h-36 rounded-xl" />
              <Skeleton className="w-3/4 h-5" />
              <Skeleton className="w-full h-3" />
            </div>
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <EmptyState
          title={
            activeTab === 'completed'
              ? 'Aún no has completado cursos'
              : 'No tienes cursos en esta sección'
          }
          description={
            activeTab === 'completed'
              ? 'Continúa estudiando y aprueba la evaluación final para obtener tus certificaciones.'
              : 'Inscríbete en cursos prácticos para desarrollar tus habilidades.'
          }
          actionText="Explorar cursos disponibles"
          onAction={() => navigate('/courses')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const isFinished = course.progress === 100;
            const targetLesson =
              course.lastLesson || course.modules?.[0]?.lessons?.[0];

            return (
              <div
                key={course.id}
                className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 space-y-4 flex flex-col justify-between backdrop-blur-md transition-all shadow-xl"
              >
                <div className="space-y-3">
                  <div className="relative h-40 rounded-2xl overflow-hidden bg-slate-800">
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-brand-400 border border-brand-500/20">
                        {course.category_name || 'Desarrollo'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                      {course.lastLesson
                        ? `Última lección: ${course.lastLesson.title}`
                        : 'Comenzar primera lección'}
                    </p>
                  </div>

                  {/* Progress info (Section 13: 80%, 9/12) */}
                  <div className="pt-2">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-400">Progreso</span>
                      <span className="font-bold text-slate-200">
                        {course.completedLessonsCount || 0} / {course.totalLessonsCount || 12} ({course.progress || 0}%)
                      </span>
                    </div>
                    <ProgressBar progress={course.progress || 0} showLabel={false} size="sm" />
                  </div>
                </div>

                <div className="pt-2">
                  {isFinished ? (
                    <div className="space-y-2">
                      <Link to={`/learn/${course.slug}/${targetLesson?.slug || ''}`}>
                        <Button variant="secondary" size="sm" className="w-full justify-center">
                          Repasar Contenido
                        </Button>
                      </Link>
                      <Link to="/dashboard/certificates">
                        <Button variant="success" size="sm" className="w-full justify-center" icon={Award}>
                          Ver Certificado Oficial
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <Link
                      to={
                        targetLesson
                          ? `/learn/${course.slug}/${targetLesson.slug}`
                          : `/courses/${course.slug}`
                      }
                    >
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full justify-center"
                        icon={PlayCircle}
                      >
                        Continuar
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
