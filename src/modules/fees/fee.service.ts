import { FeeHead } from './fee-head.model';
import { FeeStructure } from './fee-structure.model';
import { AppError } from '../../utils/AppError';

// Fee Heads
export const createFeeHead = async (schoolId: string, data: any) => {
    return await FeeHead.create({ ...data, schoolId });
};

export const getFeeHeads = async (schoolId: string) => {
    return await FeeHead.find({ schoolId, isActive: true });
};

// Fee Structures
export const createFeeStructure = async (schoolId: string, data: any) => {
    // Validate if fee heads belong to school (optional but good practice)
    // Calculate total amount from components if not provided or validate it

    // For now, trusting processed data from controller/validation
    return await FeeStructure.create({ ...data, schoolId });
};

export const getFeeStructures = async (schoolId: string, query: any) => {
    const filter: any = { schoolId };
    if (query.classId) filter.classId = query.classId;
    if (query.academicYearId) filter.academicYearId = query.academicYearId;

    return await FeeStructure.find(filter)
        .populate('feeComponents.feeHeadId', 'name')
        .populate('classId', 'name')
        .populate('academicYearId', 'name');
};

export const getFeeStructure = async (id: string, schoolId: string) => {
    const structure = await FeeStructure.findOne({ _id: id, schoolId })
        .populate('feeComponents.feeHeadId', 'name')
        .populate('classId', 'name');

    if (!structure) throw new AppError('Fee structure not found', 404);
    return structure;
};

export const updateFeeStructure = async (id: string, schoolId: string, data: any) => {
    const structure = await FeeStructure.findOneAndUpdate(
        { _id: id, schoolId },
        data,
        { new: true, runValidators: true }
    );
    if (!structure) throw new AppError('Fee structure not found', 404);
    return structure;
};
