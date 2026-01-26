import express from 'express';
import authRoutes from './modules/auth/auth.routes';

import superAdminRoutes from './modules/super-admin/super-admin.routes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/super-admin', superAdminRoutes);

export default router;
