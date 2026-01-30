import { Class } from './class.model';
import { Section } from './section.model';
import { AppError } from '../../utils/AppError';

import { AcademicYear } from '../academic/academic-year.model';

// Class Services
export const createClass = async (schoolId: string, data: any) => {
    // Auto-assign current academic year if not provided
    if (!data.academicYearId) {
        const currentYear = await AcademicYear.findOne({ schoolId, isCurrent: true });
        if (!currentYear) throw new AppError('No active academic year found. Please create one first.', 400);
        data.academicYearId = currentYear._id;
    }

    return await Class.create({ ...data, schoolId });
};

export const getClasses = async (schoolId: string) => {
    return await Class.find({ schoolId }).sort({ displayOrder: 1 }).populate('academicYearId', 'name');
};

export const getClass = async (id: string, schoolId: string) => {
    const cls = await Class.findOne({ _id: id, schoolId });
    if (!cls) throw new AppError('Class not found', 404);
    return cls;
};

export const updateClass = async (id: string, schoolId: string, data: any) => {
    const cls = await Class.findOneAndUpdate({ _id: id, schoolId }, data, { new: true, runValidators: true });
    if (!cls) throw new AppError('Class not found', 404);
    return cls;
};

export const deleteClass = async (id: string, schoolId: string) => {
    const cls = await Class.findOneAndDelete({ _id: id, schoolId });
    if (!cls) throw new AppError('Class not found', 404);
    // TODO: Cascade delete sections or prevent if students exist
    return cls;
};

// Section Services
export const createSection = async (schoolId: string, data: any) => {
    return await Section.create({ ...data, schoolId });
};

export const getSections = async (schoolId: string, classId?: string) => {
    const query: any = { schoolId };
    if (classId) query.classId = classId;

    return await Section.find(query).populate('classId', 'name');
};
