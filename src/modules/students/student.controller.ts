import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendSuccess } from '../../utils/response';
import * as studentService from './student.service';
import { AppError } from '../../utils/AppError';
import { StudentStatus } from './student.model';

export const createStudent = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.schoolId) return next(new AppError('School ID missing', 400));

    const result = await studentService.createStudent(req.user.schoolId.toString(), req.body);
    sendSuccess(res, result, 'Student admitted successfully', 201);
});

export const getStudents = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.schoolId) return next(new AppError('School ID missing', 400));

    const result = await studentService.getStudents(req.user.schoolId.toString(), req.query);
    sendSuccess(res, result);
});

export const getStudent = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.schoolId) return next(new AppError('School ID missing', 400));

    const result = await studentService.getStudent(req.params.id as string, req.user.schoolId.toString());
    sendSuccess(res, result);
});

export const updateStudent = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.schoolId) return next(new AppError('School ID missing', 400));

    const result = await studentService.updateStudent(req.params.id as string, req.user.schoolId.toString(), req.body);
    sendSuccess(res, result, 'Student updated successfully');
});

export const updateStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.schoolId) return next(new AppError('School ID missing', 400));

    const { status } = req.body;
    const result = await studentService.updateStudentStatus(req.params.id as string, req.user.schoolId.toString(), status as StudentStatus);
    sendSuccess(res, result, 'Student status updated successfully');
});

export const bulkImport = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.schoolId) return next(new AppError('School ID missing', 400));

    const { students } = req.body; // Expecting array of student objects
    if (!students || !Array.isArray(students)) {
        return next(new AppError('Invalid data format. Expected array of students.', 400));
    }

    const result = await studentService.bulkCreateStudents(req.user.schoolId.toString(), students);
    sendSuccess(res, result, `${result.length} students imported successfully`, 201);
});
