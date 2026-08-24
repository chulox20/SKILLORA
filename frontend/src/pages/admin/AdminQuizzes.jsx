import React, { useState, useEffect } from 'react';
import { Plus, HelpCircle, Edit2, Trash2, CheckCircle2, Award } from 'lucide-react';
import { quizService } from '../../services/quizService';
import { getLocalItem, setLocalItem, STORAGE_KEYS } from '../../services/storageHelper';
import { INITIAL_QUIZZES } from '../../lib/initialData';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { QuizBuilderModal } from '../../components/admin/QuizBuilderModal';
import { useNotification } from '../../contexts/NotificationContext';

export function AdminQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toast = useNotification();

  const loadQuizzes = () => {
    const data = getLocalItem(STORAGE_KEYS.QUIZZES, INITIAL_QUIZZES);
    setQuizzes(data);
  };

  useEffect(() => {
    loadQuizzes();
  }, []);

  const handleSaveQuiz = async (quizData) => {
    await quizService.saveQuiz(quizData);
    toast.success('Quiz guardado', 'La evaluación ha sido actualizada exitosamente.');
    loadQuizzes();
  };

  const handleDeleteQuiz = (id) => {
    if (confirm('¿Eliminar esta evaluación?')) {
      const updated = quizzes.filter((q) => q.id !== id);
      setLocalItem(STORAGE_KEYS.QUIZZES, updated);
      setQuizzes(updated);
      toast.info('Evaluación eliminada', 'El quiz fue removido.');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Gestión de Quizzes y Evaluaciones
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Crea y administra los cuestionarios requeridos para la emisión de certificados.
          </p>
        </div>

        <Button
          onClick={() => {
            setSelectedQuiz(null);
            setIsModalOpen(true);
          }}
          variant="primary"
          size="sm"
          className="bg-purple-600 hover:bg-purple-500 border-purple-500/30"
          icon={Plus}
        >
          Nuevo Quiz
        </Button>
      </div>

      {/* Quizzes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 space-y-4 flex flex-col justify-between backdrop-blur-md"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <Badge variant="purple" size="sm">
                  Puntaje mín: {quiz.passing_score || 70}%
                </Badge>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{quiz.title}</h3>
                <p className="text-xs text-slate-400 mt-1">
                  {quiz.questions?.length || 0} preguntas de opción múltiple
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
              <Button
                onClick={() => {
                  setSelectedQuiz(quiz);
                  setIsModalOpen(true);
                }}
                variant="secondary"
                size="sm"
                className="text-xs"
                icon={Edit2}
              >
                Editar Preguntas
              </Button>
              <button
                onClick={() => handleDeleteQuiz(quiz.id)}
                className="p-2 rounded-xl text-rose-400 hover:bg-rose-950/30 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quiz Builder Modal */}
      <QuizBuilderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        quiz={selectedQuiz}
        onSave={handleSaveQuiz}
      />
    </div>
  );
}
