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

    // Check if already enrolled and add if not (Atomic check)
    const updatedUser = await User.findOneAndUpdate(
        {
            _id: userId,
            'enrolledCourses.course': { $ne: course._id }
        },
        {
            $push: {
                enrolledCourses: {
                    course: course._id,
                    progress: 0,
                    completedLessons: [],
                    isCompleted: false,
                    lastAccessed: Date.now()
                }
            }
        },
        { new: true }
    ).populate('enrolledCourses.course');

    const enrollment = (updatedUser || user).enrolledCourses.find(
        (e) => e.course._id ? e.course._id.toString() === course._id.toString() : e.course.toString() === course._id.toString()
    );

    // Update completed lessons if not already completed
    if (lessonId) {
        if (!enrollment.completedLessons.includes(lessonId)) {
            enrollment.completedLessons.push(lessonId);
        }

        // Handle Quiz Score tracking if provided in request
        if (req.body.score !== undefined) {
            if (!enrollment.quizScores) enrollment.quizScores = {};
            enrollment.quizScores[lessonId] = req.body.score;
        }
    }

    // Calculate progress
    // Flatten modules to get total lesson count
    const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
    const completedCount = enrollment.completedLessons.length;

    enrollment.progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
    enrollment.lastAccessed = Date.now();

    // Check for completion based on config
    const config = course.certificateConfig || { enabled: true, criteria: 'all' };
    let meetsCriteria = false;

    if (config.enabled) {
        if (config.criteria === 'all') {
            meetsCriteria = enrollment.progress === 100;
        } else if (config.criteria === 'selected') {
            const requiredIds = config.requiredModules || [];
            meetsCriteria = requiredIds.every(id => enrollment.completedLessons.includes(id));
        }

        // Check for Final Test if configured
        if (meetsCriteria && config.finalTestId) {
            const finalScore = (enrollment.quizScores && enrollment.quizScores[config.finalTestId]) || 0;
            if (finalScore < (config.minimumScore || 80)) {
                meetsCriteria = false;
            }
        }

        // Failsafe: if progress is 100%, it's completed
        if (enrollment.progress === 100) {
            meetsCriteria = true;
        }
    }

    if (meetsCriteria && !enrollment.isCompleted) {
        enrollment.isCompleted = true;

        // Generate Certificate
        user.certificates.push({
            course: course._id,
            date: Date.now(),
            pdfUrl: `/uploads/certificates/${user._id}-${course._id}.pdf`
        });

        user.stats.coursesCompleted += 1;
        user.stats.skillsMastered += 1;
    }

    // Award Badges based on course rules
    if (course.badges && course.badges.length > 0) {
        course.badges.forEach(badge => {
            // Check if user already has this badge for this course
            const hasBadge = user.badges.some(b =>
                (b.course?._id || b.course)?.toString() === course._id.toString() && b.name === badge.name
            );

            if (!hasBadge) {
                const allMet = badge.rules.every(rule => {
                    if (rule.type === 'module_completion') {
                        // Find module and check if all its lessons are in completedLessons
                        const targetModule = course.modules.find(m => m.id === rule.value);
                        if (!targetModule) return false;
                        return targetModule.lessons.every(l =>
                            enrollment.completedLessons.includes(l.id) || enrollment.completedLessons.includes(l.title)
                        );
                    }
                    if (rule.type === 'lesson_completion') {
                        return enrollment.completedLessons.includes(rule.value);
                    }
                    if (rule.type === 'quiz_score') {
                        // rule.value format: "lessonId:minScore"
                        const [qid, min] = rule.value.split(':');
                        const score = (enrollment.quizScores && enrollment.quizScores[qid]) || 0;
                        return score >= parseInt(min);
                    }
                    return false;
                });

                if (allMet) {
                    user.badges.push({
                        course: course._id,
                        name: badge.name,
                        description: badge.description,
                        icon: badge.icon,
                        earnedAt: Date.now()
                    });
                }
            }
        });
    }

    await user.save();

    res.json({
        progress: enrollment.progress,
        isCompleted: enrollment.isCompleted,
        certificateNameConfirmed: enrollment.certificateNameConfirmed,
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

    // Update lastAccessed timestamp
    enrollment.lastAccessed = Date.now();
    await user.save();

    res.json({
        progress: enrollment.progress,
        isCompleted: enrollment.isCompleted,
        certificateNameConfirmed: enrollment.certificateNameConfirmed,
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

    // Atomic findOneAndUpdate to prevent duplicate enrollment
    const updatedUser = await User.findOneAndUpdate(
        {
            _id: userId,
            'enrolledCourses.course': { $ne: course._id }
        },
        {
            $push: {
                enrolledCourses: {
                    course: course._id,
                    progress: 0,
                    completedLessons: [],
                    isCompleted: false,
                    lastAccessed: Date.now()
                }
            }
        },
        { new: true }
    );

    if (!updatedUser) {
        return res.json({ message: 'Already enrolled' });
    }

    // Increment student count on the course
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

    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user || !course) {
        res.status(404);
        throw new Error('User or Course not found');
    }

    const enrollment = user.enrolledCourses.find(
        (e) => e.course.toString() === course._id.toString()
    );

    if (!enrollment) {
        res.status(400);
        throw new Error('Not enrolled in this course');
    }

    enrollment.rating = rating;
    enrollment.comment = comment;

    await user.save();

    // Update course review list and aggregate rating
    const reviewIndex = course.reviewList.findIndex(r => r.user.toString() === userId.toString());
    const reviewData = {
        user: userId,
        name: user.name,
        avatar: user.avatar,
        rating: rating,
        comment: comment,
        date: Date.now()
    };

    if (reviewIndex !== -1) {
        course.reviewList[reviewIndex] = reviewData;
    } else {
        course.reviewList.push(reviewData);
    }

    // Recalculate average rating
    const totalRatings = course.reviewList.length;
    const sumRatings = course.reviewList.reduce((acc, rev) => acc + rev.rating, 0);

    course.rating = totalRatings > 0 ? Number((sumRatings / totalRatings).toFixed(1)) : 0;
    course.reviews = totalRatings;

    await course.save();

    res.json({ message: 'Feedback submitted' });
});

// @desc    Confirm certificate name
// @route   PUT /api/users/progress/:courseId/confirm-name
// @access  Private
const confirmCertificateName = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const user = await User.findById(req.user._id);
    const course = await Course.findOne({ $or: [{ _id: courseId }, { id: courseId }] });

    if (!user || !course) {
        res.status(404);
        throw new Error('User or Course not found');
    }

    const enrollment = user.enrolledCourses.find(
        (e) => e.course.toString() === course._id.toString()
    );

    if (enrollment) {
        enrollment.certificateNameConfirmed = true;
        await user.save();
        res.json({ success: true, certificateNameConfirmed: true });
    } else {
        res.status(404);
        throw new Error('Enrollment not found');
    }
});

module.exports = {
    updateProgress,
    getProgress,
    enrollCourse,
    submitFeedback,
    confirmCertificateName
};
