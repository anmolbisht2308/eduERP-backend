import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';
import { User, IUserDocument } from '../modules/users/user.model';

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

    // 4) Check if user changed password after the token was issued
    // (Optional implementation if schema supports passwordChangedAt)

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
});
