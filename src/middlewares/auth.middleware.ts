import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';
import { User, IUserDocument } from '../modules/users/user.model';
import { UserRole } from '../modules/users/user.types';

// Extend Express Request interface to include user
declare global {
    namespace Express {
        interface Request {
            user?: IUserDocument;
        }
    }
}

export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let token;
    // 1) Getting token and check of it's there
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        if (token === 'undefined' || token === 'null') token = undefined;
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    // 2) Verification token
    const decoded = jwt.verify(token, env.JWT_SECRET as jwt.Secret) as { id: string; iat: number };

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError('The user belonging to this token no longer does exist.', 401));
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
});

export const restrictTo = (...roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // roles ['admin', 'lead-guide']. role='user'
        if (!req.user || !roles.includes(req.user.role as UserRole)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }

        next();
    };
};
