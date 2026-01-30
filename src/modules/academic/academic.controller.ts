import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendSuccess } from '../../utils/response';
import * as academicService from './academic.service';
import { AppError } from '../../utils/AppError';

export const createAcademicYear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.schoolId) return next(new AppError('School ID missing', 400));

    const result = await academicService.createAcademicYear(req.user.schoolId.toString(), req.body);
    sendSuccess(res, result, 'Academic year created successfully', 201);
});

export const getAcademicYears = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.schoolId) return next(new AppError('School ID missing', 400));

    const result = await academicService.getAcademicYears(req.user.schoolId.toString());
    sendSuccess(res, result);
});

export const getAcademicYear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.schoolId) return next(new AppError('School ID missing', 400));

    const result = await academicService.getAcademicYear(req.params.id as string, req.user.schoolId.toString());
    sendSuccess(res, result);
});

export const updateAcademicYear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.schoolId) return next(new AppError('School ID missing', 400));

    const result = await academicService.updateAcademicYear(req.params.id as string, req.user.schoolId.toString(), req.body);
    sendSuccess(res, result, 'Academic year updated successfully');
});

export const deleteAcademicYear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.schoolId) return next(new AppError('School ID missing', 400));

    const result = await academicService.deleteAcademicYear(req.params.id as string, req.user.schoolId.toString());
    sendSuccess(res, null, 'Academic year deleted successfully');
});

export const setCurrentAcademicYear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.schoolId) return next(new AppError('School ID missing', 400));

    const result = await academicService.setCurrentAcademicYear(req.params.id as string, req.user.schoolId.toString());
    sendSuccess(res, result, 'Current academic year updated successfully');
});
