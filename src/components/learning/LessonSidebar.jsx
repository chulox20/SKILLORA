import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Video,
  FileText,
  HelpCircle,
  CheckCircle2,
  Circle,
  Award,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { ProgressBar } from '../common/ProgressBar';

export function LessonSidebar({
  course,
  modules = [],
  activeLessonId,
  completedLessonIds = [],
  onSelectLesson,
  progressPercentage = 0,
}) {
  const [openModuleIds, setOpenModuleIds] = useState(
    modules.map((m) => m.id) // Open all modules by default in classroom
  );

  const toggleModule = (id) => {
    setOpenModuleIds((prev) =>
      prev.includes(id) ? prev.filter((mId) => mId !== id) : [...prev, id]
    );
  };

  const getLessonIcon = (type, isCompleted) => {
    if (isCompleted) {
      return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
    }
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4 text-blue-400 shrink-0" />;
      case 'article':
        return <FileText className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'quiz':
        return <HelpCircle className="w-4 h-4 text-purple-400 shrink-0" />;
      default:
        return <Circle className="w-4 h-4 text-slate-500 shrink-0" />;
    }
  };

  const totalLessons = modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);
  const completedCount = completedLessonIds.length;

  return (
    <div className="w-full h-full bg-slate-900/90 border-l border-slate-800 flex flex-col justify-between overflow-hidden">
      {/* Sidebar Header & Overall Progress */}
      <div className="p-5 border-b border-slate-800 space-y-3 shrink-0">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-brand-400" />
          <h3 className="text-sm font-bold text-white truncate">{course?.title}</h3>
        </div>
        <div>
          <ProgressBar progress={progressPercentage} size="sm" />
          <p className="text-[11px] text-slate-400 mt-1.5 flex items-center justify-between">
            <span>{completedCount} de {totalLessons} lecciones</span>
            <span className="font-semibold text-slate-300">{progressPercentage}% completado</span>
          </p>
        </div>
      </div>

      {/* Modules & Lessons Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 divide-y divide-slate-800/40">
        {modules.map((mod, mIdx) => {
          const isOpen = openModuleIds.includes(mod.id);
          const modLessons = mod.lessons || [];

          return (
            <div key={mod.id || mIdx} className="pt-2 first:pt-0">
              <button
                onClick={() => toggleModule(mod.id)}
                className="w-full flex items-center justify-between py-2 px-2 text-left rounded-xl hover:bg-slate-800/60 transition group"
              >
                <div className="pr-2">
                  <span className="text-[10px] font-bold text-brand-400 uppercase tracking-wider block">
                    Módulo {mIdx + 1}
                  </span>
                  <h4 className="text-xs font-bold text-slate-200 group-hover:text-white line-clamp-1">
                    {mod.title}
                  </h4>
                </div>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-slate-500 group-hover:text-slate-300"
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-1 space-y-1 pl-1"
                  >
                    {modLessons.map((les) => {
                      const isCompleted = completedLessonIds.includes(les.id);
                      const isActive = activeLessonId === les.id;

                      return (
                        <button
                          key={les.id}
                          onClick={() => onSelectLesson(les)}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition text-xs ${
                            isActive
                              ? 'bg-brand-600/20 text-brand-300 font-bold border border-brand-500/40 shadow-sm'
                              : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            {getLessonIcon(les.type, isCompleted)}
                            <span className="truncate">{les.title}</span>
                          </div>

                          <span className="text-[10px] text-slate-500 shrink-0">
                            {les.duration || '15m'}
                          </span>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
