import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendSuccess } from '../../utils/response';
import * as notificationService from './notification.service';
import { AppError } from '../../utils/AppError';

export const send = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.schoolId) return next(new AppError('School ID missing', 400));

    // Expects recipientEmail, type, message, subject
    const result = await notificationService.sendNotification(req.user.schoolId.toString(), req.body);
    sendSuccess(res, result, 'Notification processed');
});

export const getLogs = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.schoolId) return next(new AppError('School ID missing', 400));

    const result = await notificationService.getNotifications(req.user.schoolId.toString(), req.query);
    sendSuccess(res, result);
});
