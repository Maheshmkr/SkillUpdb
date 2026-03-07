const express = require('express');
const router = express.Router();
const {
    getInstructors,
    createInstructor,
    deleteInstructor
} = require('../controllers/adminUserController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/instructors').get(protect, admin, getInstructors);
router.route('/instructor').post(protect, admin, createInstructor);
router.route('/instructor/:id').delete(protect, admin, deleteInstructor);

module.exports = router;
