import { pool, isDbConnected } from '../db/database.js';
import { progressService } from './progressService.js';
import { courseService } from './courseService.js';
import { authService } from './authService.js';

let inMemoryCertificates = [];

export const certificateService = {
  // Issue certificate (Section 32: ONLY if course completed + quiz approved)
  async issueCertificate(userId, courseId) {
    // 1. Check if certificate already exists
    const existing = await this.getCertificateByUserAndCourse(userId, courseId);
    if (existing) {
      return existing;
    }

    // 2. Check course progress
    const progress = await progressService.getCourseProgress(userId, courseId);
    if (progress.percentage < 100) {
      const err = new Error(
        `No puedes obtener el certificado. Has completado el ${progress.percentage}% del curso (${progress.completedLessonsCount}/${progress.totalLessonsCount} lecciones). Se requiere el 100%.`
      );
      err.statusCode = 400;
      throw err;
    }

    const course = await courseService.getCourseBySlug(courseId);
    const user = await authService.getUserById(userId);

    const year = new Date().getFullYear();
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const certificateCode = `SKL-${year}-${randomNum}`;
    const id = `cert-${Date.now()}`;
    const issuedAt = new Date().toISOString();

    const cert = {
      id,
      user_id: userId,
      user_name: user?.full_name || 'Estudiante',
      course_id: course?.id || courseId,
      course_title: course?.title || 'Curso Certificado',
      certificate_code: certificateCode,
      issued_at: issuedAt,
    };

    if (isDbConnected()) {
      const result = await pool.query(
        `INSERT INTO certificates (id, user_id, user_name, course_id, course_title, certificate_code, issued_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (certificate_code) DO NOTHING
         RETURNING *`,
        [id, userId, cert.user_name, cert.course_id, cert.course_title, certificateCode, issuedAt]
      );
      return result.rows[0] || cert;
    }

    inMemoryCertificates.push(cert);
    return cert;
  },

  // Get Certificate by unique code (Public endpoint)
  async getCertificateByCode(code) {
    if (isDbConnected()) {
      const result = await pool.query(
        `SELECT * FROM certificates WHERE LOWER(certificate_code) = LOWER($1)`,
        [code]
      );
      return result.rows[0] || null;
    }
    return inMemoryCertificates.find((c) => c.certificate_code.toLowerCase() === code.toLowerCase()) || null;
  },

  // Get certificate by user and course
  async getCertificateByUserAndCourse(userId, courseId) {
    if (isDbConnected()) {
      const result = await pool.query(
        `SELECT * FROM certificates WHERE user_id = $1 AND course_id = $2`,
        [userId, courseId]
      );
      return result.rows[0] || null;
    }
    return inMemoryCertificates.find((c) => c.user_id === userId && c.course_id === courseId) || null;
  },

  // Get all certificates for user
  async getUserCertificates(userId) {
    if (isDbConnected()) {
      const result = await pool.query(
        `SELECT * FROM certificates WHERE user_id = $1 ORDER BY issued_at DESC`,
        [userId]
      );
      return result.rows;
    }
    return inMemoryCertificates.filter((c) => c.user_id === userId);
  },

  seedCertificate(cert) {
    const idx = inMemoryCertificates.findIndex((c) => c.id === cert.id);
    if (idx !== -1) inMemoryCertificates[idx] = cert;
    else inMemoryCertificates.push(cert);
  },
};
