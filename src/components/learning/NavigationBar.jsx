import React from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, Award, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';

export function NavigationBar({
  hasPrevious,
  hasNext,
  isLastLesson,
  isCompleted,
  onPrevious,
  onNext,
  onToggleComplete,
  onStartQuiz,
  isToggling = false,
}) {
  return (
    <div className="bg-slate-900/80 backdrop-blur-md border-t border-slate-800 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Previous Button */}
      <div className="w-full sm:w-auto flex justify-start">
        <Button
          onClick={onPrevious}
          disabled={!hasPrevious}
          variant="secondary"
          size="sm"
          icon={ChevronLeft}
        >
          Anterior
        </Button>
      </div>

      {/* Complete Status / Toggle Button */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
        <Button
          onClick={onToggleComplete}
          isLoading={isToggling}
          variant={isCompleted ? 'success' : 'primary'}
          size="sm"
          icon={CheckCircle2}
        >
          {isCompleted ? 'Lección Completada ✓' : 'Marcar como completada'}
        </Button>
      </div>

      {/* Next or Quiz Evaluation Button */}
      <div className="w-full sm:w-auto flex justify-end">
        {isLastLesson ? (
          <Button
            onClick={onStartQuiz || onNext}
            variant="success"
            size="sm"
            iconRight={Award}
          >
            Realizar evaluación
          </Button>
        ) : (
          <Button
            onClick={onNext}
            disabled={!hasNext}
            variant="secondary"
            size="sm"
            iconRight={ChevronRight}
          >
            Siguiente
          </Button>
        )}
      </div>
    </div>
  );
}
