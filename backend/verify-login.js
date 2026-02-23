const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
const connectDB = require('./src/config/db');

dotenv.config();

const verifyLogin = async () => {
    try {
        await connectDB();

        const testUsers = [
            { email: 'mahesh@gmail.com', password: 'password123' },
            { email: 'instructor@example.com', password: 'password123' }
        ];

        console.log('🧪 Verifying Login for seeded users...\n');

        for (const testUser of testUsers) {
            const user = await User.findOne({ email: testUser.email });
            if (!user) {
                console.log(`❌ User NOT found: ${testUser.email}`);
                continue;
            }

            const isMatch = await user.matchPassword(testUser.password);
            if (isMatch) {
                console.log(`✅ Login SUCCESS: ${testUser.email}`);
            } else {
                console.log(`❌ Login FAILED (Password Mismatch): ${testUser.email}`);
                console.log(`   Stored hash starts with: ${user.password.substring(0, 10)}...`);
            }
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

verifyLogin();
