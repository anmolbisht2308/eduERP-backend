import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { UserRole } from '../modules/users/user.types';

export const restrictTo = (...roles: (UserRole | string)[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // req.user is populated by protect middleware
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
};
