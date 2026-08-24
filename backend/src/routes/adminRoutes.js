import { Router } from 'express';
import { adminController } from '../controllers/adminController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = Router();

// Protect all admin sub-routes
router.use(authMiddleware, requireRole('admin'));

router.get('/dashboard', adminController.getDashboard);
router.get('/students', adminController.getStudents);
router.get('/students/:id', adminController.getStudentDetails);
router.get('/courses', adminController.getCourses);

export default router;
