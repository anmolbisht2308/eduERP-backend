import express from 'express';
import * as paymentController from './payment.controller';
import * as webhookHandler from './webhook.handler';
import { protect } from '../../middlewares/auth.middleware';
import { restrictTo } from '../../middlewares/role.middleware';
import { scopeSchool } from '../../middlewares/school.middleware';
import { UserRole } from '../users/user.types';
import { validate, createPaymentSchema } from '../../utils/validation';

const router = express.Router();

// Webhook must be public and before auth middleware
router.post('/webhook', express.raw({ type: 'application/json' }), webhookHandler.handleWebhook);

// Protected Routes
router.use(protect);
router.use(scopeSchool);

// Initiate payment (Admin or Parent)
router.post('/initiate', validate(createPaymentSchema), paymentController.initiatePayment);
router.get('/', restrictTo(UserRole.SCHOOL_ADMIN, UserRole.ACCOUNTANT), paymentController.getPayments);

export default router;
