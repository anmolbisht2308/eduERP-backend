import express from 'express';
import * as feeController from './fee.controller';
import { protect } from '../../middlewares/auth.middleware';
import { restrictTo } from '../../middlewares/role.middleware';
import { scopeSchool } from '../../middlewares/school.middleware';
import { UserRole } from '../users/user.types';
import { validate, createFeeStructureSchema } from '../../utils/validation';

const router = express.Router();

router.use(protect);
router.use(scopeSchool);
router.use(restrictTo(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN, UserRole.ACCOUNTANT));

// Fee Heads (components)
router.post('/heads', feeController.createFeeHead);
router.get('/heads', feeController.getFeeHeads);

// Fee Structures
router.post('/structures', validate(createFeeStructureSchema), feeController.createFeeStructure);
router.get('/structures', feeController.getFeeStructures);
router.get('/structures/:id', feeController.getFeeStructure);
router.patch('/structures/:id', feeController.updateFeeStructure);

export default router;
