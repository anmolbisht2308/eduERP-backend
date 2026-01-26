import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendSuccess } from '../../utils/response';
import * as reportService from './report.service';
import { AppError } from '../../utils/AppError';

export const dailyCollection = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.schoolId) return next(new AppError('School ID missing', 400));
    const date = req.query.date ? new Date(req.query.date as string) : new Date();

    const result = await reportService.getDailyCollection(req.user.schoolId.toString(), date);
    sendSuccess(res, result);
});

export const monthlyCollection = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.schoolId) return next(new AppError('School ID missing', 400));

    const month = req.query.month ? parseInt(req.query.month as string) : new Date().getMonth() + 1;
    const year = req.query.year ? parseInt(req.query.year as string) : new Date().getFullYear();

    const result = await reportService.getMonthlyCollection(req.user.schoolId.toString(), month, year);
    sendSuccess(res, result);
});

export const outstanding = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.schoolId) return next(new AppError('School ID missing', 400));

    const { classId } = req.query;
    const result = await reportService.getOutstandingDues(req.user.schoolId.toString(), classId as string);
    sendSuccess(res, result);
});
