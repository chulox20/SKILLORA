import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  Edit2,
  Video,
  FileText,
  HelpCircle,
  ChevronDown,
  Layers,
  Save,
  X,
} from 'lucide-react';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';

export function ModuleLessonEditor({ modules = [], onChange }) {
  const [editingModule, setEditingModule] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [selectedModuleIdForLesson, setSelectedModuleIdForLesson] = useState(null);
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);

  // Form states for Module
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleDescription, setModuleDescription] = useState('');

  // Form states for Lesson
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonSlug, setLessonSlug] = useState('');
  const [lessonType, setLessonType] = useState('video');
  const [lessonVideoUrl, setLessonVideoUrl] = useState('');
  const [lessonContent, setLessonContent] = useState('');
  const [lessonDuration, setLessonDuration] = useState('15 min');

  // Open Module Modal
  const handleOpenModuleModal = (mod = null) => {
    if (mod) {
      setEditingModule(mod);
      setModuleTitle(mod.title);
      setModuleDescription(mod.description || '');
    } else {
      setEditingModule(null);
      setModuleTitle('');
      setModuleDescription('');
    }
    setIsModuleModalOpen(true);
  };

  // Save Module
  const handleSaveModule = () => {
    if (!moduleTitle.trim()) return;

    let updatedModules;
    if (editingModule) {
      updatedModules = modules.map((m) =>
        m.id === editingModule.id
          ? { ...m, title: moduleTitle, description: moduleDescription }
          : m
      );
    } else {
      const newMod = {
        id: `mod-${Date.now()}`,
        title: moduleTitle,
        description: moduleDescription,
        order_index: modules.length + 1,
        lessons: [],
      };
      updatedModules = [...modules, newMod];
    }

    onChange(updatedModules);
    setIsModuleModalOpen(false);
  };

  // Delete Module
  const handleDeleteModule = (moduleId) => {
    if (confirm('¿Eliminar este módulo y todas sus lecciones?')) {
      const updated = modules.filter((m) => m.id !== moduleId);
      onChange(updated);
    }
  };

  // Open Lesson Modal
  const handleOpenLessonModal = (moduleId, les = null) => {
    setSelectedModuleIdForLesson(moduleId);
    if (les) {
      setEditingLesson(les);
      setLessonTitle(les.title);
      setLessonSlug(les.slug);
      setLessonType(les.type || 'video');
      setLessonVideoUrl(les.video_url || '');
      setLessonContent(les.content || '');
      setLessonDuration(les.duration || '15 min');
    } else {
      setEditingLesson(null);
      setLessonTitle('');
      setLessonSlug('');
      setLessonType('video');
      setLessonVideoUrl('https://www.youtube.com/watch?v=w7ejDZ8SWv8');
      setLessonContent('');
      setLessonDuration('15 min');
    }
    setIsLessonModalOpen(true);
  };

  // Save Lesson
  const handleSaveLesson = () => {
    if (!lessonTitle.trim()) return;

    const slug =
      lessonSlug.trim() ||
      lessonTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const updatedModules = modules.map((m) => {
      if (m.id !== selectedModuleIdForLesson) return m;

      const lessons = m.lessons || [];
      let updatedLessons;

      if (editingLesson) {
        updatedLessons = lessons.map((l) =>
          l.id === editingLesson.id
            ? {
                ...l,
                title: lessonTitle,
                slug,
                type: lessonType,
                video_url: lessonVideoUrl,
                content: lessonContent,
                duration: lessonDuration,
              }
            : l
        );
      } else {
        const newLes = {
          id: `les-${Date.now()}`,
          module_id: m.id,
          title: lessonTitle,
          slug,
          type: lessonType,
          video_url: lessonVideoUrl,
          content: lessonContent,
          duration: lessonDuration,
          order_index: lessons.length + 1,
        };
        updatedLessons = [...lessons, newLes];
      }

      return { ...m, lessons: updatedLessons };
    });

    onChange(updatedModules);
    setIsLessonModalOpen(false);
  };

  // Delete Lesson
  const handleDeleteLesson = (moduleId, lessonId) => {
    const updatedModules = modules.map((m) => {
      if (m.id !== moduleId) return m;
      return {
        ...m,
        lessons: (m.lessons || []).filter((l) => l.id !== lessonId),
      };
    });
    onChange(updatedModules);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white">Estructura del Curso (Temario)</h3>
          <p className="text-xs text-slate-400">
            Organiza módulos y lecciones (videos, artículos o quizzes interactivos)
          </p>
        </div>
        <Button
          onClick={() => handleOpenModuleModal()}
          variant="secondary"
          size="sm"
          icon={Plus}
        >
          Agregar Módulo
        </Button>
      </div>

      {/* Modules List */}
      {modules.length === 0 ? (
        <div className="p-8 text-center bg-slate-900/40 border border-slate-800 border-dashed rounded-2xl">
          <Layers className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-sm text-slate-400">Aún no has agregado módulos a este curso.</p>
          <Button
            onClick={() => handleOpenModuleModal()}
            variant="ghost"
            size="sm"
            className="mt-3 text-brand-400"
          >
            + Crear primer módulo
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {modules.map((mod, idx) => (
            <div
              key={mod.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-4 space-y-3"
            >
              {/* Module Bar */}
              <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold px-2 py-1 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20">
                    Módulo {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white">{mod.title}</h4>
                    {mod.description && (
                      <p className="text-xs text-slate-400">{mod.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleOpenLessonModal(mod.id)}
                    variant="ghost"
                    size="sm"
                    className="text-emerald-400 text-xs py-1"
                    icon={Plus}
                  >
                    Lección
                  </Button>
                  <button
                    onClick={() => handleOpenModuleModal(mod)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteModule(mod.id)}
                    className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Lessons within module */}
              <div className="pl-4 space-y-2">
                {(mod.lessons || []).map((les, lIdx) => (
                  <div
                    key={les.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-200"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <span className="text-slate-500 font-mono text-[10px]">
                        {(lIdx + 1).toString().padStart(2, '0')}
                      </span>
                      {les.type === 'video' && <Video className="w-3.5 h-3.5 text-blue-400" />}
                      {les.type === 'article' && (
                        <FileText className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                      {les.type === 'quiz' && (
                        <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
                      )}
                      <span className="font-medium truncate">{les.title}</span>
                      <span className="text-[10px] text-slate-500 font-normal">
                        ({les.duration || '15 min'})
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleOpenLessonModal(mod.id, les)}
                        className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteLesson(mod.id, les.id)}
                        className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}

                {(!mod.lessons || mod.lessons.length === 0) && (
                  <p className="text-xs text-slate-500 italic py-1">
                    No hay lecciones en este módulo.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Module Modal */}
      <Modal
        isOpen={isModuleModalOpen}
        onClose={() => setIsModuleModalOpen(false)}
        title={editingModule ? 'Editar Módulo' : 'Nuevo Módulo'}
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Título del Módulo *
            </label>
            <input
              type="text"
              value={moduleTitle}
              onChange={(e) => setModuleTitle(e.target.value)}
              placeholder="Ej. Módulo 1 — Fundamentos"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Descripción Corta
            </label>
            <textarea
              value={moduleDescription}
              onChange={(e) => setModuleDescription(e.target.value)}
              placeholder="Breve introducción de los temas del módulo"
              rows={2}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <Button onClick={() => setIsModuleModalOpen(false)} variant="secondary" size="sm">
              Cancelar
            </Button>
            <Button onClick={handleSaveModule} variant="primary" size="sm">
              Guardar Módulo
            </Button>
          </div>
        </div>
      </Modal>

      {/* Lesson Modal */}
      <Modal
        isOpen={isLessonModalOpen}
        onClose={() => setIsLessonModalOpen(false)}
        title={editingLesson ? 'Editar Lección' : 'Nueva Lección'}
        maxWidth="max-w-xl"
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Título de la Lección *
            </label>
            <input
              type="text"
              value={lessonTitle}
              onChange={(e) => setLessonTitle(e.target.value)}
              placeholder="Ej. 01 Introducción a React"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Tipo de Lección *
              </label>
              <select
                value={lessonType}
                onChange={(e) => setLessonType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-brand-500 focus:outline-none"
              >
                <option value="video">Video</option>
                <option value="article">Artículo de lectura</option>
                <option value="quiz">Quiz / Evaluación</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Duración Estimada *
              </label>
              <input
                type="text"
                value={lessonDuration}
                onChange={(e) => setLessonDuration(e.target.value)}
                placeholder="15 min"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {lessonType === 'video' && (
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                URL del Video (YouTube o MP4) *
              </label>
              <input
                type="text"
                value={lessonVideoUrl}
                onChange={(e) => setLessonVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-brand-500 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              {lessonType === 'article' ? 'Contenido del Artículo (Markdown)' : 'Descripción o Notas'}
            </label>
            <textarea
              value={lessonContent}
              onChange={(e) => setLessonContent(e.target.value)}
              rows={lessonType === 'article' ? 6 : 3}
              placeholder={
                lessonType === 'article'
                  ? '# Título\n\nTexto del artículo con código ```jsx ... ```'
                  : 'Notas explicativas de la lección...'
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-brand-500 focus:outline-none font-mono"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <Button onClick={() => setIsLessonModalOpen(false)} variant="secondary" size="sm">
              Cancelar
            </Button>
            <Button onClick={handleSaveLesson} variant="primary" size="sm">
              Guardar Lección
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
