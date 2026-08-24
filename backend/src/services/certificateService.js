import crypto from 'crypto';
import { query } from '../db/database.js';
import { progressService } from './progressService.js';
import { courseService } from './courseService.js';
import { authService } from './authService.js';

export const certificateService = {
  // Issue certificate with strict multi-step validation (Section 32, Points 3 & 4)
  async issueCertificate(userId, courseId) {
    // 1. Check if certificate already exists for this user and course
    const existing = await this.getCertificateByUserAndCourse(userId, courseId);
    if (existing) {
      return existing;
    }

    // 2. Check Enrollment: Is the user enrolled in the course?
    const enrollmentRes = await query(
      `SELECT * FROM enrollments WHERE user_id = $1 AND course_id = $2`,
      [userId, courseId]
    );
    if (enrollmentRes.rows.length === 0) {
      const err = new Error('No estás inscrito en este curso.');
      err.statusCode = 403;
      throw err;
    }

    // 3. Check 100% Lesson Completion: Has user completed all lessons?
    const progress = await progressService.getCourseProgress(userId, courseId);
    if (progress.percentage < 100) {
      const err = new Error(
        `Requisitos de certificación incompletos. Has completado el ${progress.percentage}% de las lecciones (${progress.completedLessonsCount}/${progress.totalLessonsCount}). Se requiere el 100%.`
      );
      err.statusCode = 400;
      throw err;
    }

    // 4. Check Quiz Approval: Has user passed the quiz associated with the course?
    const quizRes = await query(
      `SELECT q.id, q.title, q.passing_score
       FROM quizzes q
       JOIN course_modules m ON m.course_id = $1
       JOIN lessons l ON l.module_id = m.id AND l.quiz_id = q.id
       LIMIT 1`,
      [courseId]
    );

    if (quizRes.rows.length > 0) {
      const quizId = quizRes.rows[0].id;
      const attemptRes = await query(
        `SELECT * FROM quiz_attempts
         WHERE quiz_id = $1 AND user_id = $2 AND passed = true
         ORDER BY score DESC LIMIT 1`,
        [quizId, userId]
      );

      if (attemptRes.rows.length === 0) {
        const err = new Error(
          'Requisitos de certificación incompletos. Debes aprobar la evaluación final del curso con un puntaje mínimo del 70%.'
        );
        err.statusCode = 400;
        throw err;
      }
    }

    // 5. Generate unique UUID and clean presentation certificate code (Point 4)
    const uuid = crypto.randomUUID();
    const year = new Date().getFullYear();
    const shortCode = uuid.split('-')[0].toUpperCase();
    const certificateCode = `SKL-${year}-${shortCode}`;
    const id = `cert-${uuid}`;
    const issuedAt = new Date().toISOString();

    const course = await courseService.getCourseBySlug(courseId);
    const user = await authService.getUserById(userId);

    const certData = {
      id,
      user_id: userId,
      user_name: user?.full_name || 'Estudiante Skillora',
      course_id: course?.id || courseId,
      course_title: course?.title || 'Curso Certificado',
      certificate_code: certificateCode,
      issued_at: issuedAt,
    };

    const insertRes = await query(
      `INSERT INTO certificates (id, user_id, user_name, course_id, course_title, certificate_code, issued_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (certificate_code) DO NOTHING
       RETURNING *`,
      [id, userId, certData.user_name, certData.course_id, certData.course_title, certificateCode, issuedAt]
    );

    // Update enrollment status to completed
    await query(
      `UPDATE enrollments SET status = 'completed', completed_at = NOW() WHERE user_id = $1 AND course_id = $2`,
      [userId, courseId]
    );

    return insertRes.rows[0] || certData;
  },

  // Get Certificate by unique code (Public verification endpoint)
  async getCertificateByCode(code) {
    const result = await query(
      `SELECT * FROM certificates WHERE LOWER(certificate_code) = LOWER($1)`,
      [code]
    );
    return result.rows[0] || null;
  },

  // Get certificate by user and course
  async getCertificateByUserAndCourse(userId, courseId) {
    const result = await query(
      `SELECT * FROM certificates WHERE user_id = $1 AND course_id = $2`,
      [userId, courseId]
    );
    return result.rows[0] || null;
  },

  // Get all certificates for user
  async getUserCertificates(userId) {
    const result = await query(
      `SELECT * FROM certificates WHERE user_id = $1 ORDER BY issued_at DESC`,
      [userId]
    );
    return result.rows;
  },
};
