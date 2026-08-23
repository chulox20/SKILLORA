/**
 * Formats a date to readable Spanish string
 */
export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/**
 * Generate unique certificate code: SKL-YYYY-XXXXX
 */
export function generateCertificateCode() {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `SKL-${year}-${randomNum}`;
}

/**
 * Calculate progress percentage
 */
export function calculateProgress(completedLessonsCount, totalLessonsCount) {
  if (!totalLessonsCount || totalLessonsCount === 0) return 0;
  const pct = Math.round((completedLessonsCount / totalLessonsCount) * 100);
  return Math.min(Math.max(pct, 0), 100);
}

/**
 * Formats level label to friendly Spanish
 */
export function formatLevel(level) {
  switch (level?.toLowerCase()) {
    case 'beginner':
    case 'principiante':
      return 'Principiante';
    case 'intermediate':
    case 'intermedio':
      return 'Intermedio';
    case 'advanced':
    case 'avanzado':
      return 'Avanzado';
    default:
      return 'Todos los niveles';
  }
}

/**
 * Format course status
 */
export function formatStatus(status) {
  switch (status?.toLowerCase()) {
    case 'published':
      return { label: 'Publicado', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
    case 'draft':
      return { label: 'Borrador', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
    case 'archived':
      return { label: 'Archivado', color: 'bg-slate-500/10 text-slate-400 border-slate-500/30' };
    default:
      return { label: status, color: 'bg-slate-500/10 text-slate-400 border-slate-500/30' };
  }
}
