import express from 'express';
import authRoutes from './modules/auth/auth.routes';
import schoolRoutes from './modules/schools/school.routes';
import superAdminRoutes from './modules/super-admin/super-admin.routes';
import academicRoutes from './modules/academic/academic.routes';
import classRoutes from './modules/classes/class.routes';
import studentRoutes from './modules/students/student.routes';
import feeRoutes from './modules/fees/fee.routes';
import invoiceRoutes from './modules/invoices/invoice.routes';
import paymentRoutes from './modules/payments/payment.routes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/schools', schoolRoutes);
router.use('/super-admin', superAdminRoutes);
router.use('/academic', academicRoutes);
router.use('/classes', classRoutes);
router.use('/students', studentRoutes);
router.use('/fees', feeRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/payments', paymentRoutes);

export default router;
