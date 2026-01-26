import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendSuccess } from '../../utils/response';
import * as classService from './class.service';
import { AppError } from '../../utils/AppError';

// Classes
export const createClass = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.schoolId) return next(new AppError('School ID missing', 400));

    const result = await classService.createClass(req.user.schoolId.toString(), req.body);
    sendSuccess(res, result, 'Class created successfully', 201);
});

export const getClasses = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.schoolId) return next(new AppError('School ID missing', 400));

    const result = await classService.getClasses(req.user.schoolId.toString());
    sendSuccess(res, result);
});

export const getClass = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.schoolId) return next(new AppError('School ID missing', 400));

    const result = await classService.getClass(req.params.id as string, req.user.schoolId.toString());
    sendSuccess(res, result);
});

export const updateClass = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.schoolId) return next(new AppError('School ID missing', 400));

    const result = await classService.updateClass(req.params.id as string, req.user.schoolId.toString(), req.body);
    sendSuccess(res, result, 'Class updated successfully');
});

export const deleteClass = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.schoolId) return next(new AppError('School ID missing', 400));

    const result = await classService.deleteClass(req.params.id as string, req.user.schoolId.toString());
    sendSuccess(res, null, 'Class deleted successfully');
});

// Sections
export const createSection = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.schoolId) return next(new AppError('School ID missing', 400));

    const result = await classService.createSection(req.user.schoolId.toString(), req.body);
    sendSuccess(res, result, 'Section created successfully', 201);
});

export const getSections = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.schoolId) return next(new AppError('School ID missing', 400));

    const { classId } = req.query;
    const result = await classService.getSections(req.user.schoolId.toString(), classId as string);
    sendSuccess(res, result);
});
