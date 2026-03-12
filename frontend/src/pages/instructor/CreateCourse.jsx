import { useState } from "react";
import { InstructorLayout } from "@/layouts/InstructorLayout";
import { Check, ChevronRight, Upload, Plus, Trash, GripVertical, Video, FileText, Pencil, Star, Users, Monitor, Award, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const steps = ["Basic Info", "Curriculum", "Content", "Preview"];

export default function CreateCourse() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        title: "Mastering UI/UX: Design Modern Interfaces",
        category: "Design",
        level: "Intermediate",
        description: "Comprehensive guide to modern UI/UX design. Learn Figma, design systems, and user research techniques.",
        rating: 4.9,
        reviews: 12430,
        enrolled: 45210,
        hours: 12.5,
        price: 84.99,
        originalPrice: 129.99,
        skills: ["UI Design", "User Experience", "Prototyping", "Figma", "Product Strategy"],
        learningPoints: [
            "Design complex user interfaces from scratch using industry-standard tools.",
            "Understand the cognitive psychology behind high-conversion UX design.",
            "Build interactive, high-fidelity prototypes that mirror production apps.",
            "Learn advanced layout systems and responsive design frameworks.",
            "Master accessibility (a11y) standards for enterprise-grade applications.",
            "Collaborate with developers using professional handoff workflows.",
        ],
        sections: [
            { id: 1, title: "Module 1: Foundations of Product Thinking", lectures: 4, duration: "45m", lessons: [{ id: 1, title: "Welcome to the Course", type: "video" }] },
            {
                id: 2,
                title: "Module 2: Advanced Interaction Systems",
                lectures: 8,
                duration: "2h 15m",
                lessons: [
                    { id: 1, title: "Complex State Management in UI", type: "video", duration: "12:40" },
                    { id: 2, title: "Case Study: Enterprise Dashboard Architecture", type: "document", duration: "PDF Guide" }
                ]
            }
        ]
    });

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

    // Curriculum Handlers
    const addSection = () => {
        setFormData(prev => ({
            ...prev,
            sections: [
                ...prev.sections,
                { id: Date.now(), title: `Module ${prev.sections.length + 1}: New Section`, lectures: 0, duration: "0m", lessons: [] }
            ]
        }));
    };

    const removeSection = (sectionId) => {
        setFormData(prev => ({
            ...prev,
            sections: prev.sections.filter(s => s.id !== sectionId)
        }));
    };

    const updateSection = (sectionId, title) => {
        setFormData(prev => ({
            ...prev,
            sections: prev.sections.map(s => s.id === sectionId ? { ...s, title } : s)
        }));
    };

    const addLesson = (sectionId) => {
        setFormData(prev => ({
            ...prev,
            sections: prev.sections.map(s => {
                if (s.id === sectionId) {
                    return {
                        ...s,
                        lessons: [...s.lessons, { id: Date.now(), title: "New Lesson", type: "video", duration: "5:00" }],
                        lectures: s.lessons.length + 1
                    };
                }
                return s;
            })
        }));
    };

    const removeLesson = (sectionId, lessonId) => {
        setFormData(prev => ({
            ...prev,
            sections: prev.sections.map(s => {
                if (s.id === sectionId) {
                    const newLessons = s.lessons.filter(l => l.id !== lessonId);
                    return { ...s, lessons: newLessons, lectures: newLessons.length };
                }
                return s;
            })
        }));
    };

    const updateLesson = (sectionId, lessonId, field, value) => {
        setFormData(prev => ({
            ...prev,
            sections: prev.sections.map(s => {
                if (s.id === sectionId) {
                    return {
                        ...s,
                        lessons: s.lessons.map(l => l.id === lessonId ? { ...l, [field]: value } : l)
                    };
                }
                return s;
            })
        }));
    };

    const handleSubmit = () => {
        // Mock submission
        const confirmation = window.confirm("Are you sure you want to submit this course for approval?");
        if (confirmation) {
            alert("Course submitted successfully! Redirecting to dashboard...");
            window.location.href = "/instructor/dashboard";
        }
    };

    return (
        <InstructorLayout>
            <div className="max-w-6xl mx-auto p-6 md:p-10">
                {/* Stepper Header */}
                <div className="mb-10">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-3xl font-bold">Create New Course</h1>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Save Draft</button>
                            <Link to="/instructor/courses" className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-secondary transition-colors">
                                Cancel
                            </Link>
                        </div>
                    </div>
                    {/* ... stepper UI ... */}
                    <div className="relative">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-secondary -z-10 rounded-full" />
                        <div
                            className="absolute top-1/2 left-0 h-1 bg-primary -z-10 rounded-full transition-all duration-300"
                            style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                        />
                        <div className="flex justify-between">
                            {steps.map((step, index) => {
                                const stepNum = index + 1;
                                const isActive = stepNum === currentStep;
                                const isCompleted = stepNum < currentStep;
                                return (
                                    <div key={step} className="flex flex-col items-center gap-2 bg-background px-2">
                                        <div
                                            className={`size-10 rounded-full flex items-center justify-center font-bold border-2 transition-all ${isActive ? "border-primary bg-primary text-primary-foreground scale-110" :
                                                isCompleted ? "border-primary bg-primary text-primary-foreground" :
                                                    "border-muted bg-secondary text-muted-foreground"
                                                }`}
                                        >
                                            {isCompleted ? <Check className="size-5" /> : stepNum}
                                        </div>
                                        <span className={`text-xs font-semibold ${isActive ? "text-primary" : "text-muted-foreground"}`}>{step}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Step Content */}
                <div className="bg-card border border-border rounded-xl p-8 shadow-sm min-h-[500px] flex flex-col">
                    <div className="flex-1">
                        {currentStep === 1 && (
                            <div className="space-y-6 max-w-2xl mx-auto animation-fade-in">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Course Title</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        placeholder="e.g. Advanced React Patterns"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold">Category</label>
                                        <select
                                            className="w-full px-4 py-2 border border-border rounded-lg bg-background file outline-none"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            <option value="">Select Category</option>
                                            <option value="web-dev">Web Development</option>
                                            <option value="data-science">Data Science</option>
                                            <option value="Design">Design</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold">Level</label>
                                        <select
                                            className="w-full px-4 py-2 border border-border rounded-lg bg-background outline-none"
                                            value={formData.level}
                                            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                        >
                                            <option>Beginner</option>
                                            <option>Intermediate</option>
                                            <option>Advanced</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold">Price ($)</label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            placeholder="89.99"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold">Original Price ($) <span className="text-xs font-normal text-muted-foreground">(Optional)</span></label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            placeholder="129.99"
                                            value={formData.originalPrice}
                                            onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || 0 })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Description</label>
                                    <textarea
                                        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all h-32"
                                        placeholder="What will students learn in this course?"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Course Thumbnail</label>
                                    <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-secondary/50 transition-colors cursor-pointer">
                                        <div className="p-4 bg-secondary rounded-full mb-3">
                                            <Upload className="size-6 text-muted-foreground" />
                                        </div>
                                        <p className="text-sm font-medium">Click to upload or drag and drop</p>
                                        <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-6 max-w-3xl mx-auto animation-fade-in">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold">Course Curriculum</h3>
                                    <button
                                        onClick={addSection}
                                        type="button"
                                        className="flex items-center gap-2 text-sm font-bold text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                        <Plus className="size-4" /> Add Section
                                    </button>
                                </div>

                                {formData.sections.map((section, sIdx) => (
                                    <div key={section.id} className="border border-border rounded-xl overflow-hidden bg-card/50 shadow-sm">
                                        <div className="bg-secondary/30 p-4 flex items-center gap-3 border-b border-border">
                                            <GripVertical className="size-5 text-muted-foreground cursor-move" />
                                            <span className="font-bold text-sm">Section {sIdx + 1}:</span>
                                            <input
                                                type="text"
                                                value={section.title}
                                                className="bg-transparent font-bold text-sm outline-none flex-1 focus:underline"
                                                onChange={(e) => updateSection(section.id, e.target.value)}
                                            />
                                            <div className="flex gap-2 text-xs text-muted-foreground items-center">
                                                <span>{section.lessons.length} lectures</span>
                                                <button onClick={() => removeSection(section.id)} type="button" className="p-1 hover:text-destructive transition-colors ml-2"><Trash className="size-4" /></button>
                                            </div>
                                        </div>
                                        <div className="p-4 space-y-3">
                                            {section.lessons.map((lesson, lIdx) => (
                                                <div key={lesson.id} className="flex items-center gap-3 p-3 bg-background border border-border rounded-lg group hover:border-primary/50 transition-colors">
                                                    <GripVertical className="size-4 text-muted-foreground cursor-move" />

                                                    {/* Type Selector */}
                                                    <select
                                                        value={lesson.type}
                                                        onChange={(e) => updateLesson(section.id, lesson.id, "type", e.target.value)}
                                                        className="text-xs bg-secondary border-none rounded px-2 py-1 outline-none cursor-pointer"
                                                    >
                                                        <option value="video">Video</option>
                                                        <option value="document">PDF</option>
                                                        <option value="quiz">Quiz</option>
                                                    </select>

                                                    {lesson.type === 'video' ? <Video className="size-4 text-blue-500" /> : <FileText className="size-4 text-orange-500" />}

                                                    <input
                                                        type="text"
                                                        value={lesson.title}
                                                        onChange={(e) => updateLesson(section.id, lesson.id, "title", e.target.value)}
                                                        className="text-sm flex-1 bg-transparent outline-none"
                                                    />

                                                    {lesson.duration && <span className="text-xs text-muted-foreground">{lesson.duration}</span>}
                                                    <button onClick={() => removeLesson(section.id, lesson.id)} type="button" className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-opacity"><Trash className="size-3" /></button>
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => addLesson(section.id)}
                                                type="button"
                                                className="w-full py-2 border-2 border-dashed border-border rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary/50 hover:text-primary hover:border-primary/30 transition-all flex items-center justify-center gap-2"
                                            >
                                                <Plus className="size-4" /> Add Lesson
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="space-y-6 max-w-2xl mx-auto text-center animation-fade-in">
                                <div className="p-10 border-2 border-dashed border-border rounded-xl bg-secondary/20">
                                    <Video className="size-12 text-primary mx-auto mb-4" />
                                    <h3 className="text-lg font-bold">Upload Course Content</h3>
                                    <p className="text-muted-foreground text-sm mb-6">Upload videos and resources for your lessons.</p>
                                    <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
                                        Select Files
                                    </button>
                                </div>
                                <div className="text-left space-y-4">
                                    <h4 className="font-bold text-sm">Uploading...</h4>
                                    <div className="bg-card border border-border p-4 rounded-xl flex items-center gap-4">
                                        <div className="size-10 bg-secondary rounded-lg flex items-center justify-center">
                                            <Video className="size-5 text-blue-500" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="font-medium">Intro_Lesson_1.mp4</span>
                                                <span>100%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                                <div className="h-full bg-green-500 w-full" />
                                            </div>
                                        </div>
                                        <Check className="size-5 text-green-500" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 4 && (
                            <div className="max-w-5xl mx-auto space-y-10 animation-fade-in pb-10">
                                <div className="flex flex-col lg:flex-row gap-10">
                                    {/* Left: Main Course Content */}
                                    <div className="flex-1 space-y-8">
                                        <div className="space-y-4">
                                            <h2 className="text-4xl font-extrabold leading-tight">{formData.title}</h2>
                                            <p className="text-lg text-muted-foreground">{formData.description}</p>

                                            <div className="flex flex-wrap items-center gap-6 text-sm">
                                                <div className="flex items-center gap-1 font-bold">
                                                    <span className="text-warning">{formData.rating}</span>
                                                    <div className="flex text-warning">
                                                        {[...Array(5)].map((_, i) => <Star key={i} className={`size-4 ${i < 5 ? "fill-current" : ""}`} />)}
                                                    </div>
                                                    <span className="text-muted-foreground font-normal underline">({formData.reviews.toLocaleString()} ratings)</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Users className="size-4" />
                                                    <span>{formData.enrolled.toLocaleString()} students enrolled</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-muted-foreground font-bold">
                                                    <span className="px-2 py-0.5 bg-success/10 text-success rounded border border-success/20 text-[10px] uppercase">Take Test Available</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="relative aspect-video rounded-2xl overflow-hidden bg-foreground group border border-border">
                                            <img src="/assets/course-uiux.jpg" alt="Preview" className="w-full h-full object-cover opacity-60" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
                                                <button className="size-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl hover:scale-110 transition-transform">
                                                    <Play className="size-10 fill-current text-primary-foreground ml-1" />
                                                </button>
                                                <p className="text-white font-bold text-xl">Preview this course</p>
                                                <p className="text-white/70 text-sm">2:45 minutes of introductory content • Module 1</p>
                                            </div>
                                        </div>

                                        <section className="space-y-4">
                                            <h3 className="text-2xl font-bold">What you'll learn</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-secondary/20 p-6 rounded-2xl border border-border">
                                                {formData.learningPoints.map((point, i) => (
                                                    <div key={i} className="flex gap-3 text-sm">
                                                        <Check className="size-4 text-primary shrink-0 mt-0.5" />
                                                        <span className="text-muted-foreground">{point}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>

                                        <section className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-2xl font-bold">Course Content</h3>
                                                <span className="text-sm text-muted-foreground font-medium">{formData.sections.length} modules • 12.5 total hours</span>
                                            </div>
                                            <div className="space-y-2">
                                                {formData.sections.map((section, idx) => (
                                                    <div key={idx} className="border border-border rounded-xl">
                                                        <div className="p-4 px-6 flex justify-between items-center bg-secondary/30 rounded-t-xl">
                                                            <div className="flex items-center gap-3">
                                                                <ChevronRight className="size-4" />
                                                                <span className="font-bold">{section.title}</span>
                                                            </div>
                                                            <span className="text-xs text-muted-foreground">{section.lectures} lectures • {section.duration}</span>
                                                        </div>
                                                        <div className="divide-y divide-border">
                                                            {section.lessons.map((lesson) => (
                                                                <div key={lesson.id} className="flex items-center justify-between p-4 px-6 hover:bg-secondary/10 transition-colors">
                                                                    <div className="flex items-center gap-3">
                                                                        {lesson.type === 'video' ? <Video className="size-4 text-blue-500" /> : <FileText className="size-4 text-orange-500" />}
                                                                        <span className="text-sm font-medium">{lesson.title}</span>
                                                                    </div>
                                                                    <span className="text-xs text-muted-foreground">{lesson.duration || "5:00"}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                                <button className="w-full py-2 text-primary font-bold text-sm hover:underline">Show all modules</button>
                                            </div>
                                        </section>

                                        <section className="space-y-6 pt-6 border-t border-border">
                                            <h3 className="text-2xl font-bold">About the Instructor</h3>
                                            <div className="flex gap-6">
                                                <div className="size-24 rounded-2xl bg-secondary flex items-center justify-center text-primary font-bold text-3xl shrink-0">
                                                    {JSON.parse(localStorage.getItem('userInfo') || '{}').name?.split(' ').map(n => n[0]).join('').toUpperCase() || "JD"}
                                                </div>
                                                <div className="space-y-2">
                                                    <h4 className="text-xl font-bold">{JSON.parse(localStorage.getItem('userInfo') || '{}').name || "Instructor"}</h4>
                                                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Expert Instructor in {formData.category}</p>
                                                    <div className="flex gap-4 text-sm font-bold pt-1">
                                                        <div className="flex items-center gap-1"><Star className="size-3 text-warning fill-warning" /> 4.9 Rating</div>
                                                        <div className="flex items-center gap-1"><Users className="size-3 text-primary" /> 156,000+ Students</div>
                                                    </div>
                                                    <p className="text-muted-foreground text-sm leading-relaxed max-w-xl pt-2">
                                                        Passionate educator with years of experience leading teams at top companies. Focusing on bridging the gap between aesthetic beauty and functional business requirements.
                                                    </p>
                                                </div>
                                            </div>
                                        </section>
                                    </div>

                                    {/* Right: Price & Specs */}
                                    <div className="lg:w-80 shrink-0">
                                        <div className="bg-card border-2 border-primary/20 rounded-2xl p-6 shadow-xl sticky top-8">
                                            <div className="flex items-baseline gap-2 mb-6">
                                                <span className="text-4xl font-black">${formData.price}</span>
                                                <span className="text-muted-foreground line-through text-lg">${formData.originalPrice}</span>
                                                <span className="text-success font-bold text-xs ml-auto">35% Off</span>
                                            </div>

                                            <div className="space-y-3 mb-6">
                                                <button className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20">Enroll Now</button>
                                                <button className="w-full bg-secondary text-foreground py-4 rounded-xl font-bold hover:bg-secondary/70">Add to Cart</button>
                                            </div>

                                            <p className="text-center text-[10px] text-muted-foreground mb-8">30-Day Money-Back Guarantee</p>

                                            <div className="space-y-4 mb-8 text-sm">
                                                <h4 className="font-bold uppercase tracking-widest text-[10px]">This course includes:</h4>
                                                <ul className="space-y-3">
                                                    <li className="flex items-center gap-3"><Video className="size-4 text-primary" /> {formData.hours} hours on-demand video</li>
                                                    <li className="flex items-center gap-3"><FileText className="size-4 text-primary" /> 12 downloadable resources</li>
                                                    <li className="flex items-center gap-3"><Monitor className="size-4 text-primary" /> Access on mobile and TV</li>
                                                    <li className="flex items-center gap-3"><Award className="size-4 text-primary" /> Certificate of completion</li>
                                                </ul>
                                            </div>

                                            <div className="pt-6 border-t border-border">
                                                <h4 className="font-bold text-xs mb-3 uppercase tracking-widest">Skills you'll gain</h4>
                                                <div className="flex flex-wrap gap-2 text-[10px]">
                                                    {formData.skills.map(s => <span key={s} className="px-2 py-1 bg-secondary rounded-full font-bold">{s}</span>)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-6 mt-6 border-t border-border flex justify-between">
                        {currentStep > 1 ? (
                            <button
                                onClick={prevStep}
                                className="px-6 py-2 border border-border rounded-lg font-medium hover:bg-secondary transition-colors"
                            >
                                Back
                            </button>
                        ) : <div />}

                        {currentStep < 4 ? (
                            <button
                                onClick={nextStep}
                                className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg font-bold hover:bg-primary/90 transition-colors"
                            >
                                Next Step <ChevronRight className="size-4" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                className="flex items-center gap-2 bg-green-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
                            >
                                Submit for Approval <Check className="size-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </InstructorLayout>
    );
}

