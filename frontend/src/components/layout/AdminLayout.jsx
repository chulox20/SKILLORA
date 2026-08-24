import React from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  LayoutDashboard,
  BookOpen,
  Users,
  FileQuestion,
  Layers,
  ArrowLeft,
  LogOut,
  PlusCircle,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../common/Button';

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { to: '/admin', label: 'Dashboard Admin', icon: LayoutDashboard, end: true },
    { to: '/admin/courses', label: 'Gestión de Cursos', icon: BookOpen },
    { to: '/admin/students', label: 'Estudiantes', icon: Users },
    { to: '/admin/quizzes', label: 'Gestión de Quizzes', icon: FileQuestion },
    { to: '/admin/categories', label: 'Categorías', icon: Layers },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-slate-950 md:bg-slate-900/60 border-b md:border-b-0 md:border-r border-purple-900/30 p-4 md:p-6 shrink-0 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Admin Header Badge */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-purple-950/40 border border-purple-900/40">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/30 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="truncate">
              <h4 className="text-xs font-bold text-purple-200 truncate">Panel Administrador</h4>
              <p className="text-[10px] text-purple-400 font-semibold uppercase">Skillora Core LMS</p>
            </div>
          </div>

          {/* Quick New Course Action */}
          <Link to="/admin/courses/new">
            <Button variant="primary" className="w-full justify-center bg-purple-600 hover:bg-purple-500 border-purple-400/30" icon={PlusCircle} size="sm">
              Crear Nuevo Curso
            </Button>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20 font-semibold'
                      : 'text-slate-400 hover:text-purple-200 hover:bg-purple-950/20'
                  }`
                }
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-purple-900/30 mt-6 space-y-2">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span>Volver al Estudiante</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
