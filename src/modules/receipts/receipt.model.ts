import mongoose, { Schema, Document } from 'mongoose';

export interface IReceipt extends Document {
    schoolId: mongoose.Types.ObjectId;
    studentId: mongoose.Types.ObjectId;
    invoiceId: mongoose.Types.ObjectId;
    paymentId: mongoose.Types.ObjectId;

    receiptNumber: string; // Auto-generated unique
    receiptDate: Date;
    amount: number;

    // Immutable snapshot of payment details
    paymentMethod: string;
    transactionId?: string;

    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const receiptSchema = new Schema<IReceipt>(
    {
        schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
        studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
        invoiceId: { type: Schema.Types.ObjectId, ref: 'Invoice', required: true },
        paymentId: { type: Schema.Types.ObjectId, ref: 'Payment', required: true },

        receiptNumber: { type: String, required: true, unique: true },
        receiptDate: { type: Date, default: Date.now },
        amount: { type: Number, required: true, min: 0 },

        paymentMethod: { type: String, required: true },
        transactionId: { type: String },

        createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

receiptSchema.index({ receiptNumber: 1 });
receiptSchema.index({ schoolId: 1, studentId: 1 });

export const Receipt = mongoose.model<IReceipt>('Receipt', receiptSchema);
