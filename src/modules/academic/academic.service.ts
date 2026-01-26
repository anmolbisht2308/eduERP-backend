import { AcademicYear } from './academic-year.model';
import { AppError } from '../../utils/AppError';

export const createAcademicYear = async (schoolId: string, data: any) => {
    return await AcademicYear.create({ ...data, schoolId });
};

export const getAcademicYears = async (schoolId: string) => {
    return await AcademicYear.find({ schoolId }).sort({ startDate: -1 });
};

export const getAcademicYear = async (id: string, schoolId: string) => {
    const year = await AcademicYear.findOne({ _id: id, schoolId });
    if (!year) throw new AppError('Academic year not found', 404);
    return year;
};

export const updateAcademicYear = async (id: string, schoolId: string, updateData: any) => {
    // If setting as current, the pre-save hook handles toggling others off
    // But findByIdAndUpdate doesn't run pre-save hooks by default unless configured or using save()
    // For simplicity, finding and saving:

    const year = await AcademicYear.findOne({ _id: id, schoolId });
    if (!year) throw new AppError('Academic year not found', 404);

    Object.assign(year, updateData);
    await year.save(); // Triggers pre-save hook for `isCurrent`
    return year;
};

export const deleteAcademicYear = async (id: string, schoolId: string) => {
    // TODO: prevent deletion if linked data exists (fees, classes etc)
    const year = await AcademicYear.findOneAndDelete({ _id: id, schoolId });
    if (!year) throw new AppError('Academic year not found', 404);
    return year;
};
