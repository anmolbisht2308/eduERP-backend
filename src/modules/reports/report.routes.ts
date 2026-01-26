import express from 'express';
import * as reportController from './report.controller';
import { protect } from '../../middlewares/auth.middleware';
import { restrictTo } from '../../middlewares/role.middleware';
import { scopeSchool } from '../../middlewares/school.middleware';
import { UserRole } from '../users/user.types';

const router = express.Router();

router.use(protect);
router.use(scopeSchool);
// Only Admin/Accountant/SuperAdmin should see reports
router.use(restrictTo(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN, UserRole.ACCOUNTANT));

router.get('/daily-collection', reportController.dailyCollection);
router.get('/monthly-collection', reportController.monthlyCollection);
router.get('/outstanding', reportController.outstanding);

export default router;
