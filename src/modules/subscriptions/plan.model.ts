import mongoose, { Schema, Document } from 'mongoose';

export interface IPlan extends Document {
    name: string; // e.g., "Basic", "Premium", "Enterprise"
    description?: string;

    // Pricing
    monthlyPrice: number;
    yearlyPrice: number;

    // Limits
    maxStudents: number;
    maxUsers: number;

    // Features
    features: string[];

    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const planSchema = new Schema<IPlan>(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String },
        monthlyPrice: { type: Number, required: true, min: 0 },
        yearlyPrice: { type: Number, required: true, min: 0 },
        maxStudents: { type: Number, required: true },
        maxUsers: { type: Number, required: true },
        features: [{ type: String }],
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export const Plan = mongoose.model<IPlan>('Plan', planSchema);
