import mongoose, { Schema, Document } from 'mongoose';

export enum PaymentStatus {
    PENDING = 'pending',
    SUCCESS = 'success',
    FAILED = 'failed',
    REFUNDED = 'refunded'
}

export enum PaymentMethod {
    CASH = 'cash',
    ONLINE = 'online',
    CHEQUE = 'cheque',
    BANK_TRANSFER = 'bank_transfer'
}

export interface IPayment extends Document {
    schoolId: mongoose.Types.ObjectId;
    studentId: mongoose.Types.ObjectId;
    invoiceId: mongoose.Types.ObjectId;

    paymentNumber: string; // Auto-generated unique
    paymentDate: Date;
    amount: number;

    paymentMethod: PaymentMethod;
    status: PaymentStatus;

    // Online payment details (Razorpay/Cashfree)
    orderId?: string;
    transactionId?: string;
    gatewayResponse?: any;

    // Offline payment details
    chequeNumber?: string;
    bankName?: string;
    chequeDate?: Date;

    // Refund
    refundedAmount?: number;
    refundedAt?: Date;
    refundReason?: string;

    notes?: string;

    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
    {
        schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
        studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
        invoiceId: { type: Schema.Types.ObjectId, ref: 'Invoice', required: true, index: true },

        paymentNumber: { type: String, required: true, unique: true },
        paymentDate: { type: Date, default: Date.now },
        amount: { type: Number, required: true, min: 0 },

        paymentMethod: { type: String, enum: Object.values(PaymentMethod), required: true },
        status: { type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.PENDING },

        orderId: { type: String },
        transactionId: { type: String, index: true },
        gatewayResponse: { type: Schema.Types.Mixed },

        chequeNumber: { type: String },
        bankName: { type: String },
        chequeDate: { type: Date },

        refundedAmount: { type: Number },
        refundedAt: { type: Date },
        refundReason: { type: String },

        notes: { type: String },

        createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

paymentSchema.index({ paymentNumber: 1 });
paymentSchema.index({ schoolId: 1, status: 1 });
paymentSchema.index({ transactionId: 1 });

export const Payment = mongoose.model<IPayment>('Payment', paymentSchema);
