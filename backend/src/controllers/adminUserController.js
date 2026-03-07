const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Get all instructors
// @route   GET /api/admin/users/instructors
// @access  Private/Admin
const getInstructors = asyncHandler(async (req, res) => {
    const instructors = await User.find({ role: 'instructor' }).select('-password');
    res.json(instructors);
});

// @desc    Create new instructor account
// @route   POST /api/admin/users/instructor
// @access  Private/Admin
const createInstructor = asyncHandler(async (req, res) => {
    const { name, email, password, title, about, location } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please provide name, email and password');
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const instructor = await User.create({
        name,
        email,
        password,
        role: 'instructor',
        title: title || 'Instructor',
        about: about || '',
        location: location || ''
    });

    if (instructor) {
        res.status(201).json({
            _id: instructor.id,
            name: instructor.name,
            email: instructor.email,
            role: instructor.role,
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Delete an instructor
// @route   DELETE /api/admin/users/instructor/:id
// @access  Private/Admin
const deleteInstructor = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user && user.role === 'instructor') {
        await User.deleteOne({ _id: user._id });
        res.json({ message: 'Instructor removed' });
    } else {
        res.status(404);
        throw new Error('Instructor not found');
    }
});

module.exports = {
    getInstructors,
    createInstructor,
    deleteInstructor
};
