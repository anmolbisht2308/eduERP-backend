import express from 'express';
import * as authController from './auth.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = express.Router();

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/refresh-token', authController.refreshToken);

router.post('/otp/send', authController.sendOTP);
router.post('/otp/verify', authController.verifyOTP);

// Protected routes
router.use(protect);
router.get('/me', authController.getMe);

export default router;
