import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, AlertCircle, Sparkles, FolderSearch } from 'lucide-react';
import { Button } from './Button';

export function EmptyState({
  icon: Icon = BookOpen,
  title = 'No hay contenido disponible',
  description = 'No se encontraron registros en esta sección.',
  actionText,
  onAction,
  actionIcon,
  className = '',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`text-center py-16 px-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl flex flex-col items-center justify-center ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 mb-4 shadow-glow">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-100 mb-2">{title}</h3>
      <p className="text-slate-400 max-w-md text-sm mb-6 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} variant="primary" icon={actionIcon}>
          {actionText}
        </Button>
      )}
    </motion.div>
  );
}

export function ErrorState({
  title = 'No pudimos cargar este contenido',
  description = 'Ocurrió un error inesperado al consultar los datos. Por favor, intenta de nuevo.',
  onRetry,
}) {
  return (
    <div className="text-center py-16 px-6 bg-rose-950/20 border border-rose-900/30 rounded-2xl flex flex-col items-center justify-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-100 mb-2">{title}</h3>
      <p className="text-slate-400 max-w-md text-sm mb-6">{description}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="secondary">
          Intentar nuevamente
        </Button>
      )}
    </div>
  );
}
