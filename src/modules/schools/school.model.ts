import mongoose, { Schema, Document } from 'mongoose';

export interface ISchool extends Document {
    name: string;
    address: string;
    city?: string;
    state?: string;
    pincode?: string;
    contactEmail: string;
    contactPhone: string;

    // GST Details
    gstNumber?: string;
    panNumber?: string;

    // Branding
    logo?: string;

    // Billing Settings
    invoicePrefix?: string; // e.g., "SCH-2024-"
    receiptPrefix?: string;
    paymentPrefix?: string;

    // Current subscription
    subscriptionId?: mongoose.Types.ObjectId;

    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const schoolSchema = new Schema<ISchool>(
    {
        name: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String },
        state: { type: String },
        pincode: { type: String },
        contactEmail: { type: String, required: true },
        contactPhone: { type: String, required: true },

        gstNumber: { type: String },
        panNumber: { type: String },

        logo: { type: String },

        invoicePrefix: { type: String, default: 'INV' },
        receiptPrefix: { type: String, default: 'REC' },
        paymentPrefix: { type: String, default: 'PAY' },

        subscriptionId: { type: Schema.Types.ObjectId, ref: 'Subscription' },

        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export const School = mongoose.model<ISchool>('School', schoolSchema);
