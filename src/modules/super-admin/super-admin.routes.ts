import express from 'express';
import * as superAdminController from './super-admin.controller';
import { protect, restrictTo } from '../../middlewares/auth.middleware';
import { UserRole } from '../users/user.types';

const router = express.Router();

router.use(protect);
router.use(restrictTo(UserRole.SUPER_ADMIN));

router.get('/stats', superAdminController.getStats);

export default router;
