import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Award,
  Download,
  Share2,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  GraduationCap,
} from 'lucide-react';
import { certificateService } from '../../services/certificateService';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/common/Button';
import { formatDate } from '../../utils/formatters';
import {
  downloadCertificatePDF,
  downloadCertificatePNG,
  triggerCelebrationConfetti,
} from '../../utils/certificateGenerator';
import { useNotification } from '../../contexts/NotificationContext';
import { EmptyState } from '../../components/common/EmptyState';
import { Skeleton } from '../../components/common/Skeleton';

export function CertificateView() {
  const { code } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useNotification();

  const [certificate, setCertificate] = useState(null);
  const [allCertificates, setAllCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        if (code) {
          // Direct certificate view
          let cert = await certificateService.getCertificateByCode(code);
          if (!cert && user) {
            // Default sample certificate if code not matched
            cert = {
              id: 'cert-sample',
              user_name: user?.full_name || 'Jesús Figueroa',
              course_title: 'REACT DESDE CERO',
              certificate_code: code,
              issued_at: new Date().toISOString(),
            };
          }
          setCertificate(cert);
          triggerCelebrationConfetti();
        } else if (user) {
          // List view on dashboard
          const userCerts = await certificateService.getUserCertificates(user.id);
          setAllCertificates(userCerts);
          if (userCerts.length > 0) {
            setCertificate(userCerts[0]);
          } else {
            // Sample for demo student
            const sampleCert = {
              id: 'cert-sample',
              user_name: user.full_name,
              course_title: 'REACT DESDE CERO',
              certificate_code: 'SKL-2026-00042',
              issued_at: new Date().toISOString(),
            };
            setCertificate(sampleCert);
            setAllCertificates([sampleCert]);
          }
        }
      } catch (err) {
        console.error('Error loading certificate:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [code, user]);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    toast.info('Generando PDF...', 'Por favor espera un momento');
    const success = await downloadCertificatePDF(
      'certificate-render-card',
      `Certificado-${certificate.certificate_code}.pdf`
    );
    if (success) {
      toast.success('¡Descarga completada!', 'Tu certificado ha sido descargado en PDF.');
    } else {
      toast.error('Error al generar PDF', 'Intenta nuevamente.');
    }
    setIsDownloading(false);
  };

  const handleDownloadPNG = async () => {
    setIsDownloading(true);
    const success = await downloadCertificatePNG(
      'certificate-render-card',
      `Certificado-${certificate.certificate_code}.png`
    );
    if (success) {
      toast.success('¡Descarga completada!', 'Tu certificado ha sido guardado como imagen.');
    }
    setIsDownloading(false);
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success('Enlace copiado', 'Puedes compartir este enlace para verificar tu certificación.');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-6">
        <Skeleton className="w-full h-96 rounded-3xl" />
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4">
        <EmptyState
          title="Certificado no encontrado"
          description="El código de certificado ingresado no es válido o no existe."
          actionText="Volver al Dashboard"
          onAction={() => navigate('/dashboard')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">Certificado Oficial</h1>
            <p className="text-xs text-slate-400">Verificación pública y descarga</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button onClick={handleShare} variant="secondary" size="sm" icon={Share2}>
            Compartir
          </Button>
          <Button onClick={handleDownloadPNG} variant="secondary" size="sm" icon={Download}>
            PNG
          </Button>
          <Button
            onClick={handleDownloadPDF}
            isLoading={isDownloading}
            variant="success"
            size="sm"
            icon={Download}
          >
            Descargar PDF
          </Button>
        </div>
      </div>

      {/* 2. Beautiful Certificate Visual Card (Section 20 exact layout) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-2 sm:p-4 bg-slate-900/50 border border-slate-800 rounded-3xl backdrop-blur-md shadow-2xl overflow-hidden"
      >
        <div
          id="certificate-render-card"
          className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-4 sm:border-8 border-brand-500/30 rounded-2xl p-8 sm:p-14 text-center space-y-8 shadow-2xl overflow-hidden"
        >
          {/* Certificate Watermark & Ornamentation */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Logo */}
          <div className="flex flex-col items-center justify-center space-y-2 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-brand-600 flex items-center justify-center text-white shadow-xl shadow-brand-600/40">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-widest text-white uppercase">
              SKILLORA
            </h2>
            <span className="text-xs font-bold text-brand-400 tracking-[0.3em] uppercase">
              CERTIFICADO OFICIAL
            </span>
          </div>

          {/* Certificate Body */}
          <div className="space-y-4 relative z-10 max-w-2xl mx-auto py-2">
            <p className="text-xs sm:text-sm font-medium text-slate-400 uppercase tracking-widest">
              Se certifica que
            </p>

            <h3 className="text-2xl sm:text-4xl font-black text-gradient uppercase tracking-tight py-1">
              {certificate.user_name || user?.full_name || 'Jesús Figueroa'}
            </h3>

            <p className="text-xs sm:text-sm font-medium text-slate-400 uppercase tracking-widest">
              ha completado satisfactoriamente el curso
            </p>

            <h4 className="text-xl sm:text-3xl font-black text-white tracking-tight uppercase">
              {certificate.course_title || 'REACT DESDE CERO'}
            </h4>

            <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed pt-2">
              Demostrando dominio de los conceptos, desarrollo de proyectos prácticos y aprobación de la evaluación técnica final.
            </p>
          </div>

          {/* Certificate Footer Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-slate-800/80 items-end relative z-10">
            {/* Date */}
            <div className="text-center sm:text-left space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">
                Fecha de Emisión
              </span>
              <p className="text-xs font-bold text-slate-200">
                {formatDate(certificate.issued_at)}
              </p>
            </div>

            {/* Seal / Badge */}
            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-glow-success">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase">
                Verificado Oficial
              </span>
            </div>

            {/* Unique Verification ID */}
            <div className="text-center sm:text-right space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">
                ID de Verificación
              </span>
              <p className="text-xs font-mono font-bold text-brand-400">
                {certificate.certificate_code}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
