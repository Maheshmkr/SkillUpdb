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

        // 1. Create Instructor first with fixed ID
        const sarahId = "642c1b9b1c1c1c1c1c1c1c1c";
        const maheshId = "642c1b9b1c1c1c1c1c1c1c1d";

        const instructorData = usersData.find(u => u.role === 'instructor') || usersData[0];
        const instructorUser = await User.create({
            ...instructorData,
            _id: sarahId
        });
        console.log(`✅ Instructor created: ${instructorUser.email}`);

        // 2. Map instructor to courses and import
        const sampleCourses = coursesData.map((course) => ({
            ...course,
            instructorId: instructorUser._id,
            instructor: instructorUser.name
        }));
        const createdCourses = await Course.insertMany(sampleCourses);
        console.log(`✅ ${createdCourses.length} courses created`);

        const uiuxCourse = createdCourses.find(c => c.title.includes('UI/UX'));

        // 3. Create other users with enrollment if applicable
        for (const userData of usersData) {
            if (userData.email === instructorUser.email) continue;

            const userToCreate = { ...userData };

            if (userToCreate.email === 'mahesh@gmail.com') {
                userToCreate._id = maheshId;
                if (uiuxCourse) {
                    console.log(`📘 Enrolling ${userToCreate.email} in ${uiuxCourse.title}`);
                    const lessons = uiuxCourse.modules[0]?.lessons || [];

                    userToCreate.enrolledCourses = [{
                        course: uiuxCourse._id,
                        progress: 100,
                        completedLessons: lessons.map(l => l.title || l.id),
                        isCompleted: true,
                        lastAccessed: Date.now()
                    }];

                    userToCreate.certificates = [{
                        course: uiuxCourse._id,
                        date: new Date('2026-03-01'),
                        pdfUrl: `/uploads/certificates/${maheshId}-${uiuxCourse._id}.pdf`
                    }];

                    userToCreate.badges = [
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
                    ];

                    userToCreate.stats = {
                        coursesCompleted: 1,
                        hoursLearned: 32,
                        skillsMastered: 12
                    };

                    // Update Course student count
                    await Course.findByIdAndUpdate(uiuxCourse._id, { $inc: { students: 1 } });
                }
            }

            await User.create(userToCreate);
            console.log(`✅ User created: ${userToCreate.email}`);
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
