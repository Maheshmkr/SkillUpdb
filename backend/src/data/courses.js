const courses = [
    {
        id: "1",
        title: "Mastering UI/UX: Design Modern Interfaces",
        instructor: "Sarah Jenkins",
        category: "Design",
        hours: 15.5,
        rating: 4.9,
        reviews: 12430,
        price: 84.99,
        originalPrice: 129.99,
        description: "Comprehensive guide to modern UI/UX design. Learn Figma, design systems, and user research techniques.",
        image: "/assets/course-uiux.jpg",
        badge: "Bestseller",
        badgeColor: "bg-primary",
        status: "Published",
        modules: [
            {
                id: "mod1",
                title: "Module 1: Introduction to UI/UX",
                lessons: [
                    {
                        id: "l1_1",
                        title: "1.1 Welcome to the Course",
                        duration: "05:00",
                        contentUrl: "https://www.youtube.com/embed/c9Wg6Cb_YlU?enablejsapi=1",
                        type: "video",
                        description: "An overview of what we will cover in this course and how to get the most out of it."
                    },
                    {
                        id: "l1_2",
                        title: "1.2 What is UI vs UX?",
                        duration: "10:30",
                        contentUrl: "https://www.youtube.com/embed/zHAa-m16NGk?enablejsapi=1",
                        type: "video",
                        description: "Understanding the fundamental differences and intersection between User Interface and User Experience."
                    },
                    {
                        id: "l1_3",
                        title: "1.3 Design Thinking Process",
                        duration: "15:00",
                        contentUrl: "https://www.youtube.com/embed/_r0VX-aU_T8?enablejsapi=1",
                        type: "video",
                        description: "A step-by-step look at the design thinking process: Empathize, Define, Ideate, Prototype, and Test."
                    }
                ]
            },
            {
                id: "mod2",
                title: "Module 2: Visual Design Basics",
                lessons: [
                    {
                        id: "l2_1",
                        title: "2.1 Typography Essentials",
                        duration: "12:00",
                        contentUrl: "https://www.youtube.com/embed/sByzHoiYFX0?enablejsapi=1",
                        type: "video",
                        description: "How to choose and pair fonts to create readable and aesthetically pleasing designs."
                    },
                    {
                        id: "l2_2",
                        title: "2.2 Color Theory",
                        duration: "14:20",
                        contentUrl: "https://www.youtube.com/embed/9lH-0_88-7g?enablejsapi=1",
                        type: "video",
                        description: "Understanding color psychology, harmony, and how to create effective color palettes."
                    },
                    {
                        id: "l2_3",
                        title: "2.3 Reading: Design Principles",
                        duration: "15:00",
                        contentUrl: "https://www.interaction-design.org/literature/topics/design-principles",
                        type: "article",
                        description: "Deep dive into the 6 fundamental principles of design."
                    }
                ]
            },
            {
                id: "mod3",
                title: "Module 3: Prototyping & Testing",
                lessons: [
                    {
                        id: "l3_1",
                        title: "3.1 Prototyping in Figma",
                        duration: "20:00",
                        contentUrl: "https://www.youtube.com/embed/cbLSfS6p-sE?enablejsapi=1",
                        type: "video",
                        description: "Learning how to create interactive prototypes that feel like the real thing."
                    },
                    {
                        id: "l3_2",
                        title: "3.2 Quiz: Testing Your Knowledge",
                        type: "quiz",
                        questions: [
                            {
                                id: "q1",
                                question: "What does UX stand for?",
                                options: ["Universal Experience", "User Experience", "User Exit", "Unit Experience"],
                                correctAnswer: 1
                            },
                            {
                                id: "q2",
                                question: "Which tool is most commonly used for modern UI design?",
                                options: ["Photoshop", "Excel", "Figma", "Word"],
                                correctAnswer: 2
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: "2",
        title: "Advanced React Patterns & Performance",
        instructor: "Michael Rivera",
        category: "Development",
        hours: 24,
        rating: 4.7,
        reviews: 8211,
        price: 94.99,
        originalPrice: 159.99,
        description: "Level up your React skills with advanced patterns, state management, and performance optimization techniques.",
        image: "/assets/course-react.jpg",
        badge: "Intermediate",
        badgeColor: "bg-foreground",
        status: "Published",
    },
    {
        id: "3",
        title: "Digital Marketing Strategy 2024",
        instructor: "Alex Chen",
        category: "Marketing",
        hours: 8.5,
        rating: 4.5,
        reviews: 5102,
        price: 49.99,
        description: "Master the latest digital marketing trends, from SEO to social media advertising strategies.",
        image: "/assets/course-marketing.jpg",
        status: "Published",
    },
    {
        id: "4",
        title: "Introduction to Data Science",
        instructor: "Dr. Emily Watson",
        category: "Data Science",
        hours: 15,
        rating: 5.0,
        reviews: 450,
        price: 79.99,
        originalPrice: 119.99,
        description: "Start your journey into data science. Learn Python, data visualization, and basic machine learning.",
        image: "/assets/course-datascience.jpg",
        badge: "New",
        badgeColor: "bg-success",
        status: "Published",
    },
    {
        id: "5",
        title: "Agile Project Management",
        instructor: "Marcus Thorne",
        category: "Business",
        hours: 10,
        rating: 4.2,
        reviews: 2341,
        price: 64.99,
        description: "Learn to manage projects using Agile and Scrum methodologies for faster delivery and better quality.",
        image: "/assets/course-business.jpg",
        status: "Published",
    },
    {
        id: "6",
        title: "Modern Copywriting for Web",
        instructor: "Liam O'Connor",
        category: "Content",
        hours: 6,
        rating: 4.8,
        reviews: 3410,
        price: 39.99,
        description: "Write compelling copy that converts. Learn the psychology behind persuasive web content.",
        image: "/assets/course-copywriting.jpg",
        badge: "Popular",
        badgeColor: "bg-primary",
        status: "Published",
    },
    {
        id: "7",
        title: "Brand Identity Foundations",
        instructor: "Sophia Rodriguez",
        category: "Branding",
        hours: 18,
        rating: 4.6,
        reviews: 1894,
        price: 124.99,
        description: "Build strong brand identities from scratch. Learn logo design, typography, and color theory.",
        image: "/assets/course-branding.jpg",
        status: "Published",
    },
    {
        id: "8",
        title: "Cybersecurity Fundamentals",
        instructor: "Jack Peterson",
        category: "Security",
        hours: 20,
        rating: 4.1,
        reviews: 4212,
        price: 89.99,
        description: "Protect your digital assets. Learn about network security, encryption, and threat analysis.",
        image: "/assets/course-security.jpg",
        status: "Published",
    }
];

module.exports = courses;
