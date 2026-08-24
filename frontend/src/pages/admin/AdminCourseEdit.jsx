import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  ArrowLeft,
  Save,
  BookOpen,
  Layers,
  Sparkles,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { courseService } from '../../services/courseService';
import { useCourses } from '../../contexts/CourseContext';
import { useNotification } from '../../contexts/NotificationContext';
import { Button } from '../../components/common/Button';
import { ModuleLessonEditor } from '../../components/admin/ModuleLessonEditor';
import { Skeleton } from '../../components/common/Skeleton';

const courseEditSchema = z.object({
  title: z.string().min(3, 'El título es obligatorio'),
  slug: z.string().min(3, 'El slug es obligatorio'),
  category_id: z.string().min(1, 'Selecciona una categoría'),
  short_description: z.string().min(10, 'Descripción corta requerida'),
  description: z.string().min(20, 'Descripción detallada requerida'),
  thumbnail_url: z.string().url('URL de imagen inválida'),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  duration: z.string().min(2, 'Duración requerida'),
  status: z.enum(['draft', 'published', 'archived']),
  objectivesText: z.string().optional(),
  requirementsText: z.string().optional(),
});

export function AdminCourseEdit() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const { categories, refreshCourses } = useCourses();
  const toast = useNotification();

  const [loading, setLoading] = useState(!isNew);
  const [activeTab, setActiveTab] = useState('general'); // general | curriculum
  const [courseModules, setCourseModules] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(courseEditSchema),
    defaultValues: {
      title: '',
      slug: '',
      category_id: 'cat-1',
      short_description: '',
      description: '',
      thumbnail_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
      level: 'beginner',
      duration: '4h 00m',
      status: 'draft',
      objectivesText: 'Componentes y hooks\nPatrones de desarrollo\nProyecto final en producción',
      requirementsText: 'Conocimientos de JavaScript\nEditor de código instalado',
    },
  });

  const titleWatch = watch('title');

  // Auto-slug if new course
  useEffect(() => {
    if (isNew && titleWatch) {
      const genSlug = titleWatch
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setValue('slug', genSlug);
    }
  }, [isNew, titleWatch, setValue]);

  // Load course data if editing
  useEffect(() => {
    async function loadCourse() {
      if (isNew) return;
      setLoading(true);
      try {
        const fetched = await courseService.getCourseById(id);
        if (fetched) {
          reset({
            title: fetched.title || '',
            slug: fetched.slug || '',
            category_id: fetched.category_id || 'cat-1',
            short_description: fetched.short_description || '',
            description: fetched.description || '',
            thumbnail_url: fetched.thumbnail_url || '',
            level: fetched.level || 'beginner',
            duration: fetched.duration || '4h 00m',
            status: fetched.status || 'draft',
            objectivesText: (fetched.objectives || []).join('\n'),
            requirementsText: (fetched.requirements || []).join('\n'),
          });
          setCourseModules(fetched.modules || []);
        }
      } catch (err) {
        toast.error('Error', 'No se pudo cargar el curso.');
      } finally {
        setLoading(false);
      }
    }

    loadCourse();
  }, [id, isNew, reset]);

  const onSubmit = async (data) => {
    try {
      const selectedCategory = categories.find((c) => c.id === data.category_id);
      const formattedData = {
        ...data,
        category_name: selectedCategory?.name || 'Desarrollo',
        objectives: (data.objectivesText || '').split('\n').map((s) => s.trim()).filter(Boolean),
        requirements: (data.requirementsText || '').split('\n').map((s) => s.trim()).filter(Boolean),
        modules: courseModules,
      };
      delete formattedData.objectivesText;
      delete formattedData.requirementsText;

      if (isNew) {
        const created = await courseService.createCourse(formattedData);
        toast.success('¡Curso Creado!', 'El curso ha sido guardado exitosamente.');
        refreshCourses();
        navigate(`/admin/courses/${created.id}/edit`);
      } else {
        await courseService.updateCourse(id, formattedData);
        toast.success('Cambios Guardados', 'Los datos y módulos del curso han sido actualizados.');
        refreshCourses();
      }
    } catch (err) {
      toast.error('Error al guardar', err.message);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-6">
        <Skeleton className="w-full h-80 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/courses"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {isNew ? 'Crear Nuevo Curso' : 'Editor de Curso y Temario'}
            </h1>
            <p className="text-xs text-slate-400">
              {isNew
                ? 'Ingresa los datos generales para comenzar'
                : `Editando: ${titleWatch || 'Curso'}`}
            </p>
          </div>
        </div>

        <Button
          onClick={handleSubmit(onSubmit)}
          isLoading={isSubmitting}
          variant="primary"
          size="sm"
          className="bg-purple-600 hover:bg-purple-500 border-purple-500/30"
          icon={Save}
        >
          Guardar Todo
        </Button>
      </div>

      {/* Tabs Selector (General Info vs Curriculum) */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'general'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Información General
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('curriculum')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'curriculum'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          Módulos y Lecciones ({courseModules.length})
        </button>
      </div>

      {/* Tab 1: General Info */}
      {activeTab === 'general' && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 backdrop-blur-md">
            {/* Title & Slug */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Título del Curso *
                </label>
                <input
                  {...register('title')}
                  placeholder="Ej. React desde cero"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-purple-500 focus:outline-none"
                />
                {errors.title && (
                  <p className="text-rose-400 text-xs mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Slug (URL) *
                </label>
                <input
                  {...register('slug')}
                  placeholder="react-desde-cero"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-300 focus:border-purple-500 focus:outline-none"
                />
                {errors.slug && (
                  <p className="text-rose-400 text-xs mt-1">{errors.slug.message}</p>
                )}
              </div>
            </div>

            {/* Category, Level, Duration, Status */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Categoría *
                </label>
                <select
                  {...register('category_id')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Nivel *
                </label>
                <select
                  {...register('level')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="beginner">Principiante</option>
                  <option value="intermediate">Intermedio</option>
                  <option value="advanced">Avanzado</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Duración *
                </label>
                <input
                  {...register('duration')}
                  placeholder="6h 30m"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Estado de Publicación *
                </label>
                <select
                  {...register('status')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="published">Publicado</option>
                  <option value="draft">Borrador</option>
                  <option value="archived">Archivado</option>
                </select>
              </div>
            </div>

            {/* Thumbnail URL */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                URL de Imagen de Portada (Thumbnail) *
              </label>
              <input
                {...register('thumbnail_url')}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
              />
              {errors.thumbnail_url && (
                <p className="text-rose-400 text-xs mt-1">{errors.thumbnail_url.message}</p>
              )}
            </div>

            {/* Short & Long Description */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Descripción Corta (Tarjeta de catálogo) *
              </label>
              <input
                {...register('short_description')}
                placeholder="Resumen atractivo en una o dos frases"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
              />
              {errors.short_description && (
                <p className="text-rose-400 text-xs mt-1">{errors.short_description.message}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Descripción Detallada *
              </label>
              <textarea
                {...register('description')}
                rows={4}
                placeholder="Explicación exhaustiva del temario y alcances del curso..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-purple-500 focus:outline-none"
              />
              {errors.description && (
                <p className="text-rose-400 text-xs mt-1">{errors.description.message}</p>
              )}
            </div>

            {/* Objectives & Requirements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Qué aprenderás (1 por línea)
                </label>
                <textarea
                  {...register('objectivesText')}
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-purple-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Requisitos Previos (1 por línea)
                </label>
                <textarea
                  {...register('requirementsText')}
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-purple-500 focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Tab 2: Curriculum / Modules & Lessons Tree */}
      {activeTab === 'curriculum' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 backdrop-blur-md">
          <ModuleLessonEditor
            modules={courseModules}
            onChange={(updated) => setCourseModules(updated)}
          />
        </div>
      )}
    </div>
  );
}
