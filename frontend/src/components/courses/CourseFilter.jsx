import React from 'react';
import { Search, Filter, RotateCcw, Sparkles } from 'lucide-react';
import { useCourses } from '../../contexts/CourseContext';

export function CourseFilter() {
  const { filters, updateFilter, resetFilters } = useCourses();

  const categories = [
    { id: 'all', label: 'Todos' },
    { id: 'desarrollo', label: '💻 Desarrollo' },
    { id: 'diseno', label: '🎨 Diseño' },
    { id: 'ia', label: '🧠 IA' },
    { id: 'negocios', label: '📊 Negocios' },
    { id: 'marketing', label: '📣 Marketing' },
    { id: 'productividad', label: '📈 Productividad' },
  ];

  const levels = [
    { id: 'all', label: 'Todos los niveles' },
    { id: 'beginner', label: 'Principiante' },
    { id: 'intermediate', label: 'Intermedio' },
    { id: 'advanced', label: 'Avanzado' },
  ];

  const durations = [
    { id: 'all', label: 'Cualquier duración' },
    { id: 'short', label: '< 2 horas' },
    { id: 'medium', label: '2–5 horas' },
    { id: 'long', label: '5+ horas' },
  ];

  const sorts = [
    { id: 'popular', label: 'Más populares' },
    { id: 'rating', label: 'Mejor valorados' },
    { id: 'newest', label: 'Más recientes' },
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6 backdrop-blur-md">
      {/* Search and Sort Top Row */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Bar */}
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por título, tecnología o tema..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition"
          />
        </div>

        {/* Sort and Reset */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Ordenar:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              {sorts.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-2 rounded-xl hover:bg-slate-800 border border-transparent hover:border-slate-700 transition"
            title="Limpiar todos los filtros"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Limpiar</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div>
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
          Categoría
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isSelected = filters.category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => updateFilter('category', cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-brand-600 text-white font-semibold shadow-md shadow-brand-600/25 border border-brand-500'
                    : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Secondary Filter Dropdowns (Level & Duration) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800/80">
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Nivel
          </label>
          <select
            value={filters.level}
            onChange={(e) => updateFilter('level', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
          >
            {levels.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Duración
          </label>
          <select
            value={filters.duration}
            onChange={(e) => updateFilter('duration', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
          >
            {durations.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
