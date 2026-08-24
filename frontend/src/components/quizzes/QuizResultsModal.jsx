import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  Award,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export function QuizResultsModal({
  isOpen,
  onClose,
  result,
  onRetry,
  onViewCertificate,
  passingScore = 70,
}) {
  if (!result) return null;

  const { score, correctCount, totalCount, passed, detailedAnswers } = result;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-2xl"
      title="Resultados de la Evaluación"
      subtitle="Revisa tu rendimiento y respuestas detalladas"
    >
      <div className="space-y-6">
        {/* Score Hero Summary */}
        <div
          className={`p-6 rounded-3xl border text-center relative overflow-hidden ${
            passed
              ? 'bg-emerald-950/30 border-emerald-500/30 shadow-xl shadow-emerald-950/30'
              : 'bg-rose-950/30 border-rose-500/30 shadow-xl shadow-rose-950/30'
          }`}
        >
          <div className="relative z-10 space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
              {passed ? (
                <Award className="w-8 h-8 text-emerald-400" />
              ) : (
                <XCircle className="w-8 h-8 text-rose-400" />
              )}
            </div>

            <h3 className="text-3xl font-black text-white">
              {score}%
            </h3>

            <p className="text-sm font-semibold text-slate-300">
              {correctCount} de {totalCount} respuestas correctas
            </p>

            <div className="pt-1">
              {passed ? (
                <Badge variant="success" size="lg" icon={Sparkles}>
                  ✓ EVALUACIÓN APROBADA (Mínimo {passingScore}%)
                </Badge>
              ) : (
                <Badge variant="danger" size="lg">
                  ✕ NO APROBADA (Se requiere mínimo {passingScore}%)
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Breakdown of each question */}
        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Desglose de Preguntas
          </h4>

          {detailedAnswers?.map((item, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                item.is_correct
                  ? 'bg-slate-900/60 border-emerald-500/20'
                  : 'bg-slate-900/60 border-rose-500/20'
              }`}
            >
              <div className="flex items-start gap-2 justify-between">
                <span className="font-semibold text-slate-200">
                  {idx + 1}. {item.question_text}
                </span>
                {item.is_correct ? (
                  <span className="text-emerald-400 font-bold shrink-0 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Correcta
                  </span>
                ) : (
                  <span className="text-rose-400 font-bold shrink-0 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Incorrecta
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-800">
          {passed ? (
            <Button
              onClick={onViewCertificate}
              variant="success"
              className="w-full justify-center"
              icon={Sparkles}
              iconRight={ArrowRight}
            >
              Obtener Mi Certificado Oficial
            </Button>
          ) : (
            <Button
              onClick={onRetry}
              variant="primary"
              className="w-full justify-center"
              icon={RotateCcw}
            >
              Repetir Evaluación
            </Button>
          )}

          <Button onClick={onClose} variant="secondary" className="w-full sm:w-auto">
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
