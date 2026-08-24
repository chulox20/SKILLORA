import { pool, isDbConnected } from '../db/database.js';

let inMemoryQuizzes = [];
let inMemoryAttempts = [];

export const quizService = {
  // Get Quiz for Student (Section 30: NEVER sends is_correct to frontend)
  async getQuizById(id) {
    const fullQuiz = await this.getFullQuizById(id);
    if (!fullQuiz) return null;

    // Sanitize: strip out is_correct for public consumer
    return {
      id: fullQuiz.id,
      lesson_id: fullQuiz.lesson_id,
      course_id: fullQuiz.course_id,
      title: fullQuiz.title,
      passing_score: fullQuiz.passing_score,
      questions: (fullQuiz.questions || []).map((q) => ({
        id: q.id,
        question: q.question,
        options: (q.options || []).map((opt) => ({
          id: opt.id,
          text: opt.option_text || opt.text,
          option_text: opt.option_text || opt.text,
          // Notice: NO is_correct property here!
        })),
      })),
    };
  },

  // Internal: Get Quiz with correct answers for backend validation or admin
  async getFullQuizById(id) {
    if (isDbConnected()) {
      const quizRes = await pool.query(`SELECT * FROM quizzes WHERE id = $1 OR lesson_id = $1`, [id]);
      const quiz = quizRes.rows[0];
      if (!quiz) return null;

      const questionsRes = await pool.query(
        `SELECT * FROM quiz_questions WHERE quiz_id = $1 ORDER BY order_index ASC`,
        [quiz.id]
      );
      const questions = questionsRes.rows;

      for (const q of questions) {
        const optionsRes = await pool.query(
          `SELECT * FROM quiz_options WHERE question_id = $1 ORDER BY order_index ASC`,
          [q.id]
        );
        q.options = optionsRes.rows;
      }

      quiz.questions = questions;
      return quiz;
    }

    return inMemoryQuizzes.find((q) => q.id === id || q.lesson_id === id) || null;
  },

  // Submit Quiz Attempt (Section 31)
  async submitQuizAttempt(quizId, userId, answers = []) {
    const fullQuiz = await this.getFullQuizById(quizId);
    if (!fullQuiz) {
      const err = new Error('Quiz no encontrado.');
      err.statusCode = 404;
      throw err;
    }

    // Convert submitted answers array to a lookup map { questionId: optionId }
    const answersMap = {};
    if (Array.isArray(answers)) {
      answers.forEach((ans) => {
        const qId = ans.questionId || ans.question_id;
        const optId = ans.optionId || ans.option_id || ans.selectedOptionId;
        if (qId) answersMap[qId] = optId;
      });
    } else {
      Object.assign(answersMap, answers);
    }

    let correctCount = 0;
    const questions = fullQuiz.questions || [];
    const totalCount = questions.length;
    const detailedAnswers = [];

    questions.forEach((q) => {
      const selectedOptionId = answersMap[q.id];
      const correctOption = (q.options || []).find((opt) => opt.is_correct);
      const isCorrect = Boolean(
        selectedOptionId && correctOption && selectedOptionId === correctOption.id
      );

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
    const passed = score >= (fullQuiz.passing_score || 70);
    const attemptId = `att-${Date.now()}`;
    const completedAt = new Date().toISOString();

    const attempt = {
      id: attemptId,
      quiz_id: fullQuiz.id,
      user_id: userId,
      score,
      correctCount,
      totalCount,
      passed,
      detailedAnswers,
      completed_at: completedAt,
    };

    if (isDbConnected()) {
      await pool.query(
        `INSERT INTO quiz_attempts (id, quiz_id, user_id, score, passed, completed_at)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [attemptId, fullQuiz.id, userId, score, passed, completedAt]
      );

      for (const ans of detailedAnswers) {
        if (ans.selected_option_id) {
          await pool.query(
            `INSERT INTO quiz_answers (id, attempt_id, question_id, selected_option_id, is_correct)
             VALUES ($1, $2, $3, $4, $5)`,
            [`ans-${Date.now()}-${Math.random()}`, attemptId, ans.question_id, ans.selected_option_id, ans.is_correct]
          );
        }
      }
    }

    inMemoryAttempts.push(attempt);
    return attempt;
  },

  // Get attempts for user
  async getUserAttempts(quizId, userId) {
    if (isDbConnected()) {
      const result = await pool.query(
        `SELECT * FROM quiz_attempts WHERE quiz_id = $1 AND user_id = $2 ORDER BY completed_at DESC`,
        [quizId, userId]
      );
      return result.rows;
    }
    return inMemoryAttempts.filter((a) => a.quiz_id === quizId && a.user_id === userId);
  },

  // Save Quiz (Admin)
  async saveQuiz(quizData) {
    const quizId = quizData.id || `quiz-${Date.now()}`;

    if (isDbConnected()) {
      await pool.query(
        `INSERT INTO quizzes (id, lesson_id, course_id, title, passing_score)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO UPDATE
         SET title = EXCLUDED.title,
             passing_score = EXCLUDED.passing_score`,
        [quizId, quizData.lessonId || null, quizData.courseId || null, quizData.title, quizData.passingScore || 70]
      );

      // Re-insert questions & options
      await pool.query(`DELETE FROM quiz_questions WHERE quiz_id = $1`, [quizId]);

      for (const [qIdx, q] of (quizData.questions || []).entries()) {
        const qId = q.id || `q-${Date.now()}-${qIdx}`;
        await pool.query(
          `INSERT INTO quiz_questions (id, quiz_id, question, order_index)
           VALUES ($1, $2, $3, $4)`,
          [qId, quizId, q.question, qIdx + 1]
        );

        for (const [optIdx, opt] of (q.options || []).entries()) {
          const optId = opt.id || `opt-${Date.now()}-${optIdx}`;
          await pool.query(
            `INSERT INTO quiz_options (id, question_id, option_text, is_correct, order_index)
             VALUES ($1, $2, $3, $4, $5)`,
            [optId, qId, opt.option_text || opt.text, opt.is_correct || false, optIdx + 1]
          );
        }
      }
    }

    const idx = inMemoryQuizzes.findIndex((q) => q.id === quizId);
    const formatted = { id: quizId, ...quizData };
    if (idx !== -1) inMemoryQuizzes[idx] = formatted;
    else inMemoryQuizzes.push(formatted);
    return formatted;
  },

  seedQuiz(quiz) {
    const idx = inMemoryQuizzes.findIndex((q) => q.id === quiz.id);
    if (idx !== -1) inMemoryQuizzes[idx] = quiz;
    else inMemoryQuizzes.push(quiz);
  },
};
