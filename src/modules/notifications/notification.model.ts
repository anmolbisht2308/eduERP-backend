import mongoose, { Schema, Document } from 'mongoose';

export enum NotificationType {
    EMAIL = 'email',
    SMS = 'sms',
    PUSH = 'push'
}

export enum NotificationStatus {
    PENDING = 'pending',
    SENT = 'sent',
    FAILED = 'failed'
}

export interface INotification extends Document {
    schoolId: mongoose.Types.ObjectId;
    recipientId?: mongoose.Types.ObjectId; // User or Student
    recipientEmail?: string;
    recipientPhone?: string;

    type: NotificationType;
    subject?: string;
    message: string;

    status: NotificationStatus;
    sentAt?: Date;
    errorMessage?: string;

    // Context
    relatedModel?: string; // e.g., 'Invoice', 'Payment'
    relatedId?: mongoose.Types.ObjectId;

    createdAt: Date;
    updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
    {
        schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
        recipientId: { type: Schema.Types.ObjectId },
        recipientEmail: { type: String },
        recipientPhone: { type: String },

        type: { type: String, enum: Object.values(NotificationType), required: true },
        subject: { type: String },
        message: { type: String, required: true },

        status: { type: String, enum: Object.values(NotificationStatus), default: NotificationStatus.PENDING },
        sentAt: { type: Date },
        errorMessage: { type: String },

        relatedModel: { type: String },
        relatedId: { type: Schema.Types.ObjectId },
    },
    { timestamps: true }
);

notificationSchema.index({ schoolId: 1, status: 1 });

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
