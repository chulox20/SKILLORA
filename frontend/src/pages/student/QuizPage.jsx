import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizService } from '../../services/quizService';
import { QuizView } from '../../components/quizzes/QuizView';
import { Skeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';

export function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQuiz() {
      setLoading(true);
      try {
        const fetched = (await quizService.getQuizById(id)) || (await quizService.getQuizById('quiz-react-1'));
        setQuiz(fetched);
      } catch (err) {
        console.error('Error loading quiz:', err);
      } finally {
        setLoading(false);
      }
    }
    loadQuiz();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 space-y-6">
        <Skeleton className="w-full h-80 rounded-3xl" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4">
        <EmptyState
          title="Quiz no encontrado"
          description="La evaluación solicitada no existe o ha expirado."
          actionText="Volver a mis cursos"
          onAction={() => navigate('/dashboard/courses')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
      <QuizView quiz={quiz} courseId={quiz.course_id || 'course-1'} />
    </div>
  );
}
