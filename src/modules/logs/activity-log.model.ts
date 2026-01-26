import mongoose, { Schema, Document } from 'mongoose';

export enum ActivityAction {
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete',
    CANCEL = 'cancel',
    REFUND = 'refund'
}

export interface IActivityLog extends Document {
    schoolId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;

    action: ActivityAction;
    entityType: string; // e.g., 'Invoice', 'Payment', 'Student'
    entityId: mongoose.Types.ObjectId;

    description: string;
    metadata?: any; // Additional context

    ipAddress?: string;
    userAgent?: string;

    createdAt: Date;
}

const activityLogSchema = new Schema<IActivityLog>(
    {
        schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

        action: { type: String, enum: Object.values(ActivityAction), required: true },
        entityType: { type: String, required: true, index: true },
        entityId: { type: Schema.Types.ObjectId, required: true, index: true },

        description: { type: String, required: true },
        metadata: { type: Schema.Types.Mixed },

        ipAddress: { type: String },
        userAgent: { type: String },
    },
    { timestamps: { createdAt: true, updatedAt: false } } // Only createdAt
);

activityLogSchema.index({ schoolId: 1, createdAt: -1 });
activityLogSchema.index({ entityType: 1, entityId: 1 });

export const ActivityLog = mongoose.model<IActivityLog>('ActivityLog', activityLogSchema);
