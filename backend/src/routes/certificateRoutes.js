import { Router } from 'express';
import { certificateController } from '../controllers/certificateController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Get My Certificates
router.get('/', authMiddleware, certificateController.getMyCertificates);

// Verify Certificate by unique code (Public)
router.get('/:code', certificateController.getByCode);

// Issue Certificate (Protected)
router.post('/', authMiddleware, certificateController.issue);

export default router;
