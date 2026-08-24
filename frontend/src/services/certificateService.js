import { apiClient } from './apiClient';
import { getLocalItem, setLocalItem, STORAGE_KEYS } from './storageHelper';
import { INITIAL_CERTIFICATES } from '../lib/initialData';
import { courseService } from './courseService';

export const certificateService = {
  // Issue Certificate (Section 32: Validates course completed + quiz passed on server)
  async issueCertificate(userId, courseId, userName = 'Estudiante') {
    try {
      const response = await apiClient.post('/certificates', { courseId });
      if (response.data) return response.data;
    } catch (err) {
      console.warn('API issueCertificate error, using local generator:', err.message);
    }

    const certificates = getLocalItem(STORAGE_KEYS.CERTIFICATES, INITIAL_CERTIFICATES);
    const existing = certificates.find((c) => c.user_id === userId && c.course_id === courseId);
    if (existing) return existing;

    const course = await courseService.getCourseBySlug(courseId);
    const year = new Date().getFullYear();
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    const certificateCode = `SKL-${year}-${randomCode}`;

    const newCert = {
      id: `cert-${Date.now()}`,
      user_id: userId,
      user_name: userName,
      course_id: courseId,
      course_title: course?.title || 'Curso Certificado',
      certificate_code: certificateCode,
      issued_at: new Date().toISOString(),
    };

    certificates.push(newCert);
    setLocalItem(STORAGE_KEYS.CERTIFICATES, certificates);
    return newCert;
  },

  // Get Certificate by Code (Public verification)
  async getCertificateByCode(code) {
    try {
      const response = await apiClient.get(`/certificates/${code}`);
      if (response.data) return response.data;
    } catch (err) {
      console.warn('API getCertificateByCode error, using local fallback:', err.message);
    }

    const certificates = getLocalItem(STORAGE_KEYS.CERTIFICATES, INITIAL_CERTIFICATES);
    return certificates.find((c) => c.certificate_code.toLowerCase() === code.toLowerCase()) || null;
  },

  // Get User Certificates
  async getUserCertificates(userId) {
    try {
      const response = await apiClient.get('/certificates');
      if (response.data) return response.data;
    } catch (err) {
      console.warn('API getUserCertificates error, using local fallback:', err.message);
    }

    const certificates = getLocalItem(STORAGE_KEYS.CERTIFICATES, INITIAL_CERTIFICATES);
    return certificates.filter((c) => c.user_id === userId);
  },
};
