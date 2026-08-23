import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-lg shadow-brand-600/30">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">SKILLORA</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Plataforma LMS moderna para aprender nuevas habilidades, practicar con proyectos reales y certificarte profesionalmente.
            </p>
            <div className="flex items-center gap-3 text-slate-400 pt-2">
              <a href="https://github.com/chulox20/SKILLORA" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-900 hover:text-white hover:bg-slate-800 transition">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-900 hover:text-white hover:bg-slate-800 transition">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-900 hover:text-white hover:bg-slate-800 transition">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Categorías */}
          <div>
            <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4">Categorías</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/courses?category=desarrollo" className="hover:text-brand-400 transition">💻 Desarrollo Web</Link></li>
              <li><Link to="/courses?category=diseno" className="hover:text-brand-400 transition">🎨 Diseño UI/UX</Link></li>
              <li><Link to="/courses?category=ia" className="hover:text-brand-400 transition">🧠 Inteligencia Artificial</Link></li>
              <li><Link to="/courses?category=negocios" className="hover:text-brand-400 transition">📊 Negocios</Link></li>
              <li><Link to="/courses?category=marketing" className="hover:text-brand-400 transition">📣 Marketing Digital</Link></li>
              <li><Link to="/courses?category=productividad" className="hover:text-brand-400 transition">📈 Productividad</Link></li>
            </ul>
          </div>

          {/* Explorar */}
          <div>
            <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4">Plataforma</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/courses" className="hover:text-brand-400 transition">Catálogo de Cursos</Link></li>
              <li><Link to="/dashboard" className="hover:text-brand-400 transition">Panel del Estudiante</Link></li>
              <li><Link to="/profile" className="hover:text-brand-400 transition">Perfil Académico</Link></li>
              <li><a href="/#certificados" className="hover:text-brand-400 transition">Certificaciones Oficiales</a></li>
              <li><Link to="/admin" className="hover:text-purple-400 transition">Portal de Administración</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-2">Mantente al día</h4>
            <p className="text-xs text-slate-400">
              Recibe nuevos cursos gratuitos, recursos y actualizaciones mensuales.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('¡Gracias por suscribirte!'); }} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="tu@email.com"
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold py-2.5 rounded-xl transition"
              >
                Suscribirme
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SKILLORA. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            Diseñado con <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> para la comunidad educativa
          </p>
        </div>
      </div>
    </footer>
  );
}
