import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  LayoutDashboard,
  Award,
  User,
  ShieldAlert,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Compass,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export function Navbar() {
  const { user, isAuthenticated, isAdmin, logout, switchDemo } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isClassroom = location.pathname.startsWith('/learn');
  if (isClassroom) return null; // Classroom has its dedicated immersive navbar

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-blue-400 p-0.5 shadow-lg shadow-brand-600/30 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-brand-400 group-hover:rotate-6 transition-transform" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight text-white flex items-center gap-1.5 font-sans">
              SKILLORA
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-brand-400 block -mt-1">
              Aprende • Practica • Evoluciona
            </span>
          </div>
        </Link>

        {/* Navigation Links Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/courses"
            className={`text-sm font-medium transition-colors ${
              location.pathname === '/courses' ? 'text-brand-400 font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Cursos
          </Link>
          <a
            href="/#categorias"
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Categorías
          </a>
          <a
            href="/#sobre-nosotros"
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Sobre nosotros
          </a>
        </nav>

        {/* Right Action / Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {/* Demo Role Switcher Button (Convenient for evaluators) */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1">
            <button
              onClick={() => switchDemo('student')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
                user?.role === 'student'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Explorar como Estudiante"
            >
              👨🎓 Estudiante
            </button>
            <button
              onClick={() => switchDemo('admin')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
                user?.role === 'admin'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Explorar como Administrador"
            >
              👨💼 Admin
            </button>
          </div>

          {isAuthenticated && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 p-1.5 pr-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition"
              >
                <img
                  src={user.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                  alt={user.full_name}
                  className="w-9 h-9 rounded-xl object-cover border border-brand-500/40"
                />
                <div className="text-left hidden lg:block">
                  <p className="text-xs font-bold text-slate-200 truncate max-w-[120px]">
                    {user.full_name || 'Estudiante'}
                  </p>
                  <p className="text-[10px] text-brand-400 font-semibold uppercase">
                    {user.role === 'admin' ? 'Administrador' : 'Estudiante'}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 overflow-hidden"
                  >
                    <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                      <p className="text-xs font-bold text-white truncate">{user.full_name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition"
                    >
                      <LayoutDashboard className="w-4 h-4 text-brand-400" />
                      Mi Dashboard
                    </Link>
                    <Link
                      to="/dashboard/courses"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition"
                    >
                      <BookOpen className="w-4 h-4 text-emerald-400" />
                      Mis Cursos
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition"
                    >
                      <User className="w-4 h-4 text-blue-400" />
                      Mi Perfil
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-purple-300 hover:text-white hover:bg-purple-950/40 rounded-xl transition mt-1 border-t border-slate-800/60 pt-2"
                      >
                        <ShieldAlert className="w-4 h-4 text-purple-400" />
                        Panel de Administración
                      </Link>
                    )}

                    <div className="border-t border-slate-800/80 my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-xl transition"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar Sesión
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Iniciar sesión
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm" iconRight={Sparkles}>
                  Comenzar gratis
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-800 bg-slate-950 px-4 pt-4 pb-6 space-y-4"
          >
            <nav className="flex flex-col gap-2">
              <Link
                to="/courses"
                className="px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-900 rounded-xl"
              >
                Cursos
              </Link>
              <a
                href="/#categorias"
                className="px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-900 rounded-xl"
              >
                Categorías
              </a>
              <a
                href="/#sobre-nosotros"
                className="px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-900 rounded-xl"
              >
                Sobre nosotros
              </a>
            </nav>

            <div className="pt-2 border-t border-slate-800 flex flex-col gap-3">
              <div className="flex items-center justify-between bg-slate-900 p-2 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400">Modo Demo:</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => switchDemo('student')}
                    className={`px-2 py-1 text-xs rounded-lg font-semibold ${user?.role === 'student' ? 'bg-brand-600 text-white' : 'text-slate-400'}`}
                  >
                    Estudiante
                  </button>
                  <button
                    onClick={() => switchDemo('admin')}
                    className={`px-2 py-1 text-xs rounded-lg font-semibold ${user?.role === 'admin' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
                  >
                    Admin
                  </button>
                </div>
              </div>

              {isAuthenticated && user ? (
                <div className="flex flex-col gap-2">
                  <Link to="/dashboard">
                    <Button variant="primary" className="w-full justify-start" icon={LayoutDashboard}>
                      Mi Dashboard
                    </Button>
                  </Link>
                  <Link to="/dashboard/courses">
                    <Button variant="secondary" className="w-full justify-start" icon={BookOpen}>
                      Mis Cursos
                    </Button>
                  </Link>
                  {isAdmin && (
                    <Link to="/admin">
                      <Button variant="secondary" className="w-full justify-start text-purple-400" icon={ShieldAlert}>
                        Panel Admin
                      </Button>
                    </Link>
                  )}
                  <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-rose-400" icon={LogOut}>
                    Cerrar Sesión
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link to="/login">
                    <Button variant="secondary" className="w-full">
                      Iniciar sesión
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="primary" className="w-full">
                      Comenzar gratis
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
