import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedOptionId,
  onSelectOption,
}) {
  const letters = ['A', 'B', 'C', 'D', 'E'];

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Question Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold text-brand-400 uppercase tracking-wider bg-brand-500/10 px-2.5 py-1 rounded-full border border-brand-500/20">
            Pregunta {questionNumber} de {totalQuestions}
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
          {question.question}
        </h3>
      </div>

      {/* Options List */}
      <div className="space-y-3">
        {question.options.map((option, idx) => {
          const isSelected = selectedOptionId === option.id;

          return (
            <motion.button
              key={option.id}
              type="button"
              onClick={() => onSelectOption(option.id)}
              whileHover={{ scale: 1.005 }}
              whileTap={{ scale: 0.995 }}
              className={`w-full flex items-center justify-between p-4 sm:p-5 rounded-2xl border text-left transition-all duration-200 ${
                isSelected
                  ? 'bg-brand-600/15 border-brand-500 text-white shadow-lg shadow-brand-950/40 ring-1 ring-brand-500'
                  : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <div className="flex items-center gap-4 min-w-0 pr-4">
                <span
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition ${
                    isSelected
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {letters[idx] || idx + 1}
                </span>
                <span className="text-sm sm:text-base font-medium leading-relaxed">
                  {option.option_text || option.text}
                </span>
              </div>

              <div className="shrink-0">
                {isSelected ? (
                  <CheckCircle2 className="w-5 h-5 text-brand-400" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-600" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
