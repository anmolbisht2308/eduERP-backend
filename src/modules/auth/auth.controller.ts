import { Request, Response, NextFunction } from 'express';
import { User } from '../users/user.model';
import { AppError } from '../../utils/AppError';
import { sendSuccess } from '../../utils/response';
import { catchAsync } from '../../utils/catchAsync';
import * as authService from './auth.service';
import * as otpService from './otp.service';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';

const signToken = (id: string, role: string, schoolId?: string) => {
    return jwt.sign({ id, role, schoolId }, env.JWT_SECRET as jwt.Secret, {
        expiresIn: env.JWT_EXPIRES_IN as any,
    });
};

const signRefreshToken = (id: string) => {
    return jwt.sign({ id }, env.JWT_REFRESH_SECRET as jwt.Secret, {
        expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
    });
};

const createSendToken = (user: any, statusCode: number, res: Response, message: string) => {
    const token = signToken(user._id.toString(), user.role, user.schoolId?.toString());
    const refreshToken = signRefreshToken(user._id.toString());

    // Cookie options
    const cookieOptions = {
        expires: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
    };

    res.cookie('token', token, cookieOptions);
    res.cookie('refreshToken', refreshToken, {
        ...cookieOptions,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    // Remove password from output
    user.password = undefined;

    sendSuccess(res, { user, token, refreshToken }, message, statusCode);
};

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const { user } = await authService.loginUser(email, password);
    createSendToken(user, 200, res, 'Login successful');
});

export const logout = (req: Request, res: Response) => {
    res.cookie('token', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.cookie('refreshToken', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    sendSuccess(res, null, 'Logout successful');
};

export const refreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.cookies || req.body;

    if (!refreshToken) {
        return next(new AppError('Refresh token not found', 401));
    }

    let decoded: any;
    try {
        decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET as jwt.Secret);
    } catch (err) {
        return next(new AppError('Invalid refresh token', 401));
    }

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError('User no longer exists', 401));
    }

    createSendToken(currentUser, 200, res, 'Token refreshed successfully');
});

export const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    sendSuccess(res, { user: req.user }, 'User profile retrieved');
});

// OTP Flow
export const sendOTP = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { phone } = req.body;
    if (!phone) return next(new AppError('Phone number is required', 400));

    // For demo/dev: generate 123456 implies dev mode or simple testing
    const otp = env.NODE_ENV === 'development' ? '123456' : otpService.generateOTP();

    otpService.storeOTP(phone, otp);
    await otpService.sendOTP(phone, otp);

    sendSuccess(res, { phone }, 'OTP sent successfully');
});

export const verifyOTP = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { phone, otp } = req.body;
    if (!phone || !otp) return next(new AppError('Phone and OTP are required', 400));

    const isValid = otpService.verifyOTP(phone, otp);
    if (!isValid) return next(new AppError('Invalid or expired OTP', 400));

    // Find or create user logic would go here. For now, assuming user exists or partial login.
    // This part depends on if we treat OTP as a primary login method. 
    // Implementing simpler response for now.

    sendSuccess(res, { verified: true }, 'OTP verified successfully');
});
