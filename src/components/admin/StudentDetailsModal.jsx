import React from 'react';
import { Award, BookOpen, Calendar, Mail, CheckCircle2, Clock } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { formatDate } from '../../utils/formatters';

export function StudentDetailsModal({ isOpen, onClose, student }) {
  if (!student) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-2xl"
      title="Ficha Académica del Estudiante"
      subtitle="Historial de progreso, inscripciones y certificaciones"
    >
      <div className="space-y-6">
        {/* Student Profile Header */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <img
            src={student.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
            alt={student.full_name}
            className="w-14 h-14 rounded-2xl object-cover border border-purple-500/40"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white truncate">{student.full_name}</h3>
              <Badge variant="brand" size="sm">
                Estudiante
              </Badge>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5" />
              {student.email}
            </p>
            <p className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
              <Calendar className="w-3.5 h-3.5" />
              Registrado el {formatDate(student.created_at)}
            </p>
          </div>
        </div>

        {/* Academic Stats Grid */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
            <span className="text-xl font-black text-brand-400 block">
              {student.enrolledCoursesCount || 1}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Cursos Inscritos</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
            <span className="text-xl font-black text-emerald-400 block">
              {student.completedCoursesCount || 0}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Completados</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
            <span className="text-xl font-black text-amber-400 block">
              {student.certificatesCount || 0}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Certificados</span>
          </div>
        </div>

        {/* Enrolled Courses */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-brand-400" />
            Cursos en Progreso
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {student.enrolledCourses?.length > 0 ? (
              student.enrolledCourses.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs"
                >
                  <span className="font-semibold text-slate-200">{c.title}</span>
                  <span className="text-slate-500">Inscrito: {formatDate(c.enrolled_at)}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">No hay cursos inscritos.</p>
            )}
          </div>
        </div>

        {/* Certificates */}
        {student.certificates?.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-400" />
              Certificados Emitidos
            </h4>
            <div className="space-y-2">
              {student.certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs"
                >
                  <div>
                    <p className="font-bold text-emerald-300">{cert.course_title}</p>
                    <p className="text-[10px] text-emerald-400 font-mono">
                      Código: {cert.certificate_code}
                    </p>
                  </div>
                  <span className="text-slate-400">{formatDate(cert.issued_at)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
