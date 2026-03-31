const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
        },
        password: {
            type: String,
            required: [true, 'Please add a password'],
        },
        role: {
            type: String,
            enum: ['user', 'admin', 'instructor'],
            default: 'user',
        },
        avatar: {
            type: String,
            default: '',
        },
        location: {
            type: String,
            default: '',
        },
        title: {
            type: String, // e.g., "Full-stack Learner"
            default: '',
        },
        about: {
            type: String,
            default: '',
        },
        interests: {
            type: [String],
            default: [],
        },
        stats: {
            coursesCompleted: { type: Number, default: 0 },
            hoursLearned: { type: Number, default: 0 },
            skillsMastered: { type: Number, default: 0 },
        },
        certificates: [
            {
                course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
                date: { type: Date, default: Date.now },
                pdfUrl: String
            }
        ],
        badges: [
            {
                course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
                name: { type: String, required: true },
                description: String,
                icon: String,
                earnedAt: { type: Date, default: Date.now }
            }
        ],
    },
    {
        timestamps: true,
    }
);

userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

// Encrypt password using bcrypt
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
