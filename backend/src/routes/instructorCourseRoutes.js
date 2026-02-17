const express = require('express');
const router = express.Router();
const {
    getInstructorCourses,
    getInstructorCourse,
    createInstructorCourse,
    updateInstructorCourse,
    submitCourseForReview,
    deleteInstructorCourse,
} = require('../controllers/instructorCourseController');
const { protect } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

router.route('/').get(getInstructorCourses).post(createInstructorCourse);

router
    .route('/:id')
    .get(getInstructorCourse)
    .put(updateInstructorCourse)
    .delete(deleteInstructorCourse);

router.post('/:id/submit', submitCourseForReview);

module.exports = router;
