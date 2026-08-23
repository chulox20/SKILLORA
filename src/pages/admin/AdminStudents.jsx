import React, { useState, useEffect } from 'react';
import { Search, Users, Award, BookOpen, Eye, Calendar, Mail } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { StudentDetailsModal } from '../../components/admin/StudentDetailsModal';
import { formatDate } from '../../utils/formatters';
import { Skeleton, TableRowSkeleton } from '../../components/common/Skeleton';

export function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function loadStudents() {
      setLoading(true);
      try {
        const data = await adminService.getStudents();
        setStudents(data);
      } catch (err) {
        console.error('Error loading students:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStudents();
  }, []);

  const handleOpenDetails = async (student) => {
    const detailed = await adminService.getStudentAcademicProfile(student.id);
    setSelectedStudent(detailed || student);
    setIsModalOpen(true);
  };

  const filteredStudents = students.filter(
    (s) =>
      s.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Gestión de Estudiantes
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Consulta el progreso académico, cursos inscritos y certificaciones otorgadas.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4 backdrop-blur-md">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre o correo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>
        <span className="text-xs text-slate-400 shrink-0 font-medium">
          Total: <strong className="text-white">{filteredStudents.length}</strong> estudiantes
        </span>
      </div>

      {/* Students Table (Section 28 specs) */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl overflow-hidden shadow-xl backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-4 px-5">Estudiante</th>
                <th className="py-4 px-4">Correo</th>
                <th className="py-4 px-4 text-center">Cursos Inscritos</th>
                <th className="py-4 px-4 text-center">Certificados</th>
                <th className="py-4 px-4">Fecha Registro</th>
                <th className="py-4 px-5 text-right">Ficha Académica</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRowSkeleton key={i} cols={6} />
                ))
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No se encontraron estudiantes.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            st.avatar_url ||
                            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
                          }
                          alt={st.full_name}
                          className="w-9 h-9 rounded-xl object-cover border border-purple-500/30 shrink-0"
                        />
                        <span className="font-bold text-white">{st.full_name}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-slate-400">{st.email}</td>

                    <td className="py-4 px-4 text-center font-bold text-brand-400">
                      {st.enrolledCoursesCount || 1}
                    </td>

                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-400">
                        <Award className="w-3.5 h-3.5" />
                        {st.certificatesCount || 0}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-slate-400">
                      {formatDate(st.created_at)}
                    </td>

                    <td className="py-4 px-5 text-right">
                      <Button
                        onClick={() => handleOpenDetails(st)}
                        variant="secondary"
                        size="sm"
                        className="text-xs py-1"
                        icon={Eye}
                      >
                        Ver Perfil
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      <StudentDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        student={selectedStudent}
      />
    </div>
  );
}
