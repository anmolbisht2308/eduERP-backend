import mongoose, { Schema, Document } from 'mongoose';

export interface IAcademicYear extends Document {
    schoolId: mongoose.Types.ObjectId;
    name: string;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    isCurrent: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const academicYearSchema = new Schema<IAcademicYear>(
    {
        schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
        name: { type: String, required: true }, // e.g., "2024-25"
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        isActive: { type: Boolean, default: true },
        isCurrent: { type: Boolean, default: false }, // Only one can be current per school
    },
    { timestamps: true }
);

// Compound index for school + current year lookup
academicYearSchema.index({ schoolId: 1, isCurrent: 1 });

// Ensure only one academic year is current per school
academicYearSchema.pre('save' as any, async function (next: (err?: mongoose.CallbackError) => void) {
    if (this.isCurrent) {
        await mongoose.model('AcademicYear').updateMany(
            { schoolId: this.schoolId, _id: { $ne: this._id } },
            { isCurrent: false }
        );
    }
    next();
});

export const AcademicYear = mongoose.model<IAcademicYear>('AcademicYear', academicYearSchema);
