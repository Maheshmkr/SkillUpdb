const mongoose = require('mongoose');


const courseSchema = mongoose.Schema(
    {
        // Basic Info (Step 1)
        title: { type: String, required: true },
        subtitle: String,
        category: { type: String, required: true },
        level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'], default: 'Beginner' },
        language: { type: String, default: 'English' },
        duration: String, // e.g., "12h 30m"
        thumbnail: String,

        // Course Details (Step 2)
        whatYouWillLearn: [String],
        skills: [String],
        includes: [String],
        requirements: [String],
        targetAudience: [String],
        price: { type: Number, required: true },
        originalPrice: Number,
        hasMoneyBackGuarantee: { type: Boolean, default: false },


        // Instructor Info
        instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        instructor: { type: String, required: true }, // Instructor name for display

        // Approval Workflow
        status: {
            type: String,
            enum: ['Draft', 'Pending Review', 'Published', 'Rejected'],
            default: 'Draft'
        },
        rejectionReason: String,

        // Badges (Step 4)
        badges: [
            {
                name: String,
                description: String,
                icon: String,
                rules: [
                    {
                        type: { type: String, enum: ['module_completion', 'lesson_completion', 'quiz_score'] },
                        value: String // ID of module or lesson
                    }
                ]
            }
        ],

        // Certification & Gating (Step 4)
        certificateConfig: {
            enabled: { type: Boolean, default: true },
            criteria: { type: String, enum: ['all', 'selected'], default: 'all' },
            requiredModules: [String], // Array of module IDs
            finalTestId: String, // ID of a quiz lesson that acts as final exam
            minimumScore: { type: Number, default: 80 } // Passing score for certificate
        },
        gatingEnabled: { type: Boolean, default: true },

        // Analytics & Display
        students: { type: Number, default: 0 },
        rating: { type: Number, default: 0 },
        reviews: { type: Number, default: 0 },
        totalLessons: { type: Number, default: 0 }, // NEW
        totalModules: { type: Number, default: 0 }, // NEW
        image: String, // Fallback to thumbnail
        badge: String, // Legacy single badge
        badgeColor: String,

        // Legacy fields for compatibility
        hours: Number,
        description: String,
    },
    {
        timestamps: true,
    }
);

courseSchema.index({ status: 1 });
courseSchema.index({ category: 1 });
courseSchema.index({ instructorId: 1 });

// Virtual for image fallback
courseSchema.virtual('displayImage').get(function () {
    return this.image || this.thumbnail || '/assets/course-placeholder.jpg';
});

module.exports = mongoose.model('Course', courseSchema);

