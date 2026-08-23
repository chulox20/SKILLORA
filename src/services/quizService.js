import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getLocalItem, setLocalItem, STORAGE_KEYS } from './storageHelper';
import { INITIAL_QUIZZES } from '../lib/initialData';

export const quizService = {
  // Get Quiz by ID
  async getQuizById(quizId) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('quizzes')
          .select(`
            *,
            quiz_questions(
              *,
              quiz_options(*)
            )
          `)
          .eq('id', quizId)
          .single();

        if (!error && data) return data;
      } catch (err) {
        console.error('Supabase getQuizById error:', err);
      }
    }

    const quizzes = getLocalItem(STORAGE_KEYS.QUIZZES, INITIAL_QUIZZES);
    return quizzes.find(q => q.id === quizId) || null;
  },

  // Get Quiz by Lesson ID
  async getQuizByLessonId(lessonId) {
    const quizzes = getLocalItem(STORAGE_KEYS.QUIZZES, INITIAL_QUIZZES);
    return quizzes.find(q => q.lesson_id === lessonId) || null;
  },

  // Submit Quiz Attempt
  async submitAttempt(quizId, userId, answers) {
    // answers format: { [questionId]: selectedOptionId }
    const quiz = await this.getQuizById(quizId);
    if (!quiz) throw new Error('Quiz no encontrado.');

    let correctAnswersCount = 0;
    const totalQuestions = quiz.questions.length;
    const detailedAnswers = [];

    quiz.questions.forEach(q => {
      const selectedOptionId = answers[q.id];
      const correctOption = q.options.find(opt => opt.is_correct);
      const isCorrect = selectedOptionId && correctOption && selectedOptionId === correctOption.id;

      if (isCorrect) correctAnswersCount++;

      detailedAnswers.push({
        question_id: q.id,
        question_text: q.question,
        selected_option_id: selectedOptionId,
        correct_option_id: correctOption?.id,
        is_correct: isCorrect,
        options: q.options,
      });
    });

    const scorePercentage = Math.round((correctAnswersCount / totalQuestions) * 100);
    const passed = scorePercentage >= (quiz.passing_score || 70);

    const attempt = {
      id: `att-${Date.now()}`,
      quiz_id: quizId,
      user_id: userId,
      score: scorePercentage,
      correctCount: correctAnswersCount,
      totalCount: totalQuestions,
      passed,
      detailedAnswers,
      completed_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      try {
        await supabase.from('quiz_attempts').insert({
          id: attempt.id,
          quiz_id: quizId,
          user_id: userId,
          score: scorePercentage,
          passed,
          completed_at: attempt.completed_at,
        });
      } catch (err) {
        console.error('Supabase submitAttempt error:', err);
      }
    }

    const attempts = getLocalItem(STORAGE_KEYS.QUIZ_ATTEMPTS, []);
    attempts.push(attempt);
    setLocalItem(STORAGE_KEYS.QUIZ_ATTEMPTS, attempts);

    return attempt;
  },

  // Get user attempts for a quiz
  async getUserAttempts(quizId, userId) {
    const attempts = getLocalItem(STORAGE_KEYS.QUIZ_ATTEMPTS, []);
    return attempts.filter(a => a.quiz_id === quizId && a.user_id === userId);
  },

  // Admin: Save or update quiz
  async saveQuiz(quizData) {
    const quizzes = getLocalItem(STORAGE_KEYS.QUIZZES, INITIAL_QUIZZES);
    const existingIndex = quizzes.findIndex(q => q.id === quizData.id);

    if (existingIndex !== -1) {
      quizzes[existingIndex] = { ...quizzes[existingIndex], ...quizData };
    } else {
      quizzes.push({
        id: quizData.id || `quiz-${Date.now()}`,
        ...quizData,
      });
    }

    setLocalItem(STORAGE_KEYS.QUIZZES, quizzes);
    return quizData;
  },
};
