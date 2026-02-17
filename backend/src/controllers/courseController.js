const asyncHandler = require('express-async-handler');
const Course = require('../models/Course');

// @desc    Get all published courses
// @route   GET /api/courses
// @access  Public
const getCourses = asyncHandler(async (req, res) => {
    const courses = await Course.find({ status: 'Published' });
    res.json(courses);
});

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
const getCourse = asyncHandler(async (req, res) => {
    let course;

    // Check if req.params.id is a valid MongoDB ObjectId
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        course = await Course.findById(req.params.id);
    }

    if (course) {
        res.json(course);
    } else {
        // Try finding by custom string ID
        const courseByStringId = await Course.findOne({ id: req.params.id });
        if (courseByStringId) {
            res.json(courseByStringId);
        } else {
            res.status(404);
            throw new Error('Course not found');
        }
    }
});

// @desc    Create a course
// @route   POST /api/courses
// @access  Private/Admin
const createCourse = asyncHandler(async (req, res) => {
    const {
        id,
        title,
        instructor,
        category,
        hours,
        rating,
        reviews,
        price,
        image,
        description,
    } = req.body;

    const course = new Course({
        id,
        title,
        instructor,
        category,
        hours,
        rating,
        reviews,
        price,
        image,
        description,
    });

    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
});

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Admin
const updateCourse = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);

    if (course) {
        course.title = req.body.title || course.title;
        course.instructor = req.body.instructor || course.instructor;
        course.category = req.body.category || course.category;
        course.hours = req.body.hours || course.hours;
        course.price = req.body.price || course.price;
        course.image = req.body.image || course.image;
        course.description = req.body.description || course.description;

        const updatedCourse = await course.save();
        res.json(updatedCourse);
    } else {
        res.status(404);
        throw new Error('Course not found');
    }
});

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);

    if (course) {
        await course.deleteOne();
        res.json({ message: 'Course removed' });
    } else {
        res.status(404);
        throw new Error('Course not found');
    }
});

module.exports = {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
};
