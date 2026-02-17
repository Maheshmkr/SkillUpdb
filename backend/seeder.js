const mongoose = require('mongoose');
const dotenv = require('dotenv');
const courses = require('./src/data/courses');
const users = require('./src/data/users');
const User = require('./src/models/User');
const Course = require('./src/models/Course');
const connectDB = require('./src/config/db');

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await Course.deleteMany();
        await User.deleteMany();

        await User.insertMany(users);
        // const adminUser = createdUsers[0]._id;

        const sampleCourses = courses.map((course) => {
            return { ...course };
        });

        await Course.insertMany(sampleCourses);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Course.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
