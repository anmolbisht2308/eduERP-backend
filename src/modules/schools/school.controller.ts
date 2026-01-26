import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendSuccess } from '../../utils/response';
import * as schoolService from './school.service';
import { AppError } from '../../utils/AppError';

export const getMySchool = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.schoolId) {
        return next(new AppError('User does not belong to a school', 400));
    }
    const result = await schoolService.getSchoolById(req.user.schoolId.toString());
    sendSuccess(res, result);
});

export const updateMySchool = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.schoolId) {
        return next(new AppError('User does not belong to a school', 400));
    }
    const result = await schoolService.updateSchool(req.user.schoolId.toString(), req.body);
    sendSuccess(res, result, 'School settings updated successfully');
});
