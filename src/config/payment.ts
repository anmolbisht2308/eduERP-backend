import Razorpay from 'razorpay';
import { env } from './env';

// Initialize Razorpay instance if keys are present
// Env variables needed: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
export const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder'
});

export const PAYMENT_CONFIG = {
    currency: 'INR',
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || 'webhook_secret'
};
