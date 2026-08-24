import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Edit2,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  Search,
  ExternalLink,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { courseService } from '../../services/courseService';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { CourseFormModal } from '../../components/admin/CourseFormModal';
import { useNotification } from '../../contexts/NotificationContext';
import { Skeleton, TableRowSkeleton } from '../../components/common/Skeleton';

export function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const toast = useNotification();
  const navigate = useNavigate();

  const loadCourses = async () => {
    setLoading(true);
    try {
      const data = await courseService.getCourses({ includeAllForAdmin: true });
      setCourses(data);
    } catch (err) {
      toast.error('Error', 'No se pudieron cargar los cursos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleCreateOrUpdate = async (courseData) => {
    try {
      if (selectedCourse) {
        await courseService.updateCourse(selectedCourse.id, courseData);
        toast.success('Curso actualizado', 'Los cambios se guardaron correctamente.');
      } else {
        await courseService.createCourse(courseData);
        toast.success('Curso creado', 'El nuevo curso ha sido registrado.');
      }
      loadCourses();
    } catch (err) {
      toast.error('Error al guardar curso', err.message);
    }
  };

  const handleDuplicate = async (courseId) => {
    try {
      await courseService.duplicateCourse(courseId);
      toast.success('Curso duplicado', 'Se ha creado una copia en borrador.');
      loadCourses();
    } catch (err) {
      toast.error('Error al duplicar', err.message);
    }
  };

  const handleTogglePublish = async (course) => {
    const newStatus = course.status === 'published' ? 'draft' : 'published';
    try {
      await courseService.updateCourse(course.id, { status: newStatus });
      toast.success(
        newStatus === 'published' ? 'Curso publicado' : 'Curso despublicado',
        `El estado se actualizó a ${newStatus === 'published' ? 'Publicado' : 'Borrador'}.`
      );
      loadCourses();
    } catch (err) {
      toast.error('Error al cambiar estado', err.message);
    }
  };

  const handleDelete = async (courseId) => {
    if (confirm('¿Estás seguro de eliminar permanentemente este curso?')) {
      try {
        await courseService.deleteCourse(courseId);
        toast.info('Curso eliminado', 'El curso fue eliminado.');
        loadCourses();
      } catch (err) {
        toast.error('Error al eliminar', err.message);
      }
    }
  };

  const filteredCourses = courses.filter((c) =>
    c.title?.toLowerCase().includes(search.toLowerCase()) ||
    c.category_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Administración de Cursos
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Control de catálogo, temarios, lecciones y publicación.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/courses/new">
            <Button
              variant="primary"
              size="sm"
              className="bg-purple-600 hover:bg-purple-500 border-purple-500/30"
              icon={Plus}
            >
              Nuevo Curso
            </Button>
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4 backdrop-blur-md">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre de curso o categoría..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>
        <span className="text-xs text-slate-400 shrink-0 font-medium">
          Total: <strong className="text-white">{filteredCourses.length}</strong> cursos
        </span>
      </div>

      {/* Courses Table (Section 23 specs) */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl overflow-hidden shadow-xl backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-4 px-5">Curso</th>
                <th className="py-4 px-4">Categoría</th>
                <th className="py-4 px-4 text-center">Lecciones</th>
                <th className="py-4 px-4 text-center">Alumnos</th>
                <th className="py-4 px-4 text-center">Estado</th>
                <th className="py-4 px-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRowSkeleton key={i} cols={6} />
                ))
              ) : filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No se encontraron cursos registrados.
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course) => {
                  const lessonCount =
                    course.modules?.reduce(
                      (acc, m) => acc + (m.lessons?.length || 0),
                      0
                    ) || 12;

                  return (
                    <tr key={course.id} className="hover:bg-slate-800/40 transition">
                      {/* Title + Thumbnail */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={course.thumbnail_url}
                            alt={course.title}
                            className="w-12 h-8 rounded-lg object-cover bg-slate-800 border border-slate-700 shrink-0"
                          />
                          <div className="min-w-0">
                            <Link
                              to={`/admin/courses/${course.id}/edit`}
                              className="font-bold text-white hover:text-purple-300 transition line-clamp-1"
                            >
                              {course.title}
                            </Link>
                            <span className="text-[10px] text-slate-500 font-mono">
                              /{course.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4 text-slate-300 font-medium">
                        {course.category_name || 'Desarrollo'}
                      </td>

                      {/* Lessons count */}
                      <td className="py-4 px-4 text-center font-bold">
                        {lessonCount}
                      </td>

                      {/* Students count */}
                      <td className="py-4 px-4 text-center font-bold text-brand-400">
                        {course.students_count || 245}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 text-center">
                        <Badge
                          variant={course.status === 'published' ? 'success' : 'warning'}
                          size="sm"
                        >
                          {course.status === 'published' ? 'Publicado' : 'Borrador'}
                        </Badge>
                      </td>

                      {/* Actions (Section 23: Editar, Duplicar, Publicar, Despublicar, Eliminar) */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Edit Modules and Details */}
                          <Link
                            to={`/admin/courses/${course.id}/edit`}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                            title="Editar curso y temario"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Link>

                          {/* Duplicate */}
                          <button
                            onClick={() => handleDuplicate(course.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                            title="Duplicar curso"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          {/* Toggle Publish */}
                          <button
                            onClick={() => handleTogglePublish(course)}
                            className={`p-1.5 rounded-lg transition ${
                              course.status === 'published'
                                ? 'bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/40'
                                : 'bg-amber-950/40 text-amber-400 hover:bg-amber-900/40'
                            }`}
                            title={course.status === 'published' ? 'Despublicar' : 'Publicar'}
                          >
                            {course.status === 'published' ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(course.id)}
                            className="p-1.5 rounded-lg bg-rose-950/30 hover:bg-rose-900/40 text-rose-400 transition"
                            title="Eliminar curso"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Quick Edit or New */}
      <CourseFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        course={selectedCourse}
        onSave={handleCreateOrUpdate}
      />
    </div>
  );
}
