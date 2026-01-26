import mongoose, { Schema, Document } from 'mongoose';

export enum InvoiceStatus {
    PENDING = 'pending',
    PARTIALLY_PAID = 'partially_paid',
    PAID = 'paid',
    CANCELLED = 'cancelled',
    OVERDUE = 'overdue'
}

export interface IInvoiceItem {
    feeHeadId: mongoose.Types.ObjectId;
    description: string;
    amount: number;
}

export interface IInvoice extends Document {
    schoolId: mongoose.Types.ObjectId;
    academicYearId: mongoose.Types.ObjectId;
    studentId: mongoose.Types.ObjectId;
    feeStructureId?: mongoose.Types.ObjectId;

    invoiceNumber: string; // Auto-generated unique
    invoiceDate: Date;
    dueDate: Date;

    items: IInvoiceItem[];
    subtotal: number;

    // Discounts
    discountAmount: number;
    discountReason?: string;

    // Tax (GST)
    taxAmount: number;
    taxPercentage: number;

    // Late Fee
    lateFee: number;

    // Total
    totalAmount: number;
    paidAmount: number;
    balanceAmount: number;

    status: InvoiceStatus;

    // Notes
    notes?: string;

    // Cancellation
    cancelledAt?: Date;
    cancellationReason?: string;

    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const invoiceSchema = new Schema<IInvoice>(
    {
        schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
        academicYearId: { type: Schema.Types.ObjectId, ref: 'AcademicYear', required: true },
        studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
        feeStructureId: { type: Schema.Types.ObjectId, ref: 'FeeStructure' },

        invoiceNumber: { type: String, required: true, unique: true },
        invoiceDate: { type: Date, default: Date.now },
        dueDate: { type: Date, required: true },

        items: [{
            feeHeadId: { type: Schema.Types.ObjectId, ref: 'FeeHead', required: true },
            description: { type: String, required: true },
            amount: { type: Number, required: true, min: 0 }
        }],

        subtotal: { type: Number, required: true, min: 0 },
        discountAmount: { type: Number, default: 0, min: 0 },
        discountReason: { type: String },
        taxAmount: { type: Number, default: 0, min: 0 },
        taxPercentage: { type: Number, default: 0, min: 0 },
        lateFee: { type: Number, default: 0, min: 0 },
        totalAmount: { type: Number, required: true, min: 0 },
        paidAmount: { type: Number, default: 0, min: 0 },
        balanceAmount: { type: Number, required: true, min: 0 },

        status: { type: String, enum: Object.values(InvoiceStatus), default: InvoiceStatus.PENDING },

        notes: { type: String },
        cancelledAt: { type: Date },
        cancellationReason: { type: String },

        createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

invoiceSchema.index({ invoiceNumber: 1 });
invoiceSchema.index({ schoolId: 1, studentId: 1 });
invoiceSchema.index({ schoolId: 1, status: 1 });
invoiceSchema.index({ dueDate: 1, status: 1 });

export const Invoice = mongoose.model<IInvoice>('Invoice', invoiceSchema);
