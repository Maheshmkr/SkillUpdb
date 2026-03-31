const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    
    progressPercentage: { type: Number, default: 0 },
    isCompleted: { type: Boolean, default: false },
    lastAccessed: { type: Date, default: Date.now },
    
    // Using Lesson ObjectIds
    completedLessonIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    
    quizScores: {
        type: Map,
        of: Number,
        default: {}
    }
}, { timestamps: true });

// Prevent duplicate enrollments
enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
