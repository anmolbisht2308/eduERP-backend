import { School } from './school.model';
import { AppError } from '../../utils/AppError';

export const getSchoolById = async (id: string) => {
    const school = await School.findById(id).populate('subscriptionId');
    if (!school) throw new AppError('School not found', 404);
    return school;
};

export const updateSchool = async (id: string, updateData: any) => {
    // Prevent updating sensitive fields via this endpoint if necessary
    // e.g. subscriptionId should be updated via subscription module

    const school = await School.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!school) throw new AppError('School not found', 404);
    return school;
};
