import { Request, Response } from 'express';
import { PAYMENT_CONFIG } from '../../config/payment';
import * as paymentService from './payment.service';
import crypto from 'crypto';

export const handleWebhook = async (req: Request, res: Response) => {
    const signature = req.headers['x-razorpay-signature'] as string;

    if (!signature) {
        return res.status(400).json({ status: 'failure', message: 'Missing signature' });
    }

    // Verify signature
    const hmac = crypto.createHmac('sha256', PAYMENT_CONFIG.webhookSecret);
    hmac.update(JSON.stringify(req.body));
    const digest = hmac.digest('hex');

    if (digest !== signature) {
        return res.status(400).json({ status: 'failure', message: 'Invalid signature' });
    }

    const event = req.body;

    try {
        if (event.event === 'payment.captured') {
            const paymentEntity = event.payload.payment.entity;
            // Extract metadata if we passed invoiceId/orderId in notes
            const notes = paymentEntity.notes || {};

            await paymentService.processPaymentSuccess({
                order_id: paymentEntity.order_id,
                payment_id: paymentEntity.id,
                amount: paymentEntity.amount / 100, // paise to INR
                ...notes
            });
        }

        res.json({ status: 'ok' });
    } catch (error) {
        console.error('Webhook processing error:', error);
        res.status(500).json({ status: 'error' });
    }
};
