import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Clock, BookOpen, Sparkles, ArrowRight } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { formatLevel } from '../../utils/formatters';

export function CourseCard({ course, isEnrolled = false, progress = 0 }) {
  // Count total lessons
  const totalLessons = course.modules?.reduce(
    (acc, m) => acc + (m.lessons?.length || 0),
    0
  ) || 12;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group bg-slate-900/70 border border-slate-800 hover:border-brand-500/50 rounded-2xl overflow-hidden flex flex-col justify-between backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-brand-950/30"
    >
      <div>
        {/* Course Thumbnail & Category */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-800">
          <img
            src={course.thumbnail_url || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80'}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
          
          <div className="absolute top-3 left-3">
            <Badge variant="brand" size="sm" className="backdrop-blur-md bg-slate-950/80">
              {course.category_name || 'Desarrollo'}
            </Badge>
          </div>

          <div className="absolute top-3 right-3">
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-900/90 backdrop-blur-md text-slate-300 border border-slate-700">
              {formatLevel(course.level)}
            </span>
          </div>
        </div>

        {/* Course Content */}
        <div className="p-5 space-y-3">
          <Link to={`/courses/${course.slug}`}>
            <h3 className="text-lg font-bold text-slate-100 group-hover:text-brand-400 transition line-clamp-1">
              {course.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {course.short_description || course.description}
          </p>

          {/* Metrics / Info */}
          <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-1 text-amber-400 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{course.rating || 4.9}</span>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <BookOpen className="w-3.5 h-3.5 text-brand-400" />
              <span>{totalLessons} lecciones</span>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>{course.duration || '6h 30m'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer CTA */}
      <div className="p-5 pt-0">
        <Link to={`/courses/${course.slug}`} className="block">
          <Button variant="outline" size="sm" className="w-full justify-center group-hover:bg-brand-600 group-hover:text-white group-hover:border-brand-600 transition" iconRight={ArrowRight}>
            Ver curso
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
