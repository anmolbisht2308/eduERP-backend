import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendSuccess } from '../../utils/response';
import * as invoiceService from './invoice.service';
import { AppError } from '../../utils/AppError';

export const createManual = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.schoolId) return next(new AppError('School ID missing', 400));
    const result = await invoiceService.createManualInvoice(req.user.schoolId.toString(), req.body, req.user._id.toString());
    sendSuccess(res, result, 'Invoice created', 201);
});

export const getInvoices = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.schoolId) return next(new AppError('School ID missing', 400));
    const result = await invoiceService.getInvoices(req.user.schoolId.toString(), req.query);
    sendSuccess(res, result);
});

export const getInvoice = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.schoolId) return next(new AppError('School ID missing', 400));
    const result = await invoiceService.getInvoice(req.params.id as string, req.user.schoolId.toString());
    sendSuccess(res, result);
});

export const cancelInvoice = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.schoolId) return next(new AppError('School ID missing', 400));
    const { reason } = req.body;
    const result = await invoiceService.cancelInvoice(req.params.id as string, req.user.schoolId.toString(), reason);
    sendSuccess(res, result, 'Invoice cancelled');
});

export const bulkGenerate = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.schoolId) return next(new AppError('School ID missing', 400));
    const result = await invoiceService.bulkGenerate(req.user.schoolId.toString(), req.body, req.user._id.toString());
    sendSuccess(res, result, 'Bulk generation process completed');
});

export const getPdf = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // PDF generation placeholder
    // In real implementation, generate PDF buffer and stream it
    res.status(501).json({ message: 'PDF generation not implemented yet' });
});
