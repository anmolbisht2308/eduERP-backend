import { School } from '../schools/school.model';
import { User } from '../users/user.model';
import { Plan } from '../subscriptions/plan.model';
import { Subscription } from '../subscriptions/subscription.model';
import { Payment } from '../payments/payment.model';
import { UserRole } from '../users/user.types';
import { AppError } from '../../utils/AppError';
import mongoose from 'mongoose';

// School Management
export const createSchool = async (schoolData: any, adminData: any) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 1. Create School
        const school = await School.create([schoolData], { session });
        const schoolId = school[0]._id;

        // 2. Create School Admin User
        const adminUser = await User.create([{
            ...adminData,
            schoolId,
            role: UserRole.SCHOOL_ADMIN,
        }], { session });

        await session.commitTransaction();
        return { school: school[0], admin: adminUser[0] };
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

export const getAllSchools = async (query: any) => {
    // Basic pagination
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const schools = await School.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate('subscriptionId');

    const total = await School.countDocuments();

    return { schools, total, page, totalPages: Math.ceil(total / limit) };
};

export const getSchoolById = async (id: string) => {
    const school = await School.findById(id).populate('subscriptionId');
    if (!school) throw new AppError('School not found', 404);
    return school;
};

export const updateSchool = async (id: string, updateData: any) => {
    const school = await School.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!school) throw new AppError('School not found', 404);
    return school;
};

// Subscription Management
export const createPlan = async (planData: any) => {
    return await Plan.create(planData);
};

export const getAllPlans = async () => {
    return await Plan.find({ isActive: true });
};

export const assignSubscription = async (schoolId: string, planId: string, durationMonths: number = 12) => {
    const school = await School.findById(schoolId);
    if (!school) throw new AppError('School not found', 404);

    const plan = await Plan.findById(planId);
    if (!plan) throw new AppError('Plan not found', 404);

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + durationMonths);

    const subscription = await Subscription.create({
        schoolId,
        planId,
        startDate,
        endDate,
        amount: durationMonths === 12 ? plan.yearlyPrice : plan.monthlyPrice * durationMonths,
        billingCycle: durationMonths === 12 ? 'yearly' : 'monthly',
        status: 'active'
    });

    school.subscriptionId = subscription._id as any;
    await school.save();

    return subscription;
};

// Dashboard Stats
export const getStats = async () => {
    const totalSchools = await School.countDocuments();
    const totalStudents = await mongoose.model('Student').countDocuments();

    // Revenue calculation (simple sum of all payments for now)
    // Note: In real app, distinguish between platform revenue (subscriptions) vs school revenue (fees)
    // Here assuming 'Payment' tracks fee payments, Subscription tracks platform revenue.
    // Let's aggregate Subscription revenue.

    const revenueStats = await Subscription.aggregate([
        { $match: { status: 'active' } },
        { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }
    ]);

    return {
        schools: totalSchools,
        students: totalStudents,
        platformRevenue: revenueStats[0]?.totalRevenue || 0
    };
};
