import { Notification, NotificationType, NotificationStatus } from './notification.model';
import * as emailService from './email.service';

export const createNotification = async (schoolId: string, data: any) => {
    return await Notification.create({ ...data, schoolId });
};

export const sendNotification = async (schoolId: string, data: any) => {
    // 1. Create Record
    const notification = await createNotification(schoolId, {
        ...data,
        status: NotificationStatus.PENDING
    });

    try {
        // 2. Send via Provider
        if (data.type === NotificationType.EMAIL && data.recipientEmail) {
            await emailService.sendEmail(data.recipientEmail, data.subject || 'Notification', data.message);

            notification.status = NotificationStatus.SENT;
            notification.sentAt = new Date();
        }
        // SMS implementation placeholder
        else {
            // ... SMS logic
        }

        await notification.save();
        return notification;
    } catch (error: any) {
        notification.status = NotificationStatus.FAILED;
        notification.errorMessage = error.message;
        await notification.save();
        // Return notification even if failed, controller checks status
        return notification;
    }
};

export const getNotifications = async (schoolId: string, query: any) => {
    const { page = 1, limit = 20, status, type } = query;
    const filter: any = { schoolId };

    if (status) filter.status = status;
    if (type) filter.type = type;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const notifications = await Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit as string));

    const total = await Notification.countDocuments(filter);

    return { notifications, total, page: parseInt(page as string) };
};
