export enum UserRole {
    SUPER_ADMIN = 'super_admin',
    SCHOOL_ADMIN = 'school_admin',
    ACCOUNTANT = 'accountant',
    PARENT = 'parent',
    STUDENT = 'student',
}

export interface IUser {
    _id?: string;
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    schoolId?: string; // Reference to School
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
