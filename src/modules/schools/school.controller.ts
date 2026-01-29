import { Request, Response, NextFunction } from 'express';
import * as schoolService from './school.service';
import { catchAsync } from '../../utils/catchAsync';
import { UserRole } from '../users/user.types';

export const createSchool = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { name, address, contactEmail, contactPhone, adminName, adminEmail, adminPassword } = req.body;

    const result = await schoolService.createSchool({
        name,
        address,
        contactEmail,
        contactPhone,
        adminName,
        adminEmail, // School Admin Login
        adminPassword,
    });

    res.status(201).json({
        status: 'success',
        data: result,
    });
});

export const getAllSchools = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const schools = await schoolService.getAllSchools();

    res.status(200).json({
        status: 'success',
        results: schools.length,
        data: {
            schools,
        },
    });
});

export const getMySchool = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // For school admins to get their own school details
    if (!req.user || !req.user.schoolId) {
        return res.status(400).json({ status: 'fail', message: 'User not associated with a school' });
    }

    const school = await schoolService.getSchoolById(req.user.schoolId.toString());

    res.status(200).json({
        status: 'success',
        data: {
            school,
        },
    });
});
