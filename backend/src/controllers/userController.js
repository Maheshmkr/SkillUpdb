const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
        .populate('enrolledCourses.course')
        .populate('certificates.course');

    if (user) {
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
            enrolledCourses: user.enrolledCourses,
            certificates: user.certificates,
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

        const savedUser = await user.save();
        const updatedUser = await User.findById(savedUser._id)
            .populate('enrolledCourses.course')
            .populate('certificates.course');

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
            enrolledCourses: updatedUser.enrolledCourses,
            certificates: updatedUser.certificates,
            token: req.headers.authorization ? req.headers.authorization.split(' ')[1] : null,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

module.exports = {
    getUserProfile,
    updateUserProfile,
};
