import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Video,
  FileText,
  HelpCircle,
  CheckCircle2,
  Lock,
  PlayCircle,
} from 'lucide-react';

export function CourseCurriculum({
  modules = [],
  completedLessonIds = [],
  isEnrolled = false,
  onSelectLesson,
  activeLessonId,
}) {
  // Keep first module open by default
  const [openModuleIds, setOpenModuleIds] = useState(
    modules.length > 0 ? [modules[0].id] : []
  );

  const toggleModule = (moduleId) => {
    setOpenModuleIds((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const getLessonIcon = (type) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4 text-blue-400" />;
      case 'article':
        return <FileText className="w-4 h-4 text-emerald-400" />;
      case 'quiz':
        return <HelpCircle className="w-4 h-4 text-purple-400" />;
      default:
        return <PlayCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  if (!modules || modules.length === 0) {
    return (
      <div className="p-6 bg-slate-900/40 rounded-2xl border border-slate-800 text-center text-sm text-slate-400">
        El temario de este curso se publicará próximamente.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {modules.map((module, idx) => {
        const isOpen = openModuleIds.includes(module.id);
        const moduleLessons = module.lessons || [];
        const completedCount = moduleLessons.filter((l) =>
          completedLessonIds.includes(l.id)
        ).length;

        return (
          <div
            key={module.id || idx}
            className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm transition-all"
          >
            {/* Module Accordion Header */}
            <button
              onClick={() => toggleModule(module.id)}
              className="w-full flex items-center justify-between p-5 text-left bg-slate-900/80 hover:bg-slate-850 transition"
            >
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">
                    Módulo {idx + 1}
                  </span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs text-slate-400">
                    {moduleLessons.length} {moduleLessons.length === 1 ? 'lección' : 'lecciones'}
                  </span>
                  {completedCount > 0 && (
                    <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      {completedCount}/{moduleLessons.length} completadas
                    </span>
                  )}
                </div>
                <h4 className="text-base font-bold text-slate-100 mt-1">{module.title}</h4>
                {module.description && (
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{module.description}</p>
                )}
              </div>

              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="p-1 rounded-lg text-slate-400"
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </button>

            {/* Lessons List */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-slate-800 divide-y divide-slate-800/60"
                >
                  {moduleLessons.map((lesson, lIdx) => {
                    const isCompleted = completedLessonIds.includes(lesson.id);
                    const isActive = activeLessonId === lesson.id;

                    return (
                      <div
                        key={lesson.id || lIdx}
                        onClick={() => onSelectLesson && onSelectLesson(lesson)}
                        className={`flex items-center justify-between p-4 px-6 text-sm transition ${
                          onSelectLesson ? 'cursor-pointer hover:bg-slate-800/60' : ''
                        } ${isActive ? 'bg-brand-950/40 border-l-4 border-l-brand-500' : ''}`}
                      >
                        <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-4">
                          <div className="w-8 h-8 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              getLessonIcon(lesson.type)
                            )}
                          </div>
                          <div className="truncate">
                            <h5
                              className={`text-xs font-semibold truncate ${
                                isActive
                                  ? 'text-brand-400 font-bold'
                                  : isCompleted
                                  ? 'text-slate-300'
                                  : 'text-slate-200'
                              }`}
                            >
                              {lesson.title}
                            </h5>
                            <span className="text-[11px] text-slate-500 capitalize">
                              {lesson.type === 'video'
                                ? 'Video'
                                : lesson.type === 'article'
                                ? 'Artículo'
                                : 'Quiz interactivo'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-400 shrink-0">
                          <span>{lesson.duration || '15 min'}</span>
                          {isCompleted && (
                            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                              ✓
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
