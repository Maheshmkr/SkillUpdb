const asyncHandler = require('express-async-handler');
const Course = require('../models/Course');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');

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
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            res.status(404);
            throw new Error('Course not found');
        }

        if (course.instructorId.toString() === req.user._id.toString()) {
            const modules = await Module.find({ courseId: course._id }).sort('orderIndex').lean();
            const lessons = await Lesson.find({ courseId: course._id }).sort('orderIndex').lean();

            const assembledModules = modules.map(m => ({
                ...m,
                id: m._id.toString(), // Support frontend expecting string ids
                lessons: lessons.filter(l => l.moduleId.toString() === m._id.toString()).map(l => ({ ...l, id: l._id.toString() }))
            }));

            const courseObj = course.toObject();
            courseObj.modules = assembledModules;

            res.json(courseObj);
        } else {
            res.status(403);
            throw new Error('Not authorized to access this course');
        }
    } catch (error) {
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
    
    // Save modules if provided during creation
    if (req.body.modules) {
        for (let i = 0; i < req.body.modules.length; i++) {
            const modData = req.body.modules[i];
            const mod = await Module.create({
                courseId: createdCourse._id,
                title: modData.title,
                orderIndex: i
            });

            if (modData.lessons && modData.lessons.length > 0) {
                for (let j = 0; j < modData.lessons.length; j++) {
                    const lesData = modData.lessons[j];
                    await Lesson.create({
                        courseId: createdCourse._id,
                        moduleId: mod._id,
                        title: lesData.title,
                        type: lesData.type || 'video',
                        contentUrl: lesData.contentUrl,
                        questions: lesData.questions || [],
                        orderIndex: j
                    });
                }
            }
        }
    }

    res.status(201).json(createdCourse);
});

// @desc    Update instructor's course
// @route   PUT /api/instructor/courses/:id
// @access  Private/Instructor
const updateInstructorCourse = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);

    if (course && course.instructorId.toString() === req.user._id.toString()) {
        if (course.status === 'Draft' || course.status === 'Rejected') {
            
            // Exclude modules from the direct course assignment
            const { modules, ...courseUpdateData } = req.body;
            Object.assign(course, courseUpdateData);
            
            // Handle saving modules/lessons manually
            if (modules) {
                // Wipe and replace for simplicity to match frontend's bulk save nature
                await Module.deleteMany({ courseId: course._id });
                await Lesson.deleteMany({ courseId: course._id });

                for (let i = 0; i < modules.length; i++) {
                    const modData = modules[i];
                    const mod = await Module.create({
                        courseId: course._id,
                        title: modData.title,
                        orderIndex: i
                    });

                    if (modData.lessons && modData.lessons.length > 0) {
                        for (let j = 0; j < modData.lessons.length; j++) {
                            const lesData = modData.lessons[j];
                            await Lesson.create({
                                courseId: course._id,
                                moduleId: mod._id,
                                title: lesData.title,
                                type: lesData.type || 'video',
                                contentUrl: lesData.contentUrl,
                                questions: lesData.questions || [],
                                orderIndex: j
                            });
                        }
                    }
                }
            }

            course.status = 'Draft';
            const updatedCourse = await course.save();

            // Fetch and assemble to return the expected structure
            const newModules = await Module.find({ courseId: course._id }).sort('orderIndex').lean();
            const newLessons = await Lesson.find({ courseId: course._id }).sort('orderIndex').lean();

            const assembledModules = newModules.map(m => ({
                ...m,
                lessons: newLessons.filter(l => l.moduleId.toString() === m._id.toString())
            }));

            const courseObj = updatedCourse.toObject();
            courseObj.modules = assembledModules;

            res.json(courseObj);
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
            course.rejectionReason = undefined;
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
        if (course.status !== 'Published') {
            await course.deleteOne();
            // Cleanup related documents
            await Module.deleteMany({ courseId: course._id });
            await Lesson.deleteMany({ courseId: course._id });
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

// @desc    Get reviews for all instructor courses
// @route   GET /api/instructor/reviews
// @access  Private/Instructor
const getInstructorReviews = asyncHandler(async (req, res) => {
    // 1. Get all courses owned by this instructor
    const courses = await Course.find({ instructorId: req.user._id }).select('_id title');
    const courseIds = courses.map(c => c._id);

    // 2. Fetch all reviews for these courses
    const Review = require('../models/Review');
    const reviews = await Review.find({ courseId: { $in: courseIds } })
        .populate('userId', 'name avatar')
        .sort('-createdAt')
        .lean();

    // 3. Attach course title to each review for the UI
    const formattedReviews = reviews.map(review => {
        const course = courses.find(c => c._id.toString() === review.courseId.toString());
        return {
            id: review._id,
            studentName: review.userId?.name || 'Unknown Student',
            studentAvatar: review.userId?.avatar || `https://ui-avatars.com/api/?name=${review.userId?.name || 'US'}&background=random`,
            courseTitle: course ? course.title : 'Deleted Course',
            rating: review.rating,
            comment: review.comment,
            date: review.createdAt
        };
    });

    res.json(formattedReviews);
});

module.exports = {
    getInstructorCourses,
    getInstructorCourse,
    createInstructorCourse,
    updateInstructorCourse,
    submitCourseForReview,
    deleteInstructorCourse,
    getInstructorReviews
};
