import express from 'express';
import * as schoolController from './school.controller';
import { protect } from '../../middlewares/auth.middleware';
import { restrictTo } from '../../middlewares/role.middleware';
import { UserRole } from '../users/user.types';

const router = express.Router();

router.use(protect);
// Determine who can access: School Admin mostly. Staff might view.
router.use(restrictTo(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN));

router.get('/me', schoolController.getMySchool);
router.patch('/me', schoolController.updateMySchool);

export default router;
