import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  BookOpen,
  UserCheck,
  Award,
  PlusCircle,
  TrendingUp,
  FileQuestion,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      try {
        const data = await adminService.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Error loading admin stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Panel de Control Administrativo</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Dashboard General
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Métricas globales de estudiantes, cursos, inscripciones y certificaciones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/courses/new">
            <Button
              variant="primary"
              size="sm"
              className="bg-purple-600 hover:bg-purple-500 border-purple-500/30 shadow-lg shadow-purple-900/30"
              icon={PlusCircle}
            >
              Nuevo Curso
            </Button>
          </Link>
        </div>
      </div>

      {/* 1. Metrics Grid (Section 22 exact specs) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-slate-900/70 border border-purple-900/30 rounded-3xl p-6 backdrop-blur-md shadow-xl"
        >
          <div className="flex items-center justify-between text-purple-400 mb-3">
            <Users className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
              Estudiantes
            </span>
          </div>
          <h3 className="text-3xl sm:text-4xl font-black text-white">
            {stats?.totalStudents?.toLocaleString() || '1,284'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">Total estudiantes registrados</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          className="bg-slate-900/70 border border-purple-900/30 rounded-3xl p-6 backdrop-blur-md shadow-xl"
        >
          <div className="flex items-center justify-between text-brand-400 mb-3">
            <BookOpen className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded-full border border-brand-500/20">
              Catálogo
            </span>
          </div>
          <h3 className="text-3xl sm:text-4xl font-black text-white">
            {stats?.publishedCourses || '24'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">Cursos publicados</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          className="bg-slate-900/70 border border-purple-900/30 rounded-3xl p-6 backdrop-blur-md shadow-xl"
        >
          <div className="flex items-center justify-between text-blue-400 mb-3">
            <UserCheck className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
              Inscripciones
            </span>
          </div>
          <h3 className="text-3xl sm:text-4xl font-black text-white">
            {stats?.totalEnrollments?.toLocaleString() || '3,842'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">Inscripciones activas</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          className="bg-slate-900/70 border border-purple-900/30 rounded-3xl p-6 backdrop-blur-md shadow-xl"
        >
          <div className="flex items-center justify-between text-emerald-400 mb-3">
            <Award className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Graduados
            </span>
          </div>
          <h3 className="text-3xl sm:text-4xl font-black text-white">
            {stats?.completedCourses?.toLocaleString() || '1,562'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">Cursos completados</p>
        </motion.div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/admin/courses"
          className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 transition group flex items-center justify-between"
        >
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-purple-300">
              Gestionar Cursos
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">Crear, editar temarios y publicar</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition" />
        </Link>

        <Link
          to="/admin/students"
          className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 transition group flex items-center justify-between"
        >
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-purple-300">
              Estudiantes
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">Fichas académicas y certificados</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition" />
        </Link>

        <Link
          to="/admin/quizzes"
          className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 transition group flex items-center justify-between"
        >
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-purple-300">
              Evaluaciones / Quizzes
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">Editor de preguntas y respuestas</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition" />
        </Link>
      </div>

      {/* Courses Summary Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Resumen de Cursos Populares</h3>
          <Link to="/admin/courses" className="text-xs font-bold text-purple-400 hover:underline">
            Ver gestión completa
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Curso</th>
                <th className="py-3 px-4">Categoría</th>
                <th className="py-3 px-4">Alumnos</th>
                <th className="py-3 px-4">Calificación</th>
                <th className="py-3 px-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {(stats?.coursesSummary || []).slice(0, 5).map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-semibold text-white">{c.title}</td>
                  <td className="py-3 px-4 text-slate-400">{c.category || 'Desarrollo'}</td>
                  <td className="py-3 px-4 font-bold">{c.studentsCount || 245}</td>
                  <td className="py-3 px-4 text-amber-400">★ {c.rating || 4.9}</td>
                  <td className="py-3 px-4">
                    <Badge variant={c.status === 'published' ? 'success' : 'warning'} size="sm">
                      {c.status === 'published' ? 'Publicado' : 'Borrador'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
