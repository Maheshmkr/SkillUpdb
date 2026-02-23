const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./src/models/Course');
const User = require('./src/models/User');
const connectDB = require('./src/config/db');

dotenv.config();

const checkDB = async () => {
    try {
        await connectDB();

        console.log('--- COURSES ---');
        const courses = await Course.find({});
        console.log(`Found ${courses.length} courses:`);
        courses.forEach(c => {
            console.log(`- ${c.title} (Status: ${c.status})`);
            console.log(`  Modules: ${c.modules.length}`);
        });

        console.log('\n--- USERS ---');
        const users = await User.find({});
        for (const u of users) {
            console.log(`- ${u.name} (${u.email}) - ID: ${u._id} - Role: ${u.role}`);
            console.log(`  Enrolled Courses: ${u.enrolledCourses.length}`);
            u.enrolledCourses.forEach(e => {
                console.log(`    * Course ID: ${e.course}, Progress: ${e.progress}%`);
            });
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkDB();
