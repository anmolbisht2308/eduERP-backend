import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendSuccess } from '../../utils/response';
import * as superAdminService from './super-admin.service';
import { User } from '../users/user.model'; // For impersonation
import { AppError } from '../../utils/AppError';
import { env } from '../../config/env';
import jwt from 'jsonwebtoken';

// Schools
export const createSchool = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { school, admin } = req.body;
    const result = await superAdminService.createSchool(school, admin);
    sendSuccess(res, result, 'School and Admin created successfully', 201);
});

export const getSchools = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await superAdminService.getAllSchools(req.query);
    sendSuccess(res, result);
});

export const getSchool = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await superAdminService.getSchoolById(req.params.id as string);
    sendSuccess(res, result);
});

export const updateSchool = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await superAdminService.updateSchool(req.params.id as string, req.body);
    sendSuccess(res, result, 'School updated successfully');
});

// Plans
export const createPlan = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await superAdminService.createPlan(req.body);
    sendSuccess(res, result, 'Plan created successfully', 201);
});

export const getPlans = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await superAdminService.getAllPlans();
    sendSuccess(res, result);
});

export const assignPlan = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { schoolId, planId, duration } = req.body;
    const result = await superAdminService.assignSubscription(schoolId, planId, duration);
    sendSuccess(res, result, 'Subscription assigned successfully');
});

// Stats
export const getDashboardStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await superAdminService.getStats();
    sendSuccess(res, result);
});

// Impersonation
export const impersonateSchool = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { schoolId } = req.body; // or params

    // Find absolute admin for this school? Or just find any admin?
    // Usually super admin wants to login as the School Admin.
    const schoolAdmin = await User.findOne({ schoolId, role: 'school_admin' });

    if (!schoolAdmin) {
        return next(new AppError('No school admin found for this school', 404));
    }

    // Generate token for this user
    const token = jwt.sign(
        { id: schoolAdmin._id, role: schoolAdmin.role, schoolId: schoolAdmin.schoolId },
        env.JWT_SECRET as jwt.Secret,
        { expiresIn: '1h' }
    );

    sendSuccess(res, { token, user: schoolAdmin }, 'Impersonation successful');
});
