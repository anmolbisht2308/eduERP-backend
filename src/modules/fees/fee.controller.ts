import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendSuccess } from '../../utils/response';
import * as feeService from './fee.service';
import { AppError } from '../../utils/AppError';

// Fee Heads
export const createFeeHead = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.schoolId) return next(new AppError('School ID missing', 400));
    const result = await feeService.createFeeHead(req.user.schoolId.toString(), req.body);
    sendSuccess(res, result, 'Fee head created', 201);
});

export const getFeeHeads = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.schoolId) return next(new AppError('School ID missing', 400));
    const result = await feeService.getFeeHeads(req.user.schoolId.toString());
    sendSuccess(res, result);
});

// Fee Structures
export const createFeeStructure = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.schoolId) return next(new AppError('School ID missing', 400));
    const result = await feeService.createFeeStructure(req.user.schoolId.toString(), req.body);
    sendSuccess(res, result, 'Fee structure created', 201);
});

export const getFeeStructures = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.schoolId) return next(new AppError('School ID missing', 400));
    const result = await feeService.getFeeStructures(req.user.schoolId.toString(), req.query);
    sendSuccess(res, result);
});

export const getFeeStructure = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.schoolId) return next(new AppError('School ID missing', 400));
    const result = await feeService.getFeeStructure(req.params.id as string, req.user.schoolId.toString());
    sendSuccess(res, result);
});

export const updateFeeStructure = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.schoolId) return next(new AppError('School ID missing', 400));
    const result = await feeService.updateFeeStructure(req.params.id as string, req.user.schoolId.toString(), req.body);
    sendSuccess(res, result, 'Fee structure updated');
});
