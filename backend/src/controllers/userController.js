const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Enrollment = require('../models/Enrollment');

// Helper to format enrollments for the frontend
const formatEnrollments = async (userId) => {
    const enrollments = await Enrollment.find({ userId }).populate('courseId');
    return enrollments.map(e => {
        const doc = e.toObject();
        doc.course = doc.courseId;
        doc.progress = doc.progressPercentage; // Map to frontend expectation
        doc.completedLessons = doc.completedLessonIds || []; // Map to frontend expectation
        delete doc.courseId;
        delete doc.progressPercentage;
        delete doc.completedLessonIds;
        return doc;
    });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
        .populate('certificates.course')
        .populate('badges.course');

    if (user) {
        let changed = false;
        const enrollments = await Enrollment.find({ userId: user._id }).populate('courseId');

        for (const enrollment of enrollments) {
            if (enrollment.progressPercentage === 100 && !enrollment.isCompleted) {
                enrollment.isCompleted = true;
                await enrollment.save();
            }

            if (enrollment.isCompleted && enrollment.courseId) {
                const hasCert = user.certificates.some(c =>
                    (c.course?._id || c.course)?.toString() === enrollment.courseId._id.toString()
                );
                if (!hasCert) {
                    user.certificates.push({
                        course: enrollment.courseId._id,
                        date: enrollment.lastAccessed || Date.now(),
                        pdfUrl: `/uploads/certificates/${user._id}-${enrollment.courseId._id}.pdf`
                    });
                    changed = true;
                }
            }
        }

        if (changed) {
            await user.save();
        }

        const formattedEnrollments = await formatEnrollments(user._id);

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            location: user.location,
            title: user.title,
            about: user.about,
            interests: user.interests,
            stats: user.stats,
            enrolledCourses: formattedEnrollments,
            certificates: user.certificates,
            badges: user.badges,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = req.body.password;
        }
        user.avatar = req.body.avatar || user.avatar;
        user.location = req.body.location || user.location;
        user.title = req.body.title || user.title;
        user.about = req.body.about || user.about;
        user.interests = req.body.interests || user.interests;

        await user.save();
        
        const updatedUser = await User.findById(user._id)
            .populate('certificates.course')
            .populate('badges.course');

        const formattedEnrollments = await formatEnrollments(user._id);

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            avatar: updatedUser.avatar,
            location: updatedUser.location,
            title: updatedUser.title,
            about: updatedUser.about,
            interests: updatedUser.interests,
            stats: updatedUser.stats,
            enrolledCourses: formattedEnrollments,
            certificates: updatedUser.certificates,
            badges: updatedUser.badges,
            token: req.headers.authorization ? req.headers.authorization.split(' ')[1] : null,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

module.exports = { getUserProfile, updateUserProfile };
