import { Router } from 'express';
import authRoutes from './authRoutes.js';
import courseRoutes from './courseRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import enrollmentRoutes from './enrollmentRoutes.js';
import progressRoutes from './progressRoutes.js';
import quizRoutes from './quizRoutes.js';
import certificateRoutes from './certificateRoutes.js';
import adminRoutes from './adminRoutes.js';

const router = Router();

// API Health Check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Skillora REST API is running smoothly.',
    timestamp: new Date().toISOString(),
  });
});

// Mount Resource Routes
router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/categories', categoryRoutes);
router.use('/', enrollmentRoutes);
router.use('/', progressRoutes);
router.use('/quizzes', quizRoutes);
router.use('/certificates', certificateRoutes);
router.use('/admin', adminRoutes);

export default router;
