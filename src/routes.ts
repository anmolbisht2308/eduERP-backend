import express from 'express';
import authRoutes from './modules/auth/auth.routes';
import schoolRoutes from './modules/schools/school.routes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/schools', schoolRoutes);

export default router;
