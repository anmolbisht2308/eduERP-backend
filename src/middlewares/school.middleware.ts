import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const scopeSchool = (req: Request, res: Response, next: NextFunction) => {
    // Ensure user has a schoolId if they are not Super Admin
    // Super admins can access any school via params or headers, implementation depends on requirement
    // For now, if user has schoolId, we attach it to query/body to force scope

    if (!req.user) {
        return next(new AppError('User not authenticated', 401));
    }

    if (req.user.role === 'super_admin') {
        // Super admin can override school context if needed, otherwise ignore scoping
        return next();
    }

    if (!req.user.schoolId) {
        return next(new AppError('User explicitly requires a school association', 403));
    }

    // Force schoolId in filter/body for safety
    // For GET requests (filtering)
    req.query.schoolId = req.user.schoolId.toString();

    // For POST/PATCH requests (payload)
    if (req.body) {
        req.body.schoolId = req.user.schoolId.toString();
    }

    // Also attach to request object for easy access in controllers
    (req as any).schoolId = req.user.schoolId.toString();

    next();
};

export const requireSchoolSubscription = (req: Request, res: Response, next: NextFunction) => {
    // TODO: Check if school subscription is active
    // This requires fetching School model or storing subscription status in User token
    next();
};
