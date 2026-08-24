import React from 'react';
import { motion } from 'framer-motion';
import {
  Star,
  Clock,
  BookOpen,
  CheckCircle2,
  Users,
  Award,
  PlayCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { formatLevel } from '../../utils/formatters';

export function CourseHero({
  course,
  isEnrolled,
  isCompleted,
  progress = 0,
  onEnroll,
  onContinue,
  isEnrolling = false,
}) {
  const totalLessons = course.modules?.reduce(
    (acc, m) => acc + (m.lessons?.length || 0),
    0
  ) || 12;

  return (
    <div className="relative bg-slate-900/90 border-b border-slate-800/80 py-12 lg:py-16 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Info Left Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="brand" size="md">
                {course.category_name || 'Desarrollo Web'}
              </Badge>
              <Badge variant="slate" size="md">
                Nivel {formatLevel(course.level)}
              </Badge>
              <Badge variant="success" size="md" icon={Award}>
                Certificado Incluido
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {course.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
              {course.description || course.short_description}
            </p>

            {/* Quick Metrics Bar */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-300 pt-2">
              <div className="flex items-center gap-1.5 font-bold text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{course.rating || 4.9}</span>
                <span className="text-slate-400 font-normal text-xs">
                  ({course.reviews_count || 128} valoraciones)
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-300">
                <Users className="w-4 h-4 text-brand-400" />
                <span>{course.students_count || 245} estudiantes</span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-300">
                <BookOpen className="w-4 h-4 text-blue-400" />
                <span>{totalLessons} lecciones</span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-300">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>{course.duration || '6h 30m'}</span>
              </div>
            </div>

            {/* Instructor preview */}
            {course.instructor && (
              <div className="flex items-center gap-3 pt-2">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-700"
                />
                <div>
                  <p className="text-xs text-slate-400 font-medium">Impartido por:</p>
                  <p className="text-sm font-bold text-slate-200">{course.instructor.name}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Action Card / Sticky Preview */}
          <div className="lg:col-span-4 w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl shadow-slate-950/80 space-y-6"
            >
              <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-800 border border-slate-700/60">
                <img
                  src={course.thumbnail_url || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80'}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-brand-600/90 text-white flex items-center justify-center shadow-lg shadow-brand-600/40 backdrop-blur-sm">
                    <PlayCircle className="w-6 h-6 ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Price & Free Guarantee */}
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">Gratis</span>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    Acceso Total
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Incluye todas las lecciones, código de ejemplo, quizzes y certificado.
                </p>
              </div>

              {/* Action Button */}
              {isEnrolled ? (
                <div className="space-y-3">
                  <Button
                    onClick={onContinue}
                    variant="success"
                    size="lg"
                    className="w-full justify-center"
                    iconRight={ArrowRight}
                  >
                    {isCompleted ? 'Repasar Curso' : 'Continuar Aprendiendo'}
                  </Button>
                  <p className="text-center text-xs text-slate-400">
                    Progreso actual: <strong className="text-emerald-400">{progress}%</strong>
                  </p>
                </div>
              ) : (
                <Button
                  onClick={onEnroll}
                  isLoading={isEnrolling}
                  variant="primary"
                  size="lg"
                  className="w-full justify-center text-base"
                  icon={Sparkles}
                >
                  Inscribirme gratis
                </Button>
              )}

              {/* Course Features List */}
              <div className="border-t border-slate-800 pt-4 space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Acceso ilimitado de por vida</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{totalLessons} lecciones prácticas en video y texto</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Evaluación interactiva y retroalimentación</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Certificado oficial verificable en PDF / PNG</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
