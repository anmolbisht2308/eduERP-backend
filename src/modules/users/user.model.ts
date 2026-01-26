import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser, UserRole } from './user.types';

export interface IUserDocument extends Omit<IUser, '_id'>, Document {
    comparePassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUserDocument>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, select: false },
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.STUDENT,
        },
        schoolId: { type: Schema.Types.ObjectId, ref: 'School' },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// Hash password before saving
userSchema.pre('save' as any, async function (next: (err?: mongoose.CallbackError) => void) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    if (this.password) {
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password || '');
};

export const User = mongoose.model<IUserDocument>('User', userSchema);
