import { School } from '../schools/school.model';
import { User } from '../users/user.model';
import { UserRole } from '../users/user.types';

export const getDashboardStats = async () => {
    // 1. Total Schools
    const totalSchools = await School.countDocuments();
    const activeSchools = await School.countDocuments({ isActive: true });

    // 2. Total Revenue (Placeholder for now until Payments module is ready)
    const totalRevenue = 0;

    // 3. Active Students (Placeholder until Students module is ready)
    const activeStudents = 0;

    return {
        totalSchools,
        activeSchools,
        totalRevenue,
        activeStudents
    };
};
