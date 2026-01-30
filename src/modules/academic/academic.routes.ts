import express from 'express';
import * as academicController from './academic.controller';
import { protect } from '../../middlewares/auth.middleware';
import { restrictTo } from '../../middlewares/role.middleware';
import { UserRole } from '../users/user.types';
import { scopeSchool } from '../../middlewares/school.middleware';
import { validate, createAcademicYearSchema } from '../../utils/validation';

const router = express.Router();

router.use(protect);
router.use(scopeSchool); // Ensures req.user.schoolId is enforced
router.use(restrictTo(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN));

router.post('/', validate(createAcademicYearSchema), academicController.createAcademicYear);
router.get('/', academicController.getAcademicYears);
router.patch('/:id/set-current', academicController.setCurrentAcademicYear);
router.get('/:id', academicController.getAcademicYear);
router.patch('/:id', academicController.updateAcademicYear);
router.delete('/:id', academicController.deleteAcademicYear);

export default router;
