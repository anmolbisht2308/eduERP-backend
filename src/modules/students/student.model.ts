import mongoose, { Schema, Document } from 'mongoose';

export enum StudentStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    GRADUATED = 'graduated',
    TRANSFERRED = 'transferred',
    DROPPED = 'dropped'
}

export interface IStudent extends Document {
    schoolId: mongoose.Types.ObjectId;
    academicYearId: mongoose.Types.ObjectId;
    classId: mongoose.Types.ObjectId;
    sectionId?: mongoose.Types.ObjectId;

    // Student Info
    admissionNumber: string;
    rollNumber?: string;
    firstName: string;
    lastName: string;
    dateOfBirth?: Date;
    gender?: string;

    // Parent/Guardian Info
    parentName: string;
    parentEmail?: string;
    parentPhone: string;

    // Address
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;

    // Status
    status: StudentStatus;
    admissionDate: Date;

    createdAt: Date;
    updatedAt: Date;
}

const studentSchema = new Schema<IStudent>(
    {
        schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
        academicYearId: { type: Schema.Types.ObjectId, ref: 'AcademicYear', required: true },
        classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
        sectionId: { type: Schema.Types.ObjectId, ref: 'Section' },

        // Student Info
        admissionNumber: { type: String, required: true }, // Removed global unique: true
        rollNumber: { type: String },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        dateOfBirth: { type: Date },
        gender: { type: String, enum: ['male', 'female', 'other'] },

        // Parent/Guardian Info
        parentName: { type: String, required: true },
        parentEmail: { type: String },
        parentPhone: { type: String, required: true },

        // Address
        address: { type: String },
        city: { type: String },
        state: { type: String },
        pincode: { type: String },

        // Status
        status: { type: String, enum: Object.values(StudentStatus), default: StudentStatus.ACTIVE },
        admissionDate: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

studentSchema.index({ schoolId: 1, academicYearId: 1, classId: 1 });
// Compound index to ensure uniqueness per school
studentSchema.index({ schoolId: 1, admissionNumber: 1 }, { unique: true });
studentSchema.index({ parentPhone: 1 });

export const Student = mongoose.model<IStudent>('Student', studentSchema);
