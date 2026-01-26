import express from 'express';
import authRoutes from './modules/auth/auth.routes';

import superAdminRoutes from './modules/super-admin/super-admin.routes';

import schoolRoutes from './modules/schools/school.routes';
import academicRoutes from './modules/academic/academic.routes';
import classRoutes from './modules/classes/class.routes';
import studentRoutes from './modules/students/student.routes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/super-admin', superAdminRoutes);

// School Management
router.use('/schools', schoolRoutes);
router.use('/academic-years', academicRoutes);
router.use('/classes', classRoutes);
import feeRoutes from './modules/fees/fee.routes';
import invoiceRoutes from './modules/invoices/invoice.routes';

router.use('/fees', feeRoutes);
router.use('/invoices', invoiceRoutes);

export default router;
