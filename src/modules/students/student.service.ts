import mongoose from 'mongoose';
import { Student, StudentStatus } from './student.model';
import { AppError } from '../../utils/AppError';

export const createStudent = async (schoolId: string, data: any) => {
    // 1. Get Current Academic Year
    const currentYear = await mongoose.model('AcademicYear').findOne({ schoolId, isCurrent: true });
    if (!currentYear) {
        throw new AppError('No active academic year found. Please set a current academic year first.', 400);
    }

    // 2. Prepare Data
    const studentData = {
        ...data,
        schoolId,
        academicYearId: currentYear._id
    };

    // 3. Sanitize sectionId (Mongoose throws CastError for empty string)
    if (!studentData.sectionId) {
        delete studentData.sectionId;
    }

    // 4. Check Duplicate Admission Number
    const existing = await Student.findOne({
        schoolId,
        admissionNumber: data.admissionNumber
    });

    if (existing) {
        throw new AppError('Admission number already exists', 400);
    }

    return await Student.create(studentData);
};

export const getStudents = async (schoolId: string, query: any) => {
    const {
        page = 1,
        limit = 10,
        search,
        classId,
        sectionId,
        academicYearId,
        status
    } = query;

    const filter: any = { schoolId };

    if (search) {
        filter.$or = [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
            { admissionNumber: { $regex: search, $options: 'i' } },
            { parentPhone: { $regex: search, $options: 'i' } }
        ];
    }

    if (classId) filter.classId = classId;
    if (sectionId) filter.sectionId = sectionId;
    if (academicYearId) filter.academicYearId = academicYearId;
    if (status) filter.status = status;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const students = await Student.find(filter)
        .populate('classId', 'name')
        .populate('sectionId', 'name')
        .populate('academicYearId', 'name')
        .sort({ firstName: 1 })
        .skip(skip)
        .limit(parseInt(limit as string));

    const total = await Student.countDocuments(filter);

    return {
        students,
        total,
        page: parseInt(page as string),
        totalPages: Math.ceil(total / parseInt(limit as string))
    };
};

export const getStudent = async (id: string, schoolId: string) => {
    const student = await Student.findOne({ _id: id, schoolId })
        .populate('classId', 'name')
        .populate('sectionId', 'name')
        .populate('academicYearId', 'name');

    if (!student) throw new AppError('Student not found', 404);
    return student;
};

export const updateStudent = async (id: string, schoolId: string, updateData: any) => {
    const student = await Student.findOneAndUpdate(
        { _id: id, schoolId },
        updateData,
        { new: true, runValidators: true }
    );

    if (!student) throw new AppError('Student not found', 404);
    return student;
};

export const updateStudentStatus = async (id: string, schoolId: string, status: StudentStatus) => {
    const student = await Student.findOneAndUpdate(
        { _id: id, schoolId },
        { status },
        { new: true }
    );

    if (!student) throw new AppError('Student not found', 404);
    return student;
};

export const bulkCreateStudents = async (schoolId: string, studentsData: any[]) => {
    // Basic implementation for bulk import
    // In production, validate each record and handle errors gracefully
    const studentsWithSchool = studentsData.map(s => ({ ...s, schoolId }));
    return await Student.insertMany(studentsWithSchool);
};
