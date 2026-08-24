import { z } from 'zod';

export const submitQuizSchema = z.object({
  body: z.object({
    answers: z.array(
      z.object({
        questionId: z.string().min(1),
        optionId: z.string().min(1),
      })
    ).min(1, 'Debes enviar al menos una respuesta'),
  }),
});

export const saveQuizSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Título del quiz requerido'),
    passingScore: z.number().int().min(10).max(100).default(70),
    lessonId: z.string().optional(),
    courseId: z.string().optional(),
    questions: z.array(
      z.object({
        id: z.string().optional(),
        question: z.string().min(3),
        options: z.array(
          z.object({
            id: z.string().optional(),
            option_text: z.string().min(1),
            is_correct: z.boolean().default(false),
          })
        ).min(2, 'Cada pregunta debe tener al menos 2 opciones'),
      })
    ).min(1, 'El quiz debe tener al menos una pregunta'),
  }),
});
