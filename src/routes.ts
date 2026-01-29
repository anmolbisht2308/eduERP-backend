import express from 'express';
import authRoutes from './modules/auth/auth.routes';
import schoolRoutes from './modules/schools/school.routes';
import superAdminRoutes from './modules/super-admin/super-admin.routes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/schools', schoolRoutes);
router.use('/super-admin', superAdminRoutes);

export default router;
