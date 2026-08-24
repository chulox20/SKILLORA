import React, { useState, useEffect } from 'react';
import { Plus, Layers, Edit2, Trash2, Tag, BookOpen } from 'lucide-react';
import { useCourses } from '../../contexts/CourseContext';
import { adminService } from '../../services/adminService';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { useNotification } from '../../contexts/NotificationContext';

export function AdminCategories() {
  const { categories, refreshCourses } = useCourses();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const toast = useNotification();

  const handleOpenModal = (cat = null) => {
    if (cat) {
      setEditingCategory(cat);
      setName(cat.name);
      setDescription(cat.description || '');
      setImageUrl(cat.image_url || '');
    } else {
      setEditingCategory(null);
      setName('');
      setDescription('');
      setImageUrl('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80');
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    try {
      await adminService.saveCategory({
        id: editingCategory?.id,
        name,
        description,
        image_url: imageUrl,
      });
      toast.success('Categoría guardada', 'Los cambios se han aplicado.');
      refreshCourses();
      setIsModalOpen(false);
    } catch (err) {
      toast.error('Error', err.message);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('¿Eliminar esta categoría?')) {
      await adminService.deleteCategory(id);
      toast.info('Categoría eliminada', 'La categoría fue removida.');
      refreshCourses();
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Categorías del Catálogo
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Organiza los cursos en áreas de conocimiento para la navegación del estudiante.
          </p>
        </div>

        <Button
          onClick={() => handleOpenModal()}
          variant="primary"
          size="sm"
          className="bg-purple-600 hover:bg-purple-500 border-purple-500/30"
          icon={Plus}
        >
          Nueva Categoría
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 space-y-4 flex flex-col justify-between backdrop-blur-md"
          >
            <div className="space-y-3">
              <div className="relative h-32 rounded-2xl overflow-hidden bg-slate-800">
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center">
                  <h3 className="text-lg font-black text-white tracking-wide">{cat.name}</h3>
                </div>
              </div>

              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                {cat.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <span className="text-[11px] text-slate-500 font-medium">
                Slug: /{cat.slug}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenModal(cat)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/30 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              Nombre de la Categoría *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Ciberseguridad"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              URL de Imagen de Fondo
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <Button onClick={() => setIsModalOpen(false)} variant="secondary" size="sm">
              Cancelar
            </Button>
            <Button onClick={handleSave} variant="primary" size="sm">
              Guardar Categoría
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
