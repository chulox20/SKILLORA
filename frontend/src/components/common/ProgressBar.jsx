import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export function ProgressBar({
  progress = 0,
  showLabel = true,
  size = 'md',
  className = '',
  color = 'brand',
}) {
  const clampedProgress = Math.min(Math.max(Math.round(progress), 0), 100);
  const isComplete = clampedProgress === 100;

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const getBarColor = () => {
    if (isComplete) return 'bg-emerald-500 shadow-glow-success';
    if (color === 'emerald') return 'bg-emerald-500';
    return 'bg-gradient-to-r from-brand-600 to-blue-400';
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            {isComplete ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> ¡Completado!
              </span>
            ) : (
              'Progreso del curso'
            )}
          </span>
          <span className={`font-bold ${isComplete ? 'text-emerald-400' : 'text-slate-200'}`}>
            {clampedProgress}%
          </span>
        </div>
      )}
      <div className={`w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50 ${heights[size]}`}>
        <motion.div
          className={`h-full rounded-full ${getBarColor()}`}
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
