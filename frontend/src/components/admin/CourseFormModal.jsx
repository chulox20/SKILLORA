import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useCourses } from '../../contexts/CourseContext';

const courseSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  slug: z.string().min(3, 'El slug es obligatorio'),
  category_id: z.string().min(1, 'Selecciona una categoría'),
  category_name: z.string().optional(),
  short_description: z.string().min(10, 'La descripción corta debe tener al menos 10 caracteres'),
  description: z.string().min(20, 'La descripción completa es obligatoria'),
  thumbnail_url: z.string().url('Ingresa una URL válida de imagen'),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  duration: z.string().min(2, 'Especifica la duración (ej. 6h 30m)'),
  status: z.enum(['draft', 'published', 'archived']),
  objectivesText: z.string().min(5, 'Ingresa al menos un objetivo (uno por línea)'),
  requirementsText: z.string().min(5, 'Ingresa al menos un requisito (uno por línea)'),
});

export function CourseFormModal({ isOpen, onClose, course = null, onSave }) {
  const { categories } = useCourses();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: '',
      slug: '',
      category_id: 'cat-1',
      category_name: 'Desarrollo',
      short_description: '',
      description: '',
      thumbnail_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
      level: 'beginner',
      duration: '4h 00m',
      status: 'draft',
      objectivesText: 'Componentes y arquitectura\nHooks y gestión de estado\nProyecto final desplegado',
      requirementsText: 'Conocimientos básicos de JavaScript\nEditor de código instalado',
    },
  });

  const titleWatch = watch('title');

  // Auto-generate slug from title if creating new
  useEffect(() => {
    if (!course && titleWatch) {
      const generatedSlug = titleWatch
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setValue('slug', generatedSlug);
    }
  }, [titleWatch, course, setValue]);

  // Load course for editing
  useEffect(() => {
    if (course) {
      reset({
        title: course.title || '',
        slug: course.slug || '',
        category_id: course.category_id || 'cat-1',
        category_name: course.category_name || 'Desarrollo',
        short_description: course.short_description || '',
        description: course.description || '',
        thumbnail_url: course.thumbnail_url || '',
        level: course.level || 'beginner',
        duration: course.duration || '4h 00m',
        status: course.status || 'draft',
        objectivesText: (course.objectives || []).join('\n'),
        requirementsText: (course.requirements || []).join('\n'),
      });
    } else {
      reset({
        title: '',
        slug: '',
        category_id: 'cat-1',
        category_name: 'Desarrollo',
        short_description: '',
        description: '',
        thumbnail_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
        level: 'beginner',
        duration: '4h 00m',
        status: 'draft',
        objectivesText: 'Componentes y arquitectura\nHooks y gestión de estado\nProyecto final desplegado',
        requirementsText: 'Conocimientos básicos de JavaScript\nEditor de código instalado',
      });
    }
  }, [course, reset]);

  const onSubmit = async (data) => {
    const selectedCategory = categories.find((c) => c.id === data.category_id);
    const formattedData = {
      ...data,
      category_name: selectedCategory?.name || 'Desarrollo',
      objectives: data.objectivesText.split('\n').map((s) => s.trim()).filter(Boolean),
      requirements: data.requirementsText.split('\n').map((s) => s.trim()).filter(Boolean),
    };
    delete formattedData.objectivesText;
    delete formattedData.requirementsText;

    await onSave(formattedData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-3xl"
      title={course ? 'Editar Curso' : 'Crear Nuevo Curso'}
      subtitle="Define los detalles, objetivos y configuración del curso"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Title and Slug */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Título del Curso *
            </label>
            <input
              {...register('title')}
              placeholder="Ej. React desde cero"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-brand-500 focus:outline-none"
            />
            {errors.title && <p className="text-rose-400 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Slug (URL) *
            </label>
            <input
              {...register('slug')}
              placeholder="ej-react-desde-cero"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-300 focus:border-brand-500 focus:outline-none"
            />
            {errors.slug && <p className="text-rose-400 text-xs mt-1">{errors.slug.message}</p>}
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
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-brand-500 focus:outline-none"
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
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-brand-500 focus:outline-none"
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
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Estado *
            </label>
            <select
              {...register('status')}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-brand-500 focus:outline-none"
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
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-brand-500 focus:outline-none"
          />
          {errors.thumbnail_url && (
            <p className="text-rose-400 text-xs mt-1">{errors.thumbnail_url.message}</p>
          )}
        </div>

        {/* Short & Long Description */}
        <div>
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
            Descripción Corta (Tarjeta) *
          </label>
          <input
            {...register('short_description')}
            placeholder="Resumen atractivo en una o dos frases"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-brand-500 focus:outline-none"
          />
          {errors.short_description && (
            <p className="text-rose-400 text-xs mt-1">{errors.short_description.message}</p>
          )}
        </div>

        <div>
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
            Descripción Completa *
          </label>
          <textarea
            {...register('description')}
            rows={3}
            placeholder="Detalles sobre lo que aprenderá el estudiante..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-brand-500 focus:outline-none"
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
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-brand-500 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Requisitos (1 por línea)
            </label>
            <textarea
              {...register('requirementsText')}
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-brand-500 focus:outline-none font-mono"
            />
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button onClick={onClose} variant="secondary" size="sm">
            Cancelar
          </Button>
          <Button type="submit" isLoading={isSubmitting} variant="primary" size="sm">
            {course ? 'Guardar Cambios' : 'Crear Curso'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
