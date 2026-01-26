import mongoose, { Schema, Document } from 'mongoose';

export enum SubscriptionStatus {
    ACTIVE = 'active',
    EXPIRED = 'expired',
    CANCELLED = 'cancelled',
    TRIAL = 'trial'
}

export interface ISubscription extends Document {
    schoolId: mongoose.Types.ObjectId;
    planId: mongoose.Types.ObjectId;

    startDate: Date;
    endDate: Date;
    status: SubscriptionStatus;

    // Billing
    amount: number;
    billingCycle: 'monthly' | 'yearly';

    // Trial
    isTrial: boolean;
    trialEndDate?: Date;

    // Auto-renewal
    autoRenew: boolean;

    createdAt: Date;
    updatedAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>(
    {
        schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, unique: true },
        planId: { type: Schema.Types.ObjectId, ref: 'Plan', required: true },

        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        status: { type: String, enum: Object.values(SubscriptionStatus), default: SubscriptionStatus.ACTIVE },

        amount: { type: Number, required: true, min: 0 },
        billingCycle: { type: String, enum: ['monthly', 'yearly'], required: true },

        isTrial: { type: Boolean, default: false },
        trialEndDate: { type: Date },

        autoRenew: { type: Boolean, default: true },
    },
    { timestamps: true }
);

subscriptionSchema.index({ schoolId: 1 });
subscriptionSchema.index({ endDate: 1, status: 1 });

export const Subscription = mongoose.model<ISubscription>('Subscription', subscriptionSchema);
