import { apiClient } from './apiClient';
import { getLocalItem, setLocalItem, STORAGE_KEYS } from './storageHelper';
import { INITIAL_QUIZZES } from '../lib/initialData';

export const quizService = {
  // Get Quiz by ID
  async getQuizById(id) {
    try {
      const response = await apiClient.get(`/quizzes/${id}`);
      if (response.data) return response.data;
    } catch (err) {
      console.warn('API getQuizById error, using local fallback:', err.message);
    }

    const quizzes = getLocalItem(STORAGE_KEYS.QUIZZES, INITIAL_QUIZZES);
    return quizzes.find((q) => q.id === id || q.lesson_id === id) || null;
  },

  // Submit Quiz (Backend evaluates score and answers)
  async submitQuizAttempt(quizId, answers, courseId = null) {
    try {
      // answers can be map { questionId: optionId } or array
      const formattedAnswers = Array.isArray(answers)
        ? answers
        : Object.entries(answers).map(([questionId, optionId]) => ({ questionId, optionId }));

      const response = await apiClient.post(`/quizzes/${quizId}/submit`, {
        answers: formattedAnswers,
        courseId,
      });

      if (response.data) return response.data;
    } catch (err) {
      console.warn('API submitQuizAttempt error, using local evaluation:', err.message);
    }

    // Local evaluation fallback
    const quiz = await this.getQuizById(quizId);
    if (!quiz) throw new Error('Quiz no encontrado');

    const answersMap = Array.isArray(answers)
      ? answers.reduce((acc, a) => ({ ...acc, [a.questionId]: a.optionId }), {})
      : answers;

    let correctCount = 0;
    const totalCount = (quiz.questions || []).length;
    const detailedAnswers = [];

    (quiz.questions || []).forEach((q) => {
      const selectedOptionId = answersMap[q.id];
      const correctOption = (q.options || []).find((opt) => opt.is_correct);
      const isCorrect = Boolean(selectedOptionId && correctOption && selectedOptionId === correctOption.id);

      if (isCorrect) correctCount++;
      detailedAnswers.push({
        question_id: q.id,
        question_text: q.question,
        selected_option_id: selectedOptionId,
        correct_option_id: correctOption?.id,
        is_correct: isCorrect,
      });
    });

    const score = Math.round((correctCount / totalCount) * 100);
    const passed = score >= (quiz.passing_score || 70);

    return {
      score,
      correctCount,
      totalCount,
      passed,
      detailedAnswers,
    };
  },

  // Save Quiz (Admin)
  async saveQuiz(quizData) {
    try {
      const response = await apiClient.post('/quizzes', quizData);
      if (response.data) return response.data;
    } catch (err) {
      console.warn('API saveQuiz error, using local fallback:', err.message);
    }

    const quizzes = getLocalItem(STORAGE_KEYS.QUIZZES, INITIAL_QUIZZES);
    const id = quizData.id || `quiz-${Date.now()}`;
    const formatted = { id, ...quizData };
    const idx = quizzes.findIndex((q) => q.id === id);

    if (idx !== -1) quizzes[idx] = formatted;
    else quizzes.push(formatted);

    setLocalItem(STORAGE_KEYS.QUIZZES, quizzes);
    return formatted;
  },
};
