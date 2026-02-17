const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const connectDB = require('./src/config/db');

dotenv.config();

connectDB();

const createUsers = async () => {
    try {
        // Clear existing users
        await User.deleteMany();

        // Create users
        const users = [
            {
                name: 'Admin User',
                email: 'admin@skillup.com',
                password: 'admin123',
                role: 'admin'
            },
            {
                name: 'Instructor User',
                email: 'instructor@skillup.com',
                password: 'password123',
                role: 'instructor'
            },
            {
                name: 'Student User',
                email: 'student@skillup.com',
                password: 'student123',
                role: 'user'
            }
        ];

        // Create users using .create() to trigger hashing middleware
        for (const user of users) {
            await User.create(user);
        }

        console.log('✅ Users created successfully!');
        console.log('');
        console.log('Login Credentials:');
        console.log('==================');
        console.log('Admin:');
        console.log('  Email: admin@skillup.com');
        console.log('  Password: admin123');
        console.log('');
        console.log('Instructor:');
        console.log('  Email: instructor@skillup.com');
        console.log('  Password: password123');
        console.log('');
        console.log('Student:');
        console.log('  Email: student@skillup.com');
        console.log('  Password: student123');
        console.log('');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating users:', error);
        process.exit(1);
    }
};

createUsers();
