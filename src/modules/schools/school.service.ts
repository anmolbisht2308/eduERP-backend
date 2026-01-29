import { School, ISchool } from './school.model';
import { User } from '../users/user.model';
import { UserRole } from '../users/user.types';
import mongoose from 'mongoose';
import { AppError } from '../../utils/AppError';

interface CreateSchoolInput {
    name: string;
    address: string;
    contactEmail: string;
    contactPhone: string;
    adminName: string;
    adminEmail: string;
    adminPassword: string;
}

export const createSchool = async (input: CreateSchoolInput) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 1. Check if admin email already exists
        const existingUser = await User.findOne({ email: input.adminEmail }).session(session);
        if (existingUser) {
            throw new AppError('Admin email already in use', 400);
        }

        // 2. Create School
        const school = await School.create(
            [
                {
                    name: input.name,
                    address: input.address,
                    contactEmail: input.contactEmail,
                    contactPhone: input.contactPhone,
                    isActive: true,
                },
            ],
            { session }
        );

        // 3. Create School Admin User
        const adminUser = await User.create(
            [
                {
                    name: input.adminName,
                    email: input.adminEmail,
                    password: input.adminPassword,
                    role: UserRole.SCHOOL_ADMIN,
                    schoolId: school[0]._id as unknown as string,
                    isActive: true,
                },
            ],
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        return { school: school[0], admin: adminUser[0] };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

export const getAllSchools = async () => {
    return await School.find();
};

export const getSchoolById = async (id: string) => {
    return await School.findById(id);
};
