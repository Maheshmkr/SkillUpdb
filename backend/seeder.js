const mongoose = require('mongoose');
const dotenv = require('dotenv');
const coursesData = require('./src/data/courses');
const usersData = require('./src/data/users');
const User = require('./src/models/User');
const Course = require('./src/models/Course');
const connectDB = require('./src/config/db');

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await Course.deleteMany();
        await User.deleteMany();

        console.log('🌱 Starting data import...');

        // 1. Create Users
        console.log('👥 Creating users...');
        const instructorId = "642c1b9b1c1c1c1c1c1c1c1a"; // Fixed ID for instructor@skillup.com
        const maheshId = "642c1b9b1c1c1c1c1c1c1c1d";

        const createdUsers = [];
        for (const userData of usersData) {
            let userToCreate = { ...userData };
            if (userToCreate.email === 'instructor@skillup.com') {
                userToCreate._id = instructorId;
            } else if (userToCreate.email === 'mahesh@gmail.com') {
                userToCreate._id = maheshId;
            }
            const user = await User.create(userToCreate);
            createdUsers.push(user);
            console.log(`✅ User created: ${user.email}`);
        }

        const instructorUser = createdUsers.find(u => u.email === 'instructor@skillup.com');

        // 2. Map instructor to courses and import
        console.log('📚 Importing courses...');
        const sampleCourses = coursesData.map((course, index) => {
            const updatedCourse = {
                ...course,
                instructorId: instructorUser._id,
                instructor: instructorUser.name
            };

            // Diversify demo data for instructor@skillup.com
            if (index === 0) {
                updatedCourse.status = 'Published';
                updatedCourse.students = 1250;
            } else if (index === 1) {
                updatedCourse.status = 'Draft';
                updatedCourse.students = 0;
            } else if (index === 2) {
                updatedCourse.status = 'Pending Review';
                updatedCourse.students = 0;
            } else if (index === 3) {
                updatedCourse.status = 'Published';
                updatedCourse.students = 850;
            }

            return updatedCourse;
        });

        const createdCourses = await Course.insertMany(sampleCourses);
        console.log(`✅ ${createdCourses.length} courses created for ${instructorUser.email}`);

        const uiuxCourse = createdCourses.find(c => c.title.includes('UI/UX'));

        // 3. Setup enrollment for Mahesh
        const maheshUser = createdUsers.find(u => u.email === 'mahesh@gmail.com');
        if (maheshUser && uiuxCourse) {
            console.log(`📘 Enrolling ${maheshUser.email} in ${uiuxCourse.title}`);
            const lessons = uiuxCourse.modules[0]?.lessons || [];

            await User.findByIdAndUpdate(maheshUser._id, {
                $set: {
                    enrolledCourses: [{
                        course: uiuxCourse._id,
                        progress: 100,
                        completedLessons: lessons.map(l => l.title || l.id),
                        isCompleted: true,
                        lastAccessed: Date.now()
                    }],
                    certificates: [{
                        course: uiuxCourse._id,
                        date: new Date('2026-03-01'),
                        pdfUrl: `/uploads/certificates/${maheshId}-${uiuxCourse._id}.pdf`
                    }],
                    badges: [
                        {
                            course: uiuxCourse._id,
                            name: "Curriculum Starter",
                            description: "Completed your first module in the course.",
                            icon: "/uploads/badges/starter.png",
                            earnedAt: new Date('2026-02-25')
                        },
                        {
                            course: uiuxCourse._id,
                            name: "Design Pro",
                            description: "Completed all core modules with high scores.",
                            icon: "/uploads/badges/pro.png",
                            earnedAt: new Date('2026-03-01')
                        }
                    ],
                    stats: {
                        coursesCompleted: 1,
                        hoursLearned: 32,
                        skillsMastered: 12
                    }
                }
            });

            // Update Course student count
            await Course.findByIdAndUpdate(uiuxCourse._id, { $inc: { students: 1 } });
        }

        console.log('🚀 Data Imported Successfully!');
        process.exit();
    } catch (error) {
        console.error('❌ Data Import Failed:');
        console.error(error);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Course.deleteMany();
        await User.deleteMany();

        console.log('🗑️ Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
