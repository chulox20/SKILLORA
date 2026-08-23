import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getLocalItem, setLocalItem, STORAGE_KEYS } from './storageHelper';
import { INITIAL_CERTIFICATES } from '../lib/initialData';
import { generateCertificateCode } from '../utils/formatters';
import { courseService } from './courseService';
import { authService } from './authService';

export const certificateService = {
  // Issue or retrieve existing Certificate
  async issueCertificate(userId, courseId) {
    if (!userId || !courseId) return null;

    const certificates = getLocalItem(STORAGE_KEYS.CERTIFICATES, INITIAL_CERTIFICATES);
    const existing = certificates.find(c => c.user_id === userId && c.course_id === courseId);

    if (existing) {
      return existing;
    }

    const course = await courseService.getCourseById(courseId);
    const user = await authService.getCurrentUser();

    const newCertificate = {
      id: `cert-${Date.now()}`,
      user_id: userId,
      user_name: user?.full_name || 'Estudiante',
      course_id: courseId,
      course_title: course?.title || 'Curso Certificado',
      certificate_code: generateCertificateCode(),
      issued_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('certificates')
          .insert({
            user_id: userId,
            course_id: courseId,
            certificate_code: newCertificate.certificate_code,
            issued_at: newCertificate.issued_at,
          })
          .select()
          .single();

        if (!error && data) return data;
      } catch (err) {
        console.error('Supabase issueCertificate error:', err);
      }
    }

    certificates.push(newCertificate);
    setLocalItem(STORAGE_KEYS.CERTIFICATES, certificates);
    return newCertificate;
  },

  // Get Certificate by unique code
  async getCertificateByCode(code) {
    const certificates = getLocalItem(STORAGE_KEYS.CERTIFICATES, INITIAL_CERTIFICATES);
    const cert = certificates.find(c => c.certificate_code.toLowerCase() === code.toLowerCase());

    if (!cert) return null;

    // Enhance with course and user info if missing
    if (!cert.course_title) {
      const course = await courseService.getCourseById(cert.course_id);
      cert.course_title = course?.title || 'Curso Skillora';
    }
    return cert;
  },

  // Get Certificate by Course and User
  async getCertificate(userId, courseId) {
    const certificates = getLocalItem(STORAGE_KEYS.CERTIFICATES, INITIAL_CERTIFICATES);
    return certificates.find(c => c.user_id === userId && c.course_id === courseId) || null;
  },

  // Get all user certificates
  async getUserCertificates(userId) {
    const certificates = getLocalItem(STORAGE_KEYS.CERTIFICATES, INITIAL_CERTIFICATES);
    return certificates.filter(c => c.user_id === userId);
  },
};
