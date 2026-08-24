import { certificateService } from '../services/certificateService.js';

export const certificateController = {
  // GET /api/certificates (User's earned certificates)
  async getMyCertificates(req, res, next) {
    try {
      const certificates = await certificateService.getUserCertificates(req.user.id);
      res.json({
        success: true,
        data: certificates,
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/certificates/:code (Public verification endpoint)
  async getByCode(req, res, next) {
    try {
      const certificate = await certificateService.getCertificateByCode(req.params.code);
      if (!certificate) {
        return res.status(404).json({
          success: false,
          message: 'Certificado no encontrado con el código especificado.',
        });
      }
      res.json({
        success: true,
        data: certificate,
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/certificates (Issue certificate after completion)
  async issue(req, res, next) {
    try {
      const { courseId } = req.body;
      const certificate = await certificateService.issueCertificate(req.user.id, courseId);
      res.status(201).json({
        success: true,
        message: '¡Certificado emitido exitosamente!',
        data: certificate,
      });
    } catch (err) {
      next(err);
    }
  },
};
