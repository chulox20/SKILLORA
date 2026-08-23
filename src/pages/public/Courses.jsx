import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookOpen, Sparkles } from 'lucide-react';
import { useCourses } from '../../contexts/CourseContext';
import { CourseFilter } from '../../components/courses/CourseFilter';
import { CourseCard } from '../../components/courses/CourseCard';
import { CourseCardSkeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';

export function Courses() {
  const { courses, loading, updateFilter, resetFilters } = useCourses();
  const [searchParams] = useSearchParams();

  // Sync category query param from URL (e.g. /courses?category=desarrollo)
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      updateFilter('category', categoryParam);
    }
  }, [searchParams]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Catálogo de Cursos</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Explora todos los cursos
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
          Filtra por categoría, nivel de dificultad y duración para encontrar la capacitación ideal para tus objetivos.
        </p>
      </div>

      {/* Interactive Filters Bar */}
      <CourseFilter />

      {/* Courses List */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs font-semibold text-slate-400">
            Mostrando <strong className="text-slate-200">{courses.length}</strong> cursos disponibles
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <EmptyState
            title="No se encontraron cursos"
            description="No hay cursos que coincidan con los filtros seleccionados. Intenta ajustar los términos de búsqueda o los filtros de categoría."
            actionText="Restablecer filtros"
            onAction={resetFilters}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
