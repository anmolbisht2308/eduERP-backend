import express from 'express';
import * as notificationController from './notification.controller';
import { protect } from '../../middlewares/auth.middleware';
import { restrictTo } from '../../middlewares/role.middleware';
import { scopeSchool } from '../../middlewares/school.middleware';
import { UserRole } from '../users/user.types';

const router = express.Router();

router.use(protect);
router.use(scopeSchool);
router.use(restrictTo(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN));

router.post('/send', notificationController.send);
router.get('/logs', notificationController.getLogs);

export default router;
