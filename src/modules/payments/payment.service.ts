import { Payment, PaymentStatus, PaymentMethod } from './payment.model';
import { Invoice, InvoiceStatus } from '../invoices/invoice.model';
import { Receipt } from '../receipts/receipt.model';
import { razorpay, PAYMENT_CONFIG } from '../../config/payment';
import { AppError } from '../../utils/AppError';
import crypto from 'crypto';

export const createOrder = async (amount: number, currency: string = 'INR', receipt: string) => {
    const options = {
        amount: amount * 100, // Convert to paise
        currency,
        receipt,
        payment_capture: 1
    };

    try {
        const order = await razorpay.orders.create(options);
        return order;
    } catch (error) {
        throw new AppError('Error creating payment order', 500);
    }
};

export const verifyPaymentSignature = (orderId: string, paymentId: string, signature: string) => {
    const text = orderId + '|' + paymentId;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
        .update(text.toString())
        .digest('hex');

    return expectedSignature === signature;
};

export const processPaymentSuccess = async (paymentData: any) => {
    // paymentData from webhook or verify calls
    const { order_id, payment_id, invoiceId, amount } = paymentData;

    // 1. Find Payment Record (if created pre-payment) or Create new
    // Assuming logic: We usually create a Payment record with status 'pending' when order is created?
    // strategy: Find by orderId

    let payment = await Payment.findOne({ orderId: order_id });

    if (!payment && invoiceId) {
        // Fallback: Create payment now if not exists (e.g. direct webhook)
        // This requires fetching invoice data first to associate
        // Skipping complex logic for brevity, assuming standard flow: Order -> Payment Record -> Webhook
        return;
    }

    if (payment && payment.status !== PaymentStatus.SUCCESS) {
        payment.status = PaymentStatus.SUCCESS;
        payment.transactionId = payment_id;
        payment.gatewayResponse = paymentData;
        await payment.save();

        // 2. Update Invoice
        const invoice = await Invoice.findById(payment.invoiceId);
        if (invoice) {
            invoice.paidAmount += payment.amount;
            invoice.balanceAmount = invoice.totalAmount - invoice.paidAmount;

            if (invoice.balanceAmount <= 0) {
                invoice.status = InvoiceStatus.PAID;
                invoice.balanceAmount = 0; // Prevent negative
            } else {
                invoice.status = InvoiceStatus.PARTIALLY_PAID;
            }

            await invoice.save();

            // 3. Generate Receipt
            await Receipt.create({
                schoolId: payment.schoolId,
                studentId: payment.studentId,
                invoiceId: payment.invoiceId,
                paymentId: payment._id,
                receiptNumber: `REC-${Date.now()}`,
                amount: payment.amount,
                paymentMethod: payment.paymentMethod,
                transactionId: payment_id,
                createdBy: payment.createdBy // System or user who initiated
            });
        }
    }
};
