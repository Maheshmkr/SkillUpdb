const mongoose = require('mongoose');
const dotenv = require('dotenv');
const coursesData = require('./src/data/courses');
const usersData = require('./src/data/users');
const User = require('./src/models/User');
const Course = require('./src/models/Course');
const Module = require('./src/models/Module');
const Lesson = require('./src/models/Lesson');
const Enrollment = require('./src/models/Enrollment');
const Review = require('./src/models/Review');
const connectDB = require('./src/config/db');

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await Course.deleteMany();
        await User.deleteMany();
        await Module.deleteMany();
        await Lesson.deleteMany();
        await Enrollment.deleteMany();
        await Review.deleteMany();

        console.log('🌱 Starting data import...');

        // 1. Create Users
        console.log('👥 Creating users...');
        const instructorId = '642c1b9b1c1c1c1c1c1c1c1a';
        const maheshId = '642c1b9b1c1c1c1c1c1c1c1d';

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
        }
        console.log('✅ Users created');

        const instructorUser = createdUsers.find(u => u.email === 'instructor@skillup.com');

        // 2. Map instructor to courses and import
        console.log('📚 Importing courses & curriculum...');
        let uiuxCourseId = null;
        let uiuxLessons = [];

        for (let i = 0; i < coursesData.length; i++) {
            const courseData = coursesData[i];
            const courseDocs = {
                title: courseData.title,
                subtitle: courseData.subtitle,
                category: courseData.category,
                level: courseData.level,
                language: courseData.language,
                duration: courseData.duration,
                thumbnail: courseData.thumbnail,
                whatYouWillLearn: courseData.whatYouWillLearn,
                skills: courseData.skills,
                includes: courseData.includes,
                requirements: courseData.requirements,
                targetAudience: courseData.targetAudience,
                price: courseData.price,
                originalPrice: courseData.originalPrice,
                hasMoneyBackGuarantee: courseData.hasMoneyBackGuarantee,
                instructorId: instructorUser._id,
                instructor: instructorUser.name,
                badges: courseData.badges,
                certificateConfig: courseData.certificateConfig,
                gatingEnabled: courseData.gatingEnabled,
                students: courseData.students,
                rating: courseData.rating,
                reviews: courseData.reviews,
                totalLessons: 0,
                totalModules: 0,
                image: courseData.image,
                badge: courseData.badge,
                badgeColor: courseData.badgeColor,
                hours: courseData.hours,
                description: courseData.description,
            };

            // Diversify demo data
            if (i === 0) {
                courseDocs.status = 'Published';
                courseDocs.students = 1250;
            } else if (i === 1) {
                courseDocs.status = 'Draft';
                courseDocs.students = 0;
            } else if (i === 2) {
                courseDocs.status = 'Pending Review';
                courseDocs.students = 0;
            } else if (i === 3) {
                courseDocs.status = 'Published';
                courseDocs.students = 850;
            }

            const createdCourse = await Course.create(courseDocs);

            if (courseData.title && courseData.title.includes('UI/UX')) {
                uiuxCourseId = createdCourse._id;
            }

            // Create modules and lessons independently
            if (courseData.modules) {
                for (let m = 0; m < courseData.modules.length; m++) {
                    const modData = courseData.modules[m];
                    const mod = await Module.create({
                        courseId: createdCourse._id,
                        title: modData.title,
                        orderIndex: m
                    });

                    if (modData.lessons) {
                        for (let l = 0; l < modData.lessons.length; l++) {
                            const lesData = modData.lessons[l];
                            const lesson = await Lesson.create({
                                courseId: createdCourse._id,
                                moduleId: mod._id,
                                title: lesData.title,
                                type: lesData.type || 'video',
                                contentUrl: lesData.contentUrl,
                                description: lesData.description,
                                questions: lesData.questions || [],
                                orderIndex: l
                            });

                            if (
                                uiuxCourseId &&
                                createdCourse._id.toString() === uiuxCourseId.toString() &&
                                m === 0
                            ) {
                                uiuxLessons.push(lesson._id);
                            }
                        }
                    }
                }
            }
        } // end course creation loop

        // Update aggregate totals now that all modules/lessons are created
        for (let j = 0; j < coursesData.length; j++) {
            const courseData = coursesData[j];
            const found = await Course.findOne({ title: courseData.title });
            if (found) {
                const moduleCount = await Module.countDocuments({ courseId: found._id });
                const lessonCount = await Lesson.countDocuments({ courseId: found._id });
                await Course.findByIdAndUpdate(found._id, {
                    totalModules: moduleCount,
                    totalLessons: lessonCount
                });
            }
        }
        console.log('✅ Aggregate counts updated');

        // 3. Setup enrollment for Mahesh
        const maheshUser = createdUsers.find(u => u.email === 'mahesh@gmail.com');
        if (maheshUser && uiuxCourseId) {
            console.log(`📘 Enrolling ${maheshUser.email} in UI/UX`);

            await Enrollment.create({
                userId: maheshUser._id,
                courseId: uiuxCourseId,
                progressPercentage: 100,
                completedLessonIds: uiuxLessons,
                isCompleted: true,
                lastAccessed: Date.now()
            });

            await User.findByIdAndUpdate(maheshUser._id, {
                $push: {
                    certificates: {
                        course: uiuxCourseId,
                        date: new Date('2026-03-01'),
                        pdfUrl: `/uploads/certificates/${maheshId}-${uiuxCourseId}.pdf`
                    },
                    badges: {
                        $each: [
                            { course: uiuxCourseId, name: 'Curriculum Starter', description: 'Completed your first module', icon: '/uploads/badges/starter.png' },
                            { course: uiuxCourseId, name: 'Design Pro', description: 'Completed all core modules', icon: '/uploads/badges/pro.png' }
                        ]
                    }
                },
                $set: {
                    stats: {
                        coursesCompleted: 1,
                        hoursLearned: 32,
                        skillsMastered: 12
                    }
                }
            });

            await Course.findByIdAndUpdate(uiuxCourseId, { $inc: { students: 1 } });
            console.log('✅ Enrollment and Certificates created');
        }

        console.log('🚀 Data Imported Successfully!');
        process.exit();
    } catch (error) {
        console.error('❌ Data Import Failed:', error);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Course.deleteMany();
        await User.deleteMany();
        await Module.deleteMany();
        await Lesson.deleteMany();
        await Enrollment.deleteMany();
        await Review.deleteMany();

        console.log('🗑️  Data Destroyed!');
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
