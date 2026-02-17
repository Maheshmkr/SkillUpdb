const asyncHandler = require('express-async-handler');
const Course = require('../models/Course');

// @desc    Get all courses for logged-in instructor
// @route   GET /api/instructor/courses
// @access  Private/Instructor
const getInstructorCourses = asyncHandler(async (req, res) => {
    const courses = await Course.find({ instructorId: req.user._id });
    res.json(courses);
});

// @desc    Get single course for instructor
// @route   GET /api/instructor/courses/:id
// @access  Private/Instructor
const getInstructorCourse = asyncHandler(async (req, res) => {
    console.log(`🔍 Backend: Fetching course ${req.params.id} for instructor ${req.user._id}`);

    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            console.log('❌ Backend: Course not found in DB');
            res.status(404);
            throw new Error('Course not found');
        }

        console.log(`Found course: ${course.title}. InstructorId in DB: ${course.instructorId}`);

        if (course.instructorId.toString() === req.user._id.toString()) {
            res.json(course);
        } else {
            console.log(`❌ Backend: Unauthorized. DB Instructor ${course.instructorId} !== Request Instructor ${req.user._id}`);
            res.status(403);
            throw new Error('Not authorized to access this course');
        }
    } catch (error) {
        console.error('❌ Backend Error in getInstructorCourse:', error);
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        throw error;
    }
});

// @desc    Create a new course (Draft)
// @route   POST /api/instructor/courses
// @access  Private/Instructor
const createInstructorCourse = asyncHandler(async (req, res) => {
    const courseData = {
        ...req.body,
        instructorId: req.user._id,
        instructor: req.user.name,
        status: 'Draft'
    };

    const course = new Course(courseData);
    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
});

// @desc    Update instructor's course
// @route   PUT /api/instructor/courses/:id
// @access  Private/Instructor
const updateInstructorCourse = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);

    if (course && course.instructorId.toString() === req.user._id.toString()) {
        // Only allow updates if course is Draft or Rejected
        if (course.status === 'Draft' || course.status === 'Rejected') {
            Object.assign(course, req.body);
            course.status = 'Draft'; // Reset to draft on edit
            const updatedCourse = await course.save();
            res.json(updatedCourse);
        } else {
            res.status(400);
            throw new Error('Cannot edit course in current status');
        }
    } else {
        res.status(404);
        throw new Error('Course not found or unauthorized');
    }
});

// @desc    Submit course for review
// @route   POST /api/instructor/courses/:id/submit
// @access  Private/Instructor
const submitCourseForReview = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);

    if (course && course.instructorId.toString() === req.user._id.toString()) {
        if (course.status === 'Draft' || course.status === 'Rejected') {
            course.status = 'Pending Review';
            course.rejectionReason = undefined; // Clear rejection reason
            const updatedCourse = await course.save();
            res.json(updatedCourse);
        } else {
            res.status(400);
            throw new Error('Course cannot be submitted in current status');
        }
    } else {
        res.status(404);
        throw new Error('Course not found or unauthorized');
    }
});

// @desc    Delete instructor's course
// @route   DELETE /api/instructor/courses/:id
// @access  Private/Instructor
const deleteInstructorCourse = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);

    if (course && course.instructorId.toString() === req.user._id.toString()) {
        // Only allow deletion if not published
        if (course.status !== 'Published') {
            await course.deleteOne();
            res.json({ message: 'Course deleted successfully' });
        } else {
            res.status(400);
            throw new Error('Cannot delete published course');
        }
    } else {
        res.status(404);
        throw new Error('Course not found or unauthorized');
    }
});

module.exports = {
    getInstructorCourses,
    getInstructorCourse,
    createInstructorCourse,
    updateInstructorCourse,
    submitCourseForReview,
    deleteInstructorCourse,
};
