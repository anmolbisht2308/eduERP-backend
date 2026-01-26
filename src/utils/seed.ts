import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { User } from '../modules/users/user.model';
import { UserRole } from '../modules/users/user.types';
import { env } from '../config/env';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedSuperAdmin = async () => {
    try {
        await mongoose.connect(env.MONGO_URI);
        console.log('DB Connected for seeding');

        const existingAdmin = await User.findOne({ email: 'admin@edupay.com' });
        if (existingAdmin) {
            console.log('Super Admin already exists');
            process.exit();
        }

        await User.create({
            name: 'Super Admin',
            email: 'admin@edupay.com',
            password: 'adminpassword123',
            role: UserRole.SUPER_ADMIN,
        });

        console.log('Super Admin created successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedSuperAdmin();
