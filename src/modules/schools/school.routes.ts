import express from 'express';
import * as schoolController from './school.controller';
import { protect, restrictTo } from '../../middlewares/auth.middleware';
import { UserRole } from '../users/user.types';

const router = express.Router();

router.use(protect); // All routes require login

// Super Admin only: Create and List all schools
router
    .route('/')
    .get(restrictTo(UserRole.SUPER_ADMIN), schoolController.getAllSchools)
    .post(restrictTo(UserRole.SUPER_ADMIN), schoolController.createSchool);

// School Admin: Get own school details
router.get('/me', restrictTo(UserRole.SCHOOL_ADMIN), schoolController.getMySchool);

export default router;
