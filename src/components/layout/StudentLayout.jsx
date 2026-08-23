import React from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Award,
  User,
  Compass,
  LogOut,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function StudentLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { to: '/dashboard', label: 'Mi Dashboard', icon: LayoutDashboard, end: true },
    { to: '/dashboard/courses', label: 'Mis Cursos', icon: BookOpen },
    { to: '/dashboard/certificates', label: 'Certificados', icon: Award },
    { to: '/profile', label: 'Mi Perfil', icon: User },
    { to: '/courses', label: 'Explorar Catálogo', icon: Compass },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row">
      {/* Student Sidebar */}
      <aside className="w-full md:w-64 bg-slate-950 md:bg-slate-900/40 border-b md:border-b-0 md:border-r border-slate-800/80 p-4 md:p-6 shrink-0 flex flex-col justify-between">
        <div className="space-y-6">
          {/* User mini badge */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <img
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
              alt={user?.full_name}
              className="w-10 h-10 rounded-xl object-cover border border-brand-500/40"
            />
            <div className="truncate">
              <h4 className="text-xs font-bold text-slate-100 truncate">{user?.full_name || 'Estudiante'}</h4>
              <span className="text-[10px] text-brand-400 font-semibold uppercase tracking-wider">
                👨🎓 Estudiante
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20 font-semibold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
                  }`
                }
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom actions */}
        <div className="pt-6 border-t border-slate-800/80 mt-6 space-y-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
