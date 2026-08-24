import { z } from 'zod';

export const createCourseSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
    slug: z.string().min(3).optional(),
    categoryId: z.string().min(1, 'Categoría requerida'),
    categoryName: z.string().optional(),
    shortDescription: z.string().min(5, 'Descripción corta requerida'),
    description: z.string().min(10, 'Descripción detallada requerida'),
    thumbnailUrl: z.string().url('URL de imagen inválida'),
    level: z.enum(['beginner', 'intermediate', 'advanced']),
    duration: z.string().min(2),
    status: z.enum(['draft', 'published', 'archived']).default('draft'),
    objectives: z.array(z.string()).optional(),
    requirements: z.array(z.string()).optional(),
  }),
});

export const updateCourseSchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    slug: z.string().min(3).optional(),
    categoryId: z.string().optional(),
    categoryName: z.string().optional(),
    shortDescription: z.string().optional(),
    description: z.string().optional(),
    thumbnailUrl: z.string().url().optional(),
    level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    duration: z.string().optional(),
    status: z.enum(['draft', 'published', 'archived']).optional(),
    objectives: z.array(z.string()).optional(),
    requirements: z.array(z.string()).optional(),
    modules: z.array(z.any()).optional(),
  }),
});

export const createModuleSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Título del módulo requerido'),
    description: z.string().optional(),
    orderIndex: z.number().int().optional(),
  }),
});

export const createLessonSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Título de la lección requerido'),
    slug: z.string().min(2).optional(),
    description: z.string().optional(),
    type: z.enum(['video', 'article', 'quiz']),
    content: z.string().optional(),
    videoUrl: z.string().optional(),
    duration: z.string().optional(),
    orderIndex: z.number().int().optional(),
    quizId: z.string().optional(),
  }),
});
