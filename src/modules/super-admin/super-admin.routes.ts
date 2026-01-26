import express from 'express';
import * as superAdminController from './super-admin.controller';
import { protect } from '../../middlewares/auth.middleware';
import { restrictTo } from '../../middlewares/role.middleware';
import { UserRole } from '../users/user.types';

const router = express.Router();

// Protect all routes (Super Admin only)
router.use(protect);
router.use(restrictTo(UserRole.SUPER_ADMIN));

// Schools
router.post('/schools', superAdminController.createSchool);
router.get('/schools', superAdminController.getSchools);
router.get('/schools/:id', superAdminController.getSchool);
router.patch('/schools/:id', superAdminController.updateSchool);
router.post('/schools/impersonate', superAdminController.impersonateSchool);

// Plans & Subscriptions
router.post('/plans', superAdminController.createPlan);
router.get('/plans', superAdminController.getPlans);
router.post('/subscriptions/assign', superAdminController.assignPlan);

// Dashboard
router.get('/dashboard/stats', superAdminController.getDashboardStats);

export default router;
