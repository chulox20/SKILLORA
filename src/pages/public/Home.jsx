import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Award,
  PlayCircle,
  TrendingUp,
  Star,
  Users,
  Code2,
  Palette,
  Briefcase,
  Megaphone,
  Brain,
  ShieldCheck,
} from 'lucide-react';
import { useCourses } from '../../contexts/CourseContext';
import { useAuth } from '../../contexts/AuthContext';
import { CourseCard } from '../../components/courses/CourseCard';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export function Home() {
  const { courses, categories, loading } = useCourses();
  const { isAuthenticated } = useAuth();

  const featuredCourses = courses.slice(0, 3);

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Code2':
        return <Code2 className="w-6 h-6 text-brand-400" />;
      case 'Palette':
        return <Palette className="w-6 h-6 text-pink-400" />;
      case 'Briefcase':
        return <Briefcase className="w-6 h-6 text-amber-400" />;
      case 'Megaphone':
        return <Megaphone className="w-6 h-6 text-emerald-400" />;
      case 'Brain':
        return <Brain className="w-6 h-6 text-purple-400" />;
      case 'TrendingUp':
        return <TrendingUp className="w-6 h-6 text-cyan-400" />;
      default:
        return <BookOpen className="w-6 h-6 text-brand-400" />;
    }
  };

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 lg:pt-28 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-brand-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/10 blur-[90px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Col: Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-semibold backdrop-blur-md shadow-glow">
                <Sparkles className="w-3.5 h-3.5" />
                <span>La nueva era del aprendizaje tecnológico</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                Aprende nuevas habilidades.{' '}
                <span className="text-gradient">Construye tu futuro.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Cursos prácticos diseñados para ayudarte a aprender a tu propio ritmo,
                construir proyectos reales y obtener certificaciones oficiales verificables.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link to="/courses" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" className="w-full justify-center shadow-glow" iconRight={ArrowRight}>
                    Explorar cursos
                  </Button>
                </Link>

                <Link to={isAuthenticated ? '/dashboard' : '/register'} className="w-full sm:w-auto">
                  <Button variant="secondary" size="lg" className="w-full justify-center">
                    Comenzar gratis
                  </Button>
                </Link>
              </div>

              {/* Social Proof */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>100% Gratuito en esta versión</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-brand-400" />
                  <span>Certificados descargables</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>Calificación promedio 4.9/5</span>
                </div>
              </div>
            </motion.div>

            {/* Right Col: Interactive Visual Composition */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Course Preview Floating Card */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl space-y-4">
                  <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-800">
                    <img
                      src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80"
                      alt="React desde cero"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-brand-600 text-white shadow-md">
                        Desarrollo Web
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">React desde cero</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Módulo 2: useState y Gestión de Estado</p>
                  </div>

                  {/* Progress Indicator Preview */}
                  <div className="space-y-1.5 bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 font-medium">Progreso del estudiante</span>
                      <span className="text-brand-400 font-bold">75% (9/12 lecciones)</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-brand-500 to-blue-400 h-full rounded-full w-[75%]" />
                    </div>
                  </div>
                </div>

                {/* Floating mini card: Certificate Badge */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -bottom-6 -left-6 bg-slate-900 border border-emerald-500/30 rounded-2xl p-4 shadow-xl backdrop-blur-md flex items-center gap-3 hidden sm:flex"
                >
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Certificado Emitido</h4>
                    <p className="text-[11px] text-emerald-400 font-mono">SKL-2026-00042</p>
                  </div>
                </motion.div>

                {/* Floating mini card: Rating */}
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-6 -right-6 bg-slate-900 border border-amber-500/30 rounded-2xl p-3.5 shadow-xl backdrop-blur-md flex items-center gap-2 hidden sm:flex"
                >
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <div>
                    <p className="text-xs font-bold text-white">★ 4.9 / 5.0</p>
                    <p className="text-[10px] text-slate-400">+1,200 estudiantes</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORÍAS (Section 6) */}
      <section id="categorias" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <h2 className="text-xs font-bold text-brand-400 uppercase tracking-widest">
            Explora por Especialidad
          </h2>
          <h3 className="text-3xl font-extrabold text-white">
            Categorías Principales
          </h3>
          <p className="text-slate-400 text-sm">
            Encuentra cursos organizados por temáticas para impulsar tu carrera paso a paso.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/courses?category=${category.slug}`}
              className="group bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-brand-500/40 rounded-2xl p-5 text-center flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-950/30"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                {getCategoryIcon(category.icon)}
              </div>
              <h4 className="text-sm font-bold text-slate-200 group-hover:text-white transition">
                {category.name}
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">
                {category.courses_count || 1} cursos
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. CURSOS DESTACADOS (Section 7) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-xs font-bold text-brand-400 uppercase tracking-widest mb-1">
              Catálogo Seleccionado
            </h2>
            <h3 className="text-3xl font-extrabold text-white">Cursos Destacados</h3>
          </div>

          <Link to="/courses">
            <Button variant="ghost" size="sm" iconRight={ArrowRight} className="text-brand-400">
              Ver todo el catálogo ({courses.length})
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* 4. CÓMO FUNCIONA / FEATURES */}
      <section id="sobre-nosotros" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 sm:p-12 lg:p-16">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <h2 className="text-xs font-bold text-brand-400 uppercase tracking-widest">
              Metodología Skillora
            </h2>
            <h3 className="text-3xl font-extrabold text-white">
              De novato a certificado en 4 pasos
            </h3>
            <p className="text-slate-400 text-sm">
              Una plataforma diseñada para optimizar tu tiempo y garantizar que apliques lo aprendido.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3 text-center sm:text-left">
              <span className="w-10 h-10 rounded-xl bg-brand-600/10 text-brand-400 font-black text-sm flex items-center justify-center border border-brand-500/20 mx-auto sm:mx-0">
                01
              </span>
              <h4 className="text-base font-bold text-white">Explora & Inscríbete</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Elige cualquier curso de nuestro catálogo sin costos ni suscripciones ocultas.
              </p>
            </div>

            <div className="space-y-3 text-center sm:text-left">
              <span className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-400 font-black text-sm flex items-center justify-center border border-blue-500/20 mx-auto sm:mx-0">
                02
              </span>
              <h4 className="text-base font-bold text-white">Estudia Módulos</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Aprende con lecciones en video y artículos estructurados a tu propio ritmo.
              </p>
            </div>

            <div className="space-y-3 text-center sm:text-left">
              <span className="w-10 h-10 rounded-xl bg-purple-600/10 text-purple-400 font-black text-sm flex items-center justify-center border border-purple-500/20 mx-auto sm:mx-0">
                03
              </span>
              <h4 className="text-base font-bold text-white">Aprueba Quizzes</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Demuestra lo aprendido con evaluaciones interactivas con mínimo 70% de aprobación.
              </p>
            </div>

            <div className="space-y-3 text-center sm:text-left">
              <span className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-400 font-black text-sm flex items-center justify-center border border-emerald-500/20 mx-auto sm:mx-0">
                04
              </span>
              <h4 className="text-base font-bold text-white">Obtén Certificado</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Descarga tu certificado oficial con código único para añadirlo a tu CV o LinkedIn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-r from-brand-900 via-brand-800 to-blue-900 rounded-3xl p-10 sm:p-16 text-center overflow-hidden border border-brand-500/30 shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              ¿Listo para dar el siguiente paso en tu carrera?
            </h3>
            <p className="text-brand-100 text-sm sm:text-base leading-relaxed">
              Únete a cientos de estudiantes que ya están aprendiendo y construyendo proyectos en Skillora.
            </p>
            <div className="pt-2">
              <Link to="/register">
                <Button variant="secondary" size="lg" className="bg-white text-brand-900 hover:bg-slate-100 font-bold border-none shadow-xl" iconRight={Sparkles}>
                  Crear mi cuenta gratuita
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
