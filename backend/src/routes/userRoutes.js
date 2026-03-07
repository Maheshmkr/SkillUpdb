const express = require('express');
const router = express.Router();
const {
    getUserProfile,
    updateUserProfile,
} = require('../controllers/userController');
const { updateProgress, getProgress, enrollCourse, submitFeedback, confirmCertificateName } = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router
    .route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.route('/enroll').post(protect, enrollCourse);
router.route('/progress').put(protect, updateProgress);
router.route('/progress/:courseId').get(protect, getProgress);
router.route('/progress/:courseId/confirm-name').put(protect, confirmCertificateName);
router.route('/feedback').put(protect, submitFeedback);

module.exports = router;
