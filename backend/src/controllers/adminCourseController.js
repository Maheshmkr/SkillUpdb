const asyncHandler = require('express-async-handler');
const Course = require('../models/Course');

// @desc    Get all courses (admin view)
// @route   GET /api/admin/courses
// @access  Private/Admin
const getAllCoursesAdmin = asyncHandler(async (req, res) => {
    const courses = await Course.find({}).populate('instructorId', 'name email');
    res.json(courses);
});

// @desc    Get pending courses for approval
// @route   GET /api/admin/courses/pending
// @access  Private/Admin
const getPendingCourses = asyncHandler(async (req, res) => {
    const courses = await Course.find({ status: 'Pending Review' }).populate('instructorId', 'name email');
    res.json(courses);
});

// @desc    Approve a course
// @route   POST /api/admin/courses/:id/approve
// @access  Private/Admin
const approveCourse = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);

    if (course) {
        if (course.status === 'Pending Review') {
            course.status = 'Published';
            course.rejectionReason = undefined;
            const updatedCourse = await course.save();
            res.json(updatedCourse);
        } else {
            res.status(400);
            throw new Error('Course is not pending review');
        }
    } else {
        res.status(404);
        throw new Error('Course not found');
    }
});

// @desc    Reject a course
// @route   POST /api/admin/courses/:id/reject
// @access  Private/Admin
const rejectCourse = asyncHandler(async (req, res) => {
    const { reason } = req.body;
    const course = await Course.findById(req.params.id);

    if (course) {
        if (course.status === 'Pending Review') {
            course.status = 'Rejected';
            course.rejectionReason = reason || 'No reason provided';
            const updatedCourse = await course.save();
            res.json(updatedCourse);
        } else {
            res.status(400);
            throw new Error('Course is not pending review');
        }
    } else {
        res.status(404);
        throw new Error('Course not found');
    }
});

module.exports = {
    getAllCoursesAdmin,
    getPendingCourses,
    approveCourse,
    rejectCourse,
};
