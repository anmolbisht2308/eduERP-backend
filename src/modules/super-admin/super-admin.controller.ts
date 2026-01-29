import { Request, Response, NextFunction } from 'express';
import * as superAdminService from './super-admin.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendSuccess } from '../../utils/response';

export const getStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const stats = await superAdminService.getDashboardStats();
    sendSuccess(res, stats, 'Dashboard stats retrieved successfully');
});
