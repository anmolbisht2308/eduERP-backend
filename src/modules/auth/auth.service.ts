import jwt from 'jsonwebtoken';
import { User, IUserDocument } from '../users/user.model';
import { env } from '../../config/env';
import { AppError } from '../../utils/AppError';
import { UserRole } from '../users/user.types';

const signToken = (id: string, role: string, schoolId?: string) => {
    return jwt.sign({ id, role, schoolId }, env.JWT_SECRET as jwt.Secret, {
        expiresIn: env.JWT_EXPIRES_IN as any,
    });
};

export const loginUser = async (email: string, password: string) => {
    // 1) Check if email and password exist
    if (!email || !password) {
        throw new AppError('Please provide email and password', 400);
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
        throw new AppError('Incorrect email or password', 401);
    }

    // 3) If everything ok, send token to client
    const token = signToken(user._id.toString(), user.role, user.schoolId?.toString());

    // Remove password from output
    user.password = undefined;

    return { user, token };
};

// Internal use for seeding or super admin creating users
export const createUser = async (userData: Partial<IUserDocument>) => {
    const newUser = await User.create(userData);
    return newUser;
};
