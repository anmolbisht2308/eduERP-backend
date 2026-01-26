import mongoose, { Schema, Document } from 'mongoose';

export interface IFeeHead extends Document {
    schoolId: mongoose.Types.ObjectId;
    name: string; // e.g., "Tuition Fee", "Transport Fee", "Lab Fee"
    description?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const feeHeadSchema = new Schema<IFeeHead>(
    {
        schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
        name: { type: String, required: true },
        description: { type: String },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export const FeeHead = mongoose.model<IFeeHead>('FeeHead', feeHeadSchema);
