const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password,
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    console.log("hello")
    console.log(`🔐 Login attempt for: ${email}`);

    // Check for user email
    const user = await User.findOne({ email });

    if (!user) {
        console.log(`❌ No user found with email: ${email}`);
    } else {

        const isMatch = await user.matchPassword(password);
        console.log(`👤 User found: ${user.name}, Password match: ${isMatch}`);
    }

    if (user && (await user.matchPassword(password))) {
        // Fetch enrollments from the new Enrollment model
        const Enrollment = require('../models/Enrollment');
        const enrollments = await Enrollment.find({ userId: user._id }).populate('courseId');

        // Map back to the old shape for frontend compatibility
        const formattedEnrollments = enrollments.map(e => {
            const doc = e.toObject();
            doc.course = doc.courseId;
            doc.progress = doc.progressPercentage; // Map to frontend expectation
            doc.completedLessons = doc.completedLessonIds || []; // Map to frontend expectation
            delete doc.courseId;
            delete doc.progressPercentage;
            delete doc.completedLessonIds;
            return doc;
        });

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            enrolledCourses: formattedEnrollments,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid credentials');
    }
});

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
});

module.exports = {
    registerUser,
    loginUser,
    getMe,
};
