const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
    
    title: { type: String, required: true },
    type: { type: String, enum: ['video', 'article', 'quiz'], required: true },
    contentUrl: String, 
    orderIndex: { type: Number, required: true },
    
    // Quiz questions
    questions: [{
        question: String,
        options: [String],
        correctAnswer: Number
    }]
}, { timestamps: true });

lessonSchema.index({ moduleId: 1, orderIndex: 1 });

module.exports = mongoose.model('Lesson', lessonSchema);
