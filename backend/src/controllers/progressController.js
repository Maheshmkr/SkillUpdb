const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const Review = require('../models/Review');

// @desc    Update course progress
// @route   PUT /api/users/progress
// @access  Private
const updateProgress = asyncHandler(async (req, res) => {
    const { courseId, lessonId, score } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    const course = await Course.findOne({ $or: [{ _id: courseId }, { id: courseId }] });

    if (!user || !course) {
        res.status(404);
        throw new Error('User or Course not found');
    }

    // Upsert Enrollment
    let enrollment = await Enrollment.findOne({ userId, courseId: course._id });
    if (!enrollment) {
        enrollment = new Enrollment({
            userId,
            courseId: course._id,
        });
    }

    // Update completed lessons
    if (lessonId) {
        if (!enrollment.completedLessonIds.includes(lessonId)) {
            enrollment.completedLessonIds.push(lessonId);
        }

        if (score !== undefined) {
            enrollment.quizScores.set(lessonId.toString(), score);
        }
    }

    // Calculate progress
    const totalLessons = await Lesson.countDocuments({ courseId: course._id });
    const completedCount = enrollment.completedLessonIds.length;
    enrollment.progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
    enrollment.lastAccessed = Date.now();

    // Check completion criteria
    const config = course.certificateConfig || { enabled: true, criteria: 'all' };
    let meetsCriteria = false;

    if (config.enabled) {
        if (config.criteria === 'all') {
            meetsCriteria = enrollment.progressPercentage === 100;
        } else {
            meetsCriteria = enrollment.progressPercentage === 100; // Simplified
        }
        if (enrollment.progressPercentage === 100) meetsCriteria = true;
    }

    if (meetsCriteria && !enrollment.isCompleted) {
        enrollment.isCompleted = true;

        user.certificates.push({
            course: course._id,
            date: Date.now(),
            pdfUrl: `/uploads/certificates/${user._id}-${course._id}.pdf`
        });

        user.stats.coursesCompleted += 1;
        user.stats.skillsMastered += 1;
        
        await user.save();
    }

    // Badges logic simplified
    if (enrollment.isCompleted && course.badges && course.badges.length > 0) {
       for(const badge of course.badges) {
            const hasBadge = user.badges.some(b => b.name === badge.name && b.course.toString() === course._id.toString());
            if (!hasBadge) {
                user.badges.push({ course: course._id, name: badge.name, description: badge.description, icon: badge.icon, earnedAt: Date.now() });
            }
       }
       await user.save();
    }

    await enrollment.save();

    res.json({
        progress: enrollment.progressPercentage,
        isCompleted: enrollment.isCompleted,
        certificateNameConfirmed: false,
        completedLessons: enrollment.completedLessonIds,
        certificate: enrollment.isCompleted ? user.certificates[user.certificates.length - 1] : null
    });
});

// @desc    Get course progress
// @route   GET /api/users/progress/:courseId
// @access  Private
const getProgress = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const userId = req.user._id;

    const course = await Course.findOne({ $or: [{ _id: courseId }, { id: courseId }] });
    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    const enrollment = await Enrollment.findOne({ userId, courseId: course._id });

    if (!enrollment) {
        return res.json({ progress: 0, completedLessons: [], isCompleted: false });
    }

    enrollment.lastAccessed = Date.now();
    await enrollment.save();

    res.json({
        progress: enrollment.progressPercentage,
        isCompleted: enrollment.isCompleted,
        certificateNameConfirmed: false,
        completedLessons: enrollment.completedLessonIds
    });
});

// @desc    Enroll in a course
// @route   POST /api/users/enroll
// @access  Private
const enrollCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.body;
    const userId = req.user._id;

    const course = await Course.findOne({ $or: [{ _id: courseId }, { id: courseId }] });
    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    const existingEnrollment = await Enrollment.findOne({ userId, courseId: course._id });
    if (existingEnrollment) {
        return res.json({ message: 'Already enrolled' });
    }

    await Enrollment.create({ userId, courseId: course._id });

    course.students = (course.students || 0) + 1;
    await course.save();

    res.status(201).json({ message: 'Enrolled successfully' });
});

// @desc    Submit course feedback
// @route   PUT /api/users/feedback
// @access  Private
const submitFeedback = asyncHandler(async (req, res) => {
    const { courseId, rating, comment } = req.body;
    const userId = req.user._id;

    const course = await Course.findById(courseId);
    if (!course) throw new Error('Course not found');

    const enrollment = await Enrollment.findOne({ userId, courseId: course._id });
    if (!enrollment) throw new Error('Not enrolled in this course');

    let review = await Review.findOne({ userId, courseId: course._id });
    if (review) {
        review.rating = rating;
        review.comment = comment;
        await review.save();
    } else {
        await Review.create({ userId, courseId: course._id, rating, comment });
    }

    const allReviews = await Review.find({ courseId: course._id });
    const totalRatings = allReviews.length;
    const sumRatings = allReviews.reduce((acc, rev) => acc + rev.rating, 0);

    course.rating = totalRatings > 0 ? Number((sumRatings / totalRatings).toFixed(1)) : 0;
    course.reviews = totalRatings; 
    await course.save();

    res.json({ message: 'Feedback submitted' });
});

// @desc    Confirm certificate name
// @route   PUT /api/users/progress/:courseId/confirm-name
// @access  Private
const confirmCertificateName = asyncHandler(async (req, res) => {
    // Legacy support to prevent frontend crashing
    res.json({ success: true, certificateNameConfirmed: true });
});

module.exports = { updateProgress, getProgress, enrollCourse, submitFeedback, confirmCertificateName };
