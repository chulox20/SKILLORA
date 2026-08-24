import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, HelpCircle } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export function QuizBuilderModal({ isOpen, onClose, quiz = null, onSave }) {
  const [title, setTitle] = useState('');
  const [passingScore, setPassingScore] = useState(70);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (quiz) {
      setTitle(quiz.title || '');
      setPassingScore(quiz.passing_score || 70);
      setQuestions(quiz.questions || []);
    } else {
      setTitle('Evaluación del Módulo');
      setPassingScore(70);
      setQuestions([
        {
          id: `q-${Date.now()}-1`,
          question: '¿Cuál es el concepto principal?',
          options: [
            { id: `opt-1`, option_text: 'Opción A', is_correct: true },
            { id: `opt-2`, option_text: 'Opción B', is_correct: false },
            { id: `opt-3`, option_text: 'Opción C', is_correct: false },
            { id: `opt-4`, option_text: 'Opción D', is_correct: false },
          ],
        },
      ]);
    }
  }, [quiz, isOpen]);

  const handleAddQuestion = () => {
    const newQ = {
      id: `q-${Date.now()}`,
      question: 'Nueva pregunta...',
      options: [
        { id: `opt-${Date.now()}-1`, option_text: 'Opción 1', is_correct: true },
        { id: `opt-${Date.now()}-2`, option_text: 'Opción 2', is_correct: false },
      ],
    };
    setQuestions([...questions, newQ]);
  };

  const handleQuestionChange = (qId, text) => {
    setQuestions(
      questions.map((q) => (q.id === qId ? { ...q, question: text } : q))
    );
  };

  const handleDeleteQuestion = (qId) => {
    setQuestions(questions.filter((q) => q.id !== qId));
  };

  const handleOptionChange = (qId, optId, text) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== qId) return q;
        return {
          ...q,
          options: q.options.map((opt) =>
            opt.id === optId ? { ...opt, option_text: text } : opt
          ),
        };
      })
    );
  };

  const handleSetCorrectOption = (qId, optId) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== qId) return q;
        return {
          ...q,
          options: q.options.map((opt) => ({
            ...opt,
            is_correct: opt.id === optId,
          })),
        };
      })
    );
  };

  const handleAddOption = (qId) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== qId) return q;
        return {
          ...q,
          options: [
            ...q.options,
            { id: `opt-${Date.now()}`, option_text: 'Nueva opción', is_correct: false },
          ],
        };
      })
    );
  };

  const handleDeleteOption = (qId, optId) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== qId) return q;
        return {
          ...q,
          options: q.options.filter((opt) => opt.id !== optId),
        };
      })
    );
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSave({
      id: quiz?.id || `quiz-${Date.now()}`,
      title,
      passing_score: Number(passingScore),
      questions,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-3xl"
      title={quiz ? 'Editar Quiz' : 'Nuevo Quiz'}
      subtitle="Define preguntas, respuestas de opción múltiple y el puntaje mínimo de aprobación"
    >
      <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-2">
        {/* Quiz General Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Título de la Evaluación *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Puntaje Mínimo (%) *
            </label>
            <input
              type="number"
              min="10"
              max="100"
              value={passingScore}
              onChange={(e) => setPassingScore(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-brand-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Questions Editor */}
        <div className="space-y-5 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-purple-400" />
              Preguntas ({questions.length})
            </h4>
            <Button onClick={handleAddQuestion} variant="secondary" size="sm" icon={Plus}>
              Añadir Pregunta
            </Button>
          </div>

          {questions.map((q, qIdx) => (
            <div
              key={q.id}
              className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-4"
            >
              <div className="flex items-start gap-3 justify-between">
                <span className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 font-bold text-xs flex items-center justify-center shrink-0 border border-purple-500/20">
                  {qIdx + 1}
                </span>
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) => handleQuestionChange(q.id, e.target.value)}
                  placeholder="Escribe el enunciado de la pregunta..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:border-purple-500 focus:outline-none"
                />
                <button
                  onClick={() => handleDeleteQuestion(q.id)}
                  className="p-2 text-rose-400 hover:bg-rose-950/30 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Options */}
              <div className="pl-10 space-y-2">
                <p className="text-[11px] text-slate-400 font-medium">
                  Marca la opción correcta con el botón circular verde:
                </p>
                {q.options.map((opt) => (
                  <div key={opt.id} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSetCorrectOption(q.id, opt.id)}
                      className={`p-1.5 rounded-lg transition ${
                        opt.is_correct
                          ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'
                          : 'text-slate-600 hover:text-slate-400'
                      }`}
                      title={opt.is_correct ? 'Respuesta correcta ✓' : 'Marcar como correcta'}
                    >
                      {opt.is_correct ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>

                    <input
                      type="text"
                      value={opt.option_text || opt.text}
                      onChange={(e) => handleOptionChange(q.id, opt.id, e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:border-purple-500 focus:outline-none"
                    />

                    {q.options.length > 2 && (
                      <button
                        onClick={() => handleDeleteOption(q.id, opt.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  onClick={() => handleAddOption(q.id)}
                  className="text-xs text-purple-400 hover:underline pt-1 block"
                >
                  + Agregar otra opción
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <Button onClick={onClose} variant="secondary" size="sm">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} variant="primary" size="sm">
            Guardar Evaluación
          </Button>
        </div>
      </div>
    </Modal>
  );
}
