const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    orderIndex: { type: Number, required: true }
}, { timestamps: true });

moduleSchema.index({ courseId: 1, orderIndex: 1 });

module.exports = mongoose.model('Module', moduleSchema);
