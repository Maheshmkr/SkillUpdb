
export const initialCourseData = {
    title: "",
    subtitle: "",
    category: "",
    level: "Beginner",
    language: "English",
    thumbnail: null, // File object or URL string
    contentUrl: "",
    duration: "", // e.g., "12h 30m"
    totalHours: 0,
    description: "", // HTML or rich text

    // Details
    rating: 4.8, // Dummy
    ratingCount: 0,
    studentsEnrolled: 0,
    whatYouWillLearn: [
        "Understand the core concepts of the subject",
        "Apply practical skills in real-world scenarios",
        "Build a portfolio-ready project"
    ],
    skills: [], // Array of strings
    includes: [
        "12 hours on-demand video",
        "15 downloadable resources",
        "Access on mobile and TV",
        "Certificate of completion"
    ],

    // Pricing
    price: 0,
    originalPrice: 0,
    currency: "$",
    hasMoneyBackGuarantee: true,

    // Curriculum
    modules: [
        {
            id: "mod_1",
            title: "Introduction",
            lessons: [
                { id: "les_1", title: "Welcome to the Course", type: "video", duration: "2:30", isFree: true }
            ]
        }
    ],

    // Instructor
    instructor: {
        name: "",
        title: "",
        avatar: "", // URL
        rating: 4.9,
        students: 15430,
        courses: 12,
        bio: ""
    },

    // Metadata
    status: "Draft", // Draft, Review, Published
    createdAt: new Date().toISOString(),
};

export const generateId = (prefix = "id") => `${prefix}_${Math.random().toString(36).substr(2, 9)}`;

export const formatDuration = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
};
