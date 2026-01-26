import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendSuccess } from '../../utils/response';
import * as paymentService from './payment.service';
import { AppError } from '../../utils/AppError';
import { Payment, PaymentMethod, PaymentStatus } from './payment.model';
import { Invoice } from '../invoices/invoice.model';

export const initiatePayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.schoolId) return next(new AppError('School ID missing', 400));

    const { invoiceId, amount, paymentMethod } = req.body;

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) return next(new AppError('Invoice not found', 404));

    // Create local Payment Record first (Pending)
    const payment = await Payment.create({
        schoolId: req.user.schoolId,
        studentId: invoice.studentId,
        invoiceId,
        paymentNumber: `PAY-${Date.now()}`,
        amount,
        paymentMethod,
        status: PaymentStatus.PENDING,
        createdBy: req.user._id
    });

    let responseData: any = { payment };

    if (paymentMethod === PaymentMethod.ONLINE) {
        // Create Gateway Order
        const order = await paymentService.createOrder(amount, 'INR', payment.paymentNumber);
        payment.orderId = order.id;
        await payment.save();
        responseData.order = order;
        responseData.keyId = process.env.RAZORPAY_KEY_ID;
    } else {
        // For cash/cheque, mark success immediately? Or keep pending until verified?
        // Assuming immediate success for admin-entered Cash payments
        await paymentService.processPaymentSuccess({
            order_id: null, // manual
            payment_id: `MANUAL-${Date.now()}`,
            invoiceId,
            amount,
            // Pass the payment record context if function supports it, or reload logic
        });
        // Reload payment to get updated status
        const updatedPayment = await Payment.findById(payment._id);
        responseData.payment = updatedPayment;
    }

    sendSuccess(res, responseData, 'Payment initiated', 201);
});

export const getPayments = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.schoolId) return next(new AppError('School ID missing', 400));

    const payments = await Payment.find({ schoolId: req.user.schoolId })
        .populate('studentId', 'firstName lastName')
        .sort({ createdAt: -1 })
        .limit(20); // Basic pagination

    sendSuccess(res, { payments });
});
