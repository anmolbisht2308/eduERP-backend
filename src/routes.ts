import express from 'express';
import authRoutes from './modules/auth/auth.routes';
import schoolRoutes from './modules/schools/school.routes';
import superAdminRoutes from './modules/super-admin/super-admin.routes';
import academicRoutes from './modules/academic/academic.routes';
import classRoutes from './modules/classes/class.routes';
import studentRoutes from './modules/students/student.routes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/schools', schoolRoutes);
router.use('/super-admin', superAdminRoutes);
router.use('/academic', academicRoutes);
router.use('/classes', classRoutes);
router.use('/students', studentRoutes);

export default router;
