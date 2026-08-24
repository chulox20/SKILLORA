import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Send,
  Sparkles,
  Award,
  AlertCircle,
} from 'lucide-react';
import { QuestionCard } from './QuestionCard';
import { QuizResultsModal } from './QuizResultsModal';
import { Button } from '../common/Button';
import { ProgressBar } from '../common/ProgressBar';
import { quizService } from '../../services/quizService';
import { certificateService } from '../../services/certificateService';
import { useAuth } from '../../contexts/AuthContext';
import { triggerCelebrationConfetti } from '../../utils/certificateGenerator';
import { useNotification } from '../../contexts/NotificationContext';

export function QuizView({ quiz, courseId, onCompleted }) {
  const { user } = useAuth();
  const toast = useNotification();
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [showResultsModal, setShowResultsModal] = useState(false);

  const questions = quiz?.questions || [];
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];

  const handleSelectOption = (optionId) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  const handleSubmit = async () => {
    if (answeredCount < totalQuestions) {
      toast.warning('Preguntas pendientes', 'Por favor responde todas las preguntas antes de enviar.');
      return;
    }

    setIsSubmitting(true);
    try {
      const attemptResult = await quizService.submitAttempt(quiz.id, user.id, answers);
      setResult(attemptResult);
      setShowResultsModal(true);

      if (attemptResult.passed) {
        triggerCelebrationConfetti();
        // Generate certificate automatically
        if (courseId) {
          await certificateService.issueCertificate(user.id, courseId);
        }
        if (onCompleted) onCompleted(attemptResult);
      }
    } catch (err) {
      toast.error('Error al enviar la evaluación', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setCurrentIndex(0);
    setResult(null);
    setShowResultsModal(false);
  };

  const handleViewCertificate = async () => {
    setShowResultsModal(false);
    if (courseId) {
      const cert = await certificateService.getCertificate(user.id, courseId);
      if (cert) {
        navigate(`/certificates/${cert.certificate_code}`);
      } else {
        navigate('/dashboard/certificates');
      }
    }
  };

  if (!quiz || totalQuestions === 0) {
    return (
      <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-3xl">
        <p className="text-slate-400">Esta evaluación aún no contiene preguntas.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 backdrop-blur-md max-w-3xl mx-auto shadow-2xl space-y-8">
      {/* Quiz Top Header & Progress */}
      <div className="space-y-3 pb-6 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-brand-400">
            <HelpCircle className="w-5 h-5" />
            <h2 className="text-lg font-bold text-white">{quiz.title}</h2>
          </div>
          <span className="text-xs text-slate-400 font-semibold">
            Mínimo para aprobar: <strong className="text-brand-400">{quiz.passing_score || 70}%</strong>
          </span>
        </div>

        <ProgressBar progress={progressPercent} size="sm" />
      </div>

      {/* Current Question */}
      <AnimatePresence mode="wait">
        {currentQuestion && (
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            questionNumber={currentIndex + 1}
            totalQuestions={totalQuestions}
            selectedOptionId={answers[currentQuestion.id]}
            onSelectOption={handleSelectOption}
          />
        )}
      </AnimatePresence>

      {/* Stepper Navigation Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-800">
        <Button
          onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
          disabled={currentIndex === 0}
          variant="secondary"
          size="sm"
          icon={ChevronLeft}
        >
          Anterior
        </Button>

        {currentIndex === totalQuestions - 1 ? (
          <Button
            onClick={handleSubmit}
            isLoading={isSubmitting}
            variant="success"
            size="md"
            iconRight={Send}
          >
            Enviar Evaluación Final
          </Button>
        ) : (
          <Button
            onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, totalQuestions - 1))}
            disabled={!answers[currentQuestion?.id]}
            variant="primary"
            size="sm"
            iconRight={ChevronRight}
          >
            Siguiente
          </Button>
        )}
      </div>

      {/* Results Modal */}
      <QuizResultsModal
        isOpen={showResultsModal}
        onClose={() => setShowResultsModal(false)}
        result={result}
        onRetry={handleRetry}
        onViewCertificate={handleViewCertificate}
        passingScore={quiz.passing_score || 70}
      />
    </div>
  );
}
