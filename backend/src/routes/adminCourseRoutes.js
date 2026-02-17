const express = require('express');
const router = express.Router();
const {
    getAllCoursesAdmin,
    getPendingCourses,
    approveCourse,
    rejectCourse,
} = require('../controllers/adminCourseController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes require admin authentication
router.use(protect, admin);

router.get('/', getAllCoursesAdmin);
router.get('/pending', getPendingCourses);
router.post('/:id/approve', approveCourse);
router.post('/:id/reject', rejectCourse);

module.exports = router;
