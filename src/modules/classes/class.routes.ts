import express from 'express';
import * as classController from './class.controller';
import { protect } from '../../middlewares/auth.middleware';
import { restrictTo } from '../../middlewares/role.middleware';
import { UserRole } from '../users/user.types';
import { scopeSchool } from '../../middlewares/school.middleware';
import { validate, createClassSchema } from '../../utils/validation';

const router = express.Router();

router.use(protect);
router.use(scopeSchool);
router.use(restrictTo(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN, UserRole.ACCOUNTANT));

// Classes
router.post('/', validate(createClassSchema), classController.createClass);
router.get('/', classController.getClasses);
router.get('/:id', classController.getClass);
router.patch('/:id', classController.updateClass);
router.delete('/:id', classController.deleteClass);

// Sections (often nested, but kept flat for API simplicity for now, or mounted)
router.post('/sections', classController.createSection);
router.get('/sections', classController.getSections);

export default router;
