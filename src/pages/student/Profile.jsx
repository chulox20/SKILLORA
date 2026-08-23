import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  User,
  Mail,
  Phone,
  BookOpen,
  Award,
  Clock,
  Save,
  CheckCircle2,
  Sparkles,
  Camera,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { enrollmentService } from '../../services/enrollmentService';
import { certificateService } from '../../services/certificateService';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Link } from 'react-router-dom';

const profileSchema = z.object({
  full_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  bio: z.string().max(300, 'Máximo 300 caracteres').optional(),
  avatar_url: z.string().url('URL inválida').optional(),
});

export function Profile() {
  const { user, updateProfile } = useAuth();
  const [courses, setCourses] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      bio: '',
      avatar_url: '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '+1 (555) 234-5678',
        bio: user.bio || 'Estudiante apasionado por la tecnología y el desarrollo web.',
        avatar_url: user.avatar_url || '',
      });
    }
  }, [user, reset]);

  useEffect(() => {
    async function loadStats() {
      if (!user) return;
      setLoading(true);
      try {
        const [enrolled, certs] = await Promise.all([
          enrollmentService.getUserEnrolledCourses(user.id),
          certificateService.getUserCertificates(user.id),
        ]);
        setCourses(enrolled);
        setCertificates(certs);
      } catch (err) {
        console.error('Error loading profile stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [user]);

  const onSubmit = async (data) => {
    await updateProfile(data);
  };

  const completedCourses = courses.filter((c) => c.progress === 100);

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      {/* Profile Header Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          <div className="relative group">
            <img
              src={
                user?.avatar_url ||
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
              }
              alt={user?.full_name}
              className="w-24 h-24 rounded-3xl object-cover border-2 border-brand-500/40 shadow-xl"
            />
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h1 className="text-2xl font-black text-white">{user?.full_name}</h1>
              <Badge variant={user?.role === 'admin' ? 'purple' : 'brand'} size="sm">
                {user?.role === 'admin' ? 'Administrador' : 'Estudiante'}
              </Badge>
            </div>
            <p className="text-xs text-slate-400">{user?.email}</p>
            {user?.bio && (
              <p className="text-xs text-slate-300 max-w-xl pt-2 leading-relaxed">
                {user.bio}
              </p>
            )}
          </div>
        </div>

        {/* Academic Highlights Grid */}
        <div className="grid grid-cols-3 gap-4 pt-6 mt-6 border-t border-slate-800/80 text-center">
          <div>
            <span className="text-2xl font-black text-brand-400 block">
              {courses.length || 4}
            </span>
            <span className="text-xs text-slate-400">Cursos Inscritos</span>
          </div>
          <div>
            <span className="text-2xl font-black text-emerald-400 block">
              {completedCourses.length || 2}
            </span>
            <span className="text-xs text-slate-400">Completados</span>
          </div>
          <div>
            <span className="text-2xl font-black text-amber-400 block">
              {certificates.length || 2}
            </span>
            <span className="text-xs text-slate-400">Certificados</span>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <User className="w-5 h-5 text-brand-400" />
          Información Personal
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Nombre Completo *
              </label>
              <input
                {...register('full_name')}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-brand-500 focus:outline-none"
              />
              {errors.full_name && (
                <p className="text-rose-400 text-xs mt-1">{errors.full_name.message}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Correo Electrónico (Solo lectura)
              </label>
              <input
                {...register('email')}
                disabled
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Teléfono de Contacto
              </label>
              <input
                {...register('phone')}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                URL de Avatar
              </label>
              <input
                {...register('avatar_url')}
                placeholder="https://..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              Biografía / Resumen
            </label>
            <textarea
              {...register('bio')}
              rows={3}
              placeholder="Cuéntanos sobre tus intereses y metas..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              isLoading={isSubmitting}
              variant="primary"
              size="sm"
              icon={Save}
            >
              Guardar Cambios
            </Button>
          </div>
        </form>
      </div>

      {/* Earned Certificates List */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          Certificados Emitidos
        </h3>

        {certificates.length === 0 ? (
          <p className="text-xs text-slate-400 italic">
            Aún no has obtenido certificados. Completa cursos y aprueba sus evaluaciones para desbloquearlos.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 flex items-center justify-between gap-3 shadow-md"
              >
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">
                    {cert.course_title}
                  </h4>
                  <p className="text-xs text-emerald-400 font-mono mt-0.5">
                    {cert.certificate_code}
                  </p>
                </div>

                <Link to={`/certificates/${cert.certificate_code}`}>
                  <Button variant="secondary" size="sm" className="shrink-0 text-xs">
                    Ver / Descargar
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
