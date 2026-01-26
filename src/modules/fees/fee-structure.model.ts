import mongoose, { Schema, Document } from 'mongoose';

export enum FeeFrequency {
    ONE_TIME = 'one_time',
    MONTHLY = 'monthly',
    QUARTERLY = 'quarterly',
    HALF_YEARLY = 'half_yearly',
    YEARLY = 'yearly'
}

export interface IFeeComponent {
    feeHeadId: mongoose.Types.ObjectId;
    amount: number;
}

export interface IInstallment {
    name: string; // e.g., "1st Installment", "Q1"
    dueDate: Date;
    amount: number;
}

export interface IFeeStructure extends Document {
    schoolId: mongoose.Types.ObjectId;
    academicYearId: mongoose.Types.ObjectId;
    classId: mongoose.Types.ObjectId;

    name: string; // e.g., "Class 10 - Regular Fee"
    frequency: FeeFrequency;

    feeComponents: IFeeComponent[]; // Array of fee heads with amounts
    totalAmount: number;

    // Installments
    installments: IInstallment[];

    // Discount & Late Fee
    allowDiscount: boolean;
    lateFeePerDay?: number;

    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const feeStructureSchema = new Schema<IFeeStructure>(
    {
        schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
        academicYearId: { type: Schema.Types.ObjectId, ref: 'AcademicYear', required: true },
        classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },

        name: { type: String, required: true },
        frequency: { type: String, enum: Object.values(FeeFrequency), required: true },

        feeComponents: [{
            feeHeadId: { type: Schema.Types.ObjectId, ref: 'FeeHead', required: true },
            amount: { type: Number, required: true, min: 0 }
        }],

        totalAmount: { type: Number, required: true, min: 0 },

        installments: [{
            name: { type: String, required: true },
            dueDate: { type: Date, required: true },
            amount: { type: Number, required: true, min: 0 }
        }],

        allowDiscount: { type: Boolean, default: false },
        lateFeePerDay: { type: Number, min: 0 },

        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

feeStructureSchema.index({ schoolId: 1, academicYearId: 1, classId: 1 });

export const FeeStructure = mongoose.model<IFeeStructure>('FeeStructure', feeStructureSchema);
