import mongoose, { Schema, Document } from 'mongoose';

export interface IClass extends Document {
    schoolId: mongoose.Types.ObjectId;
    academicYearId: mongoose.Types.ObjectId;
    name: string; // e.g., "Class 10", "Grade 12"
    displayOrder: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const classSchema = new Schema<IClass>(
    {
        schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
        academicYearId: { type: Schema.Types.ObjectId, ref: 'AcademicYear', required: true },
        name: { type: String, required: true },
        displayOrder: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

classSchema.index({ schoolId: 1, academicYearId: 1 });

export const Class = mongoose.model<IClass>('Class', classSchema);
