import express from 'express';
import * as invoiceController from './invoice.controller';
import { protect } from '../../middlewares/auth.middleware';
import { restrictTo } from '../../middlewares/role.middleware';
import { scopeSchool } from '../../middlewares/school.middleware';
import { UserRole } from '../users/user.types';
import { validate, createInvoiceSchema } from '../../utils/validation';

const router = express.Router();

router.use(protect);
router.use(scopeSchool);
router.use(restrictTo(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN, UserRole.ACCOUNTANT));

router.post('/manual', validate(createInvoiceSchema), invoiceController.createManual);
router.post('/generate-bulk', invoiceController.bulkGenerate);

router.get('/', invoiceController.getInvoices);
router.get('/:id', invoiceController.getInvoice);
router.patch('/:id/cancel', invoiceController.cancelInvoice);
router.get('/:id/pdf', invoiceController.getPdf);

export default router;
