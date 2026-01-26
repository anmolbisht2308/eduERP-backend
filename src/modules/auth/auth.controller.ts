import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { catchAsync } from '../../utils/catchAsync';

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const { user, token } = await authService.loginUser(email, password);

    // Cookie options
    const cookieOptions = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    };

    res.cookie('jwt', token, cookieOptions);

    res.status(200).json({
        status: 'success',
        token,
        data: {
            user,
        },
    });
});
