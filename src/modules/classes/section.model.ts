import mongoose, { Schema, Document } from 'mongoose';

export interface ISection extends Document {
    schoolId: mongoose.Types.ObjectId;
    academicYearId: mongoose.Types.ObjectId;
    classId: mongoose.Types.ObjectId;
    name: string; // e.g., "A", "B", "Morning Batch"
    capacity?: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const sectionSchema = new Schema<ISection>(
    {
        schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
        academicYearId: { type: Schema.Types.ObjectId, ref: 'AcademicYear', required: true },
        classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
        name: { type: String, required: true },
        capacity: { type: Number },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

sectionSchema.index({ schoolId: 1, classId: 1 });

export const Section = mongoose.model<ISection>('Section', sectionSchema);
