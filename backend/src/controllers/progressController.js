const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Course = require('../models/Course');

// @desc    Update course progress
// @route   PUT /api/users/progress
// @access  Private
const updateProgress = asyncHandler(async (req, res) => {
    const { courseId, lessonId } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    const course = await Course.findOne({ $or: [{ _id: courseId }, { id: courseId }] }); // Handle both ObjectId and string ID

    if (!user || !course) {
        res.status(404);
        throw new Error('User or Course not found');
    }

    // Find enrollment
    const enrollmentIndex = user.enrolledCourses.findIndex(
        (e) => e.course.toString() === course._id.toString()
    );

    if (enrollmentIndex === -1) {
        // First time access - enroll user
        user.enrolledCourses.push({
            course: course._id,
            progress: 0,
            completedLessons: [],
            isCompleted: false
        });
    }

    const enrollment = user.enrolledCourses.find(
        (e) => e.course.toString() === course._id.toString()
    );

    // Update completed lessons if not already completed
    if (lessonId && !enrollment.completedLessons.includes(lessonId)) {
        enrollment.completedLessons.push(lessonId);
    }

    // Calculate progress
    // Flatten modules to get total lesson count
    const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
    const completedCount = enrollment.completedLessons.length;

    enrollment.progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
    enrollment.lastAccessed = Date.now();

    // Check for completion
    if (enrollment.progress === 100 && !enrollment.isCompleted) {
        enrollment.isCompleted = true;

        // Generate Certificate
        user.certificates.push({
            course: course._id,
            date: Date.now(),
            pdfUrl: `https://skillup-certificates.s3.amazonaws.com/${user._id}-${course._id}.pdf` // Mock URL for now
        });

        user.stats.coursesCompleted += 1;
        user.stats.skillsMastered += 1; // Simple increment for now
    }

    await user.save();

    res.json({
        progress: enrollment.progress,
        isCompleted: enrollment.isCompleted,
        completedLessons: enrollment.completedLessons,
        certificate: enrollment.isCompleted ? user.certificates[user.certificates.length - 1] : null
    });
});

// @desc    Get course progress
// @route   GET /api/users/progress/:courseId
// @access  Private
const getProgress = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);
    const course = await Course.findOne({ $or: [{ _id: courseId }, { id: courseId }] });

    if (!user || !course) {
        res.status(404);
        throw new Error('User or Course not found');
    }

    const enrollment = user.enrolledCourses.find(
        (e) => e.course.toString() === course._id.toString()
    );

    if (!enrollment) {
        return res.json({
            progress: 0,
            completedLessons: [],
            isCompleted: false
        });
    }

    res.json({
        progress: enrollment.progress,
        isCompleted: enrollment.isCompleted,
        completedLessons: enrollment.completedLessons
    });
});

// @desc    Enroll in a course
// @route   POST /api/users/enroll
// @access  Private
const enrollCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    const course = await Course.findOne({ $or: [{ _id: courseId }, { id: courseId }] });

    if (!user || !course) {
        res.status(404);
        throw new Error('User or Course not found');
    }

    // Check if already enrolled
    const alreadyEnrolled = user.enrolledCourses.some(
        (e) => e.course.toString() === course._id.toString()
    );

    if (alreadyEnrolled) {
        return res.json({ message: 'Already enrolled' });
    }

    user.enrolledCourses.push({
        course: course._id,
        progress: 0,
        completedLessons: [],
        isCompleted: false
    });

    await user.save();

    res.status(201).json({ message: 'Enrolled successfully' });
});

module.exports = {
    updateProgress,
    getProgress,
    enrollCourse
};
