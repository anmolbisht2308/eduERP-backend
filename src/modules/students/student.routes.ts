import express from 'express';
import * as studentController from './student.controller';
import { protect } from '../../middlewares/auth.middleware';
import { restrictTo } from '../../middlewares/role.middleware';
import { UserRole } from '../users/user.types';
import { scopeSchool } from '../../middlewares/school.middleware';
import { validate, createStudentSchema, updateStudentSchema } from '../../utils/validation';

const router = express.Router();

router.use(protect);
router.use(scopeSchool);
router.use(restrictTo(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN, UserRole.ACCOUNTANT));

router.post('/', validate(createStudentSchema), studentController.createStudent);
router.get('/', studentController.getStudents);
router.get('/:id', studentController.getStudent);
router.patch('/:id', validate(updateStudentSchema), studentController.updateStudent);

// Specific actions
router.patch('/:id/status', studentController.updateStatus);
router.post('/bulk-import', studentController.bulkImport);

export default router;
