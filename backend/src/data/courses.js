const courses = [
    {
        title: "Mastering Full-Stack Web Development 2024",
        subtitle: "Build modern, scalable web applications using React, Node.js, and MongoDB.",
        category: "Web Development",
        level: "All Levels",
        duration: "45h 30m",
        thumbnail: "/uploads/course-1.png",
        price: 94.99,
        originalPrice: 159.99,
        rating: 4.8,
        ratingCount: 12450,
        students: 85400,
        instructor: "SkillUp Instructor",
        status: "Published",
        whatYouWillLearn: [
            "Master React.js and Redux for frontend state management",
            "Build RESTful APIs using Node.js and Express",
            "Design and manage databases with MongoDB",
            "Deploy full-stack apps to AWS and Heroku"
        ],
        skills: ["React", "Node.js", "Express", "MongoDB", "JavaScript"],
        modules: [
            {
                id: "mod-web-1",
                title: "Frontend Foundations",
                lessons: [
                    { id: "les-web-1-1", title: "React Components & Hooks", type: "video", duration: "1h 15m", contentUrl: "https://www.youtube.com/watch?v=Ke90Tje7VS0" },
                    { id: "les-web-1-2", title: "State Management with Redux", type: "video", duration: "1h 45m", contentUrl: "https://www.youtube.com/watch?v=48S8N0fT3lQ" }
                ]
            },
            {
                id: "mod-web-2",
                title: "Backend Development",
                lessons: [
                    { id: "les-web-2-1", title: "Intro to Node.js & NPM", type: "video", duration: "1h 00m", contentUrl: "https://www.youtube.com/watch?v=ENrzD9HAZK4" },
                    { id: "les-web-2-2", title: "Building REST APIs", type: "video", duration: "2h 15m", contentUrl: "https://www.youtube.com/watch?v=fgTGADljAeg" }
                ]
            },
            {
                id: "mod-web-3",
                title: "Final Assessment",
                lessons: [
                    {
                        id: "quiz-web-final",
                        title: "Web Dev Final Exam",
                        type: "quiz",
                        questions: [
                            { id: "q1", question: "What is React?", options: ["A library", "A framework", "A database"], correctAnswer: 0 },
                            { id: "q2", question: "Which command starts Node?", options: ["npm start", "node run", "npm node"], correctAnswer: 0 }
                        ]
                    }
                ]
            }
        ],
        certificateConfig: {
            enabled: true,
            criteria: "selected",
            requiredModules: [],
            finalTestId: "quiz-web-final",
            minimumScore: 80
        }
    },
    {
        title: "Advanced UI/UX Design Masterclass",
        subtitle: "Learn advanced design principles, prototyping, and user research techniques.",
        category: "Design",
        level: "Advanced",
        duration: "32h 15m",
        thumbnail: "/uploads/course-2.png",
        price: 84.99,
        originalPrice: 129.99,
        rating: 4.9,
        ratingCount: 8120,
        students: 45210,
        instructor: "SkillUp Instructor",
        status: "Published",
        whatYouWillLearn: [
            "Create high-fidelity prototypes in Figma",
            "Conduct professional user research and testing",
            "Design for accessibility and inclusive user patterns",
            "Master the art of design systems and component libraries"
        ],
        skills: ["UI Design", "UX Research", "Figma", "Prototyping"],
        modules: [
            {
                id: "mod-ux-1",
                title: "Design Principles",
                lessons: [
                    { id: "les-ux-1-1", title: "Visual Hierarchy & Typography", type: "video", duration: "1h 30m", contentUrl: "https://www.youtube.com/watch?v=zHAa-v46n2E" },
                    { id: "les-ux-1-2", title: "Color Theory & Applications", type: "video", duration: "1h 10m", contentUrl: "https://www.youtube.com/watch?v=N_8t_Httnsc" }
                ]
            },
            {
                id: "mod-ux-2",
                title: "Prototyping",
                lessons: [
                    { id: "les-ux-2-1", title: "Advanced Figma Prototyping", type: "video", duration: "2h 00m", contentUrl: "https://www.youtube.com/watch?v=3Wub79mKpx4" },
                    { id: "les-ux-2-2", title: "Component Systems", type: "video", duration: "1h 45m", contentUrl: "https://www.youtube.com/watch?v=pAnVat-f-c8" }
                ]
            },
            {
                id: "mod-ux-3",
                title: "Final Assessment",
                lessons: [
                    {
                        id: "quiz-ux-final",
                        title: "UI/UX Certification Quiz",
                        type: "quiz",
                        questions: [
                            { id: "q1", question: "What does UX stand for?", options: ["User Experience", "User X-factor", "Unique Experience"], correctAnswer: 0 },
                            { id: "q2", question: "Which tool is best for prototyping?", options: ["Figma", "Notepad", "Excel"], correctAnswer: 0 }
                        ]
                    }
                ]
            }
        ],
        certificateConfig: {
            enabled: true,
            criteria: "selected",
            requiredModules: [],
            finalTestId: "quiz-ux-final",
            minimumScore: 80
        }
    },
    {
        title: "Data Science & Machine Learning Bootcamp",
        subtitle: "Complete guide to Python, data analysis, and predictive modeling.",
        category: "Data Science",
        level: "Intermediate",
        duration: "58h 00m",
        thumbnail: "/uploads/course-3.png",
        price: 99.99,
        originalPrice: 199.99,
        rating: 4.7,
        ratingCount: 15600,
        students: 92300,
        instructor: "SkillUp Instructor",
        status: "Published",
        whatYouWillLearn: [
            "Master Python for data manipulation",
            "Build and evaluate machine learning models",
            "Data visualization with Matplotlib and Seaborn",
            "Work with Scikit-learn and Pandas libraries"
        ],
        skills: ["Python", "Machine Learning", "Pandas", "Scikit-learn"],
        modules: [
            {
                id: "mod-ds-1",
                title: "Python for Data Science",
                lessons: [
                    { id: "les-ds-1-1", title: "Numpy & Pandas Internals", type: "video", duration: "2h 30m", contentUrl: "https://www.youtube.com/watch?v=P67CByI4tT4" },
                    { id: "les-ds-1-2", title: "Vizualization Techniques", type: "video", duration: "1h 50m", contentUrl: "https://www.youtube.com/watch?v=UO98lJQ3QGI" }
                ]
            },
            {
                id: "mod-ds-2",
                title: "Final Assessment",
                lessons: [
                    {
                        id: "quiz-ds-final",
                        title: "Data Science Final Quiz",
                        type: "quiz",
                        questions: [
                            { id: "q1", question: "What is Pandas used for?", options: ["Data analysis", "Graphing", "Networking"], correctAnswer: 0 },
                            { id: "q2", question: "Which library is for ML?", options: ["Scikit-learn", "Requests", "Flask"], correctAnswer: 0 }
                        ]
                    }
                ]
            }
        ],
        certificateConfig: {
            enabled: true,
            criteria: "selected",
            requiredModules: [],
            finalTestId: "quiz-ds-final",
            minimumScore: 80
        }
    },
    {
        title: "Digital Marketing Strategy 2024",
        subtitle: "The most complete guide to SEO, social media, and paid advertising.",
        category: "Marketing",
        level: "Beginner",
        duration: "24h 45m",
        thumbnail: "/uploads/course-4.png",
        price: 49.99,
        originalPrice: 89.99,
        rating: 4.6,
        ratingCount: 9400,
        students: 56700,
        instructor: "SkillUp Instructor",
        status: "Published",
        whatYouWillLearn: [
            "Optimize websites for search engines",
            "Create high-performing social media campaigns",
            "Master Google Ads and Facebook Ads",
            "Build and grow your own email list from scratch"
        ],
        skills: ["SEO", "Social Media", "Paid Ads", "Email Marketing"],
        modules: [
            {
                id: "mod-mkt-1",
                title: "SEO Foundations",
                lessons: [
                    { id: "les-mkt-1-1", title: "Keyword Research Basics", type: "video", duration: "1h 20m", contentUrl: "https://www.youtube.com/watch?v=5_S_XNq_Osw" },
                    { id: "les-mkt-1-2", title: "On-page Optimization", type: "video", duration: "1h 45m", contentUrl: "https://www.youtube.com/watch?v=kY6f0h_6v98" }
                ]
            },
            {
                id: "mod-mkt-2",
                title: "Final Assessment",
                lessons: [
                    {
                        id: "quiz-mkt-final",
                        title: "Marketing Strategy Quiz",
                        type: "quiz",
                        questions: [
                            { id: "q1", question: "What does SEO stand for?", options: ["Search Engine Optimization", "Social Media Optimization", "Site Engine Operation"], correctAnswer: 0 },
                            { id: "q2", question: "Best platform for B2B?", options: ["LinkedIn", "Instagram", "Snapchat"], correctAnswer: 0 }
                        ]
                    }
                ]
            }
        ],
        certificateConfig: {
            enabled: true,
            criteria: "selected",
            requiredModules: [],
            finalTestId: "quiz-mkt-final",
            minimumScore: 80
        }
    },
    {
        title: "Financial Modeling Professional",
        subtitle: "Complete guide to financial statement analysis and valuation.",
        category: "Finance",
        level: "Intermediate",
        duration: "38h 20m",
        thumbnail: "/uploads/course-5.png",
        price: 89.99,
        originalPrice: 149.99,
        rating: 4.8,
        ratingCount: 7200,
        students: 34100,
        instructor: "SkillUp Instructor",
        status: "Published",
        whatYouWillLearn: [
            "Master Excel for financial modeling",
            "Perform DCF and comparable company analysis",
            "Build full professional three-statement models",
            "Complete stock valuation from scratch"
        ],
        skills: ["Modeling", "Valuation", "Excel", "Analysis"],
        modules: [
            {
                id: "mod-fin-1",
                title: "Excel Mastery",
                lessons: [
                    { id: "les-fin-1-1", title: "Financial Formulas", type: "video", duration: "1h 15m", contentUrl: "https://www.youtube.com/watch?v=xT7L_vGZ4A0" },
                    { id: "les-fin-1-2", title: "Dynamic Tables", type: "video", duration: "1h 30m", contentUrl: "https://www.youtube.com/watch?v=0_u6uB28WqE" }
                ]
            },
            {
                id: "mod-fin-2",
                title: "Final Assessment",
                lessons: [
                    {
                        id: "quiz-fin-final",
                        title: "Finance Pro Final Quiz",
                        type: "quiz",
                        questions: [
                            { id: "q1", question: "What is DCF?", options: ["Discounted Cash Flow", "Dynamic Cash Format", "Direct Cash Flow"], correctAnswer: 0 },
                            { id: "q2", question: "Current Asset - Inventory?", options: ["Quick Ratio", "Current Ratio", "Gross Margin"], correctAnswer: 0 }
                        ]
                    }
                ]
            }
        ],
        certificateConfig: {
            enabled: true,
            criteria: "selected",
            requiredModules: [],
            finalTestId: "quiz-fin-final",
            minimumScore: 80
        }
    },
    {
        title: "AWS Certified Solutions Architect",
        subtitle: "Become an AWS expert and pass the architect certification exam.",
        category: "Cloud Computing",
        level: "Intermediate",
        duration: "42h 00m",
        thumbnail: "/uploads/course-6.png",
        price: 94.99,
        originalPrice: 169.99,
        rating: 4.9,
        ratingCount: 12800,
        students: 71200,
        instructor: "SkillUp Instructor",
        status: "Published",
        whatYouWillLearn: [
            "Master core AWS services like EC2, S3, and Lambda",
            "Build highly available and scalable architectures",
            "Implement advanced security and IAM policies",
            "Design disaster recovery and backup strategies"
        ],
        skills: ["AWS", "Cloud Arch", "EC2", "S3", "Lambda"],
        modules: [
            {
                id: "mod-aws-1",
                title: "AWS Core Services",
                lessons: [
                    { id: "les-aws-1-1", title: "IAM & Security", type: "video", duration: "1h 45m", contentUrl: "https://www.youtube.com/watch?v=3hLmDS179YE" },
                    { id: "les-aws-1-2", title: "EC2 Essentials", type: "video", duration: "2h 10m", contentUrl: "https://www.youtube.com/watch?v=RrK_3L3I9P0" }
                ]
            },
            {
                id: "mod-aws-2",
                title: "Final Assessment",
                lessons: [
                    {
                        id: "quiz-aws-final",
                        title: "AWS Architect Exam",
                        type: "quiz",
                        questions: [
                            { id: "q1", question: "What is S3?", options: ["Storage", "Compute", "Database"], correctAnswer: 0 },
                            { id: "q2", question: "Function as a service?", options: ["Lambda", "EC2", "RDS"], correctAnswer: 0 }
                        ]
                    }
                ]
            }
        ],
        certificateConfig: {
            enabled: true,
            criteria: "selected",
            requiredModules: [],
            finalTestId: "quiz-aws-final",
            minimumScore: 80
        }
    },
    {
        title: "Cyber Security First Responder",
        subtitle: "Learn defending systems from advanced persistent threats.",
        category: "Cyber Security",
        level: "Intermediate",
        duration: "35h 10m",
        thumbnail: "/uploads/course-1.png",
        price: 79.99,
        originalPrice: 119.99,
        rating: 4.7,
        ratingCount: 5200,
        students: 28400,
        instructor: "SkillUp Instructor",
        status: "Published",
        whatYouWillLearn: [
            "Ethical hacking and network pen-testing",
            "Detecting and preventing malware attacks",
            "Build robust firewall and IDS systems",
            "Incidence response and digital forensics"
        ],
        skills: ["Security", "Linux", "Ethical Hacking"],
        modules: [
            {
                id: "mod-sec-1",
                title: "Pentesting Intro",
                lessons: [
                    { id: "les-sec-1-1", title: "Network Mapping", type: "video", duration: "1h 15m", contentUrl: "https://www.youtube.com/watch?v=nzj7Wg46lsA" }
                ]
            },
            {
                id: "mod-sec-2",
                title: "Final Assessment",
                lessons: [
                    {
                        id: "quiz-sec-final",
                        title: "Security Final Quiz",
                        type: "quiz",
                        questions: [
                            { id: "q1", question: "What is a firewall?", options: ["A barrier", "A virus", "A storage"], correctAnswer: 0 }
                        ]
                    }
                ]
            }
        ],
        certificateConfig: {
            enabled: true,
            criteria: "selected",
            requiredModules: [],
            finalTestId: "quiz-sec-final"
        }
    },
    {
        title: "PMP Project Management Professional",
        subtitle: "Pass the PMP certification with this complete course.",
        category: "Management",
        level: "Advanced",
        duration: "30h 00m",
        thumbnail: "/uploads/course-2.png",
        price: 69.99,
        originalPrice: 129.99,
        rating: 4.8,
        ratingCount: 3200,
        students: 15400,
        instructor: "SkillUp Instructor",
        status: "Published",
        modules: [
            {
                id: "mod-pm-1",
                title: "Agile Frameworks",
                lessons: [
                    { id: "les-pm-1-1", title: "Scrum & Kanban", type: "video", duration: "1h 30m", contentUrl: "https://www.youtube.com/watch?v=9S57X9H6c44" }
                ]
            },
            {
                id: "mod-pm-2",
                title: "Final Assessment",
                lessons: [
                    {
                        id: "quiz-pm-final",
                        title: "PMP Prep Quiz",
                        type: "quiz",
                        questions: [
                            { id: "q1", question: "What is Scrum?", options: ["Agile framework", "Waterfall method", "Database"], correctAnswer: 0 }
                        ]
                    }
                ]
            }
        ],
        certificateConfig: {
            enabled: true,
            criteria: "selected",
            requiredModules: [],
            finalTestId: "quiz-pm-final",
            minimumScore: 80
        }
    },
    {
        title: "Python for AI & Deep Learning",
        subtitle: "Master the Python libraries used for revolutionary AI.",
        category: "Data Science",
        level: "Advanced",
        duration: "48h 00m",
        thumbnail: "/uploads/course-3.png",
        price: 99.99,
        originalPrice: 179.99,
        rating: 4.9,
        ratingCount: 6500,
        students: 42100,
        instructor: "SkillUp Instructor",
        status: "Published",
        modules: [
            {
                id: "mod-ai-1",
                title: "Neural Networks",
                lessons: [
                    { id: "les-ai-1-1", title: "Intro to PyTorch", type: "video", duration: "2h 00m", contentUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw" }
                ]
            },
            {
                id: "mod-ai-2",
                title: "Final Assessment",
                lessons: [
                    {
                        id: "quiz-ai-final",
                        title: "AI Deep Learning Quiz",
                        type: "quiz",
                        questions: [
                            { id: "q1", question: "What is PyTorch?", options: ["DL Library", "Video player", "Text editor"], correctAnswer: 0 }
                        ]
                    }
                ]
            }
        ],
        certificateConfig: {
            enabled: true,
            criteria: "selected",
            requiredModules: [],
            finalTestId: "quiz-ai-final",
            minimumScore: 80
        }
    },
    {
        title: "Growth Hacking for Mobile Apps",
        subtitle: "Grow your app's user base with these proven strategies.",
        category: "Marketing",
        level: "Intermediate",
        duration: "18h 30m",
        thumbnail: "/uploads/course-4.png",
        price: 44.99,
        originalPrice: 79.99,
        rating: 4.5,
        ratingCount: 2100,
        students: 12300,
        instructor: "SkillUp Instructor",
        status: "Published",
        modules: [
            {
                id: "mod-gh-1",
                title: "Viral Loops",
                lessons: [
                    { id: "les-gh-1-1", title: "Inbound Referral Systems", type: "video", duration: "1h 10m", contentUrl: "https://www.youtube.com/watch?v=Z_KxpulYOKU" }
                ]
            },
            {
                id: "mod-gh-2",
                title: "Final Assessment",
                lessons: [
                    {
                        id: "quiz-gh-final",
                        title: "Growth Hacking Quiz",
                        type: "quiz",
                        questions: [
                            { id: "q1", question: "What is a viral loop?", options: ["Self-sustaining growth", "A coding error", "A video loop"], correctAnswer: 0 }
                        ]
                    }
                ]
            }
        ],
        certificateConfig: {
            enabled: true,
            criteria: "selected",
            requiredModules: [],
            finalTestId: "quiz-gh-final",
            minimumScore: 80
        }
    }
];

module.exports = courses;
