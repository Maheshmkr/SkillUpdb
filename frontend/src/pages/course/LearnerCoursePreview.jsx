import React, { useState } from 'react';
import { useLocation, useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
    Play, Check, Star, Users, Clock, Globe, Award, ShieldCheck,
    Lock, AlertCircle, ChevronLeft, ChevronDown, ChevronRight, FileText, HelpCircle
} from "lucide-react";

export default function LearnerCoursePreview() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const mode = searchParams.get('mode') || 'before'; // 'before' (Marketing) or 'after' (Learning)
    const course = state?.courseData;

    // Local state for 'after' mode
    const [activeLesson, setActiveLesson] = useState(course?.modules[0]?.lessons[0]);
    const [completedLessons, setCompletedLessons] = useState([]);

    const totalLessonsCount = course?.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;

    if (!course) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h2 className="text-2xl font-bold mb-4">No Course Data Found</h2>
                <Link to="/instructor/courses/new" className="text-primary hover:underline">Return to Course Builder</Link>
            </div>
        );
    }

    const toggleComplete = (id) => {
        if (completedLessons.includes(id)) {
            setCompletedLessons(completedLessons.filter(l => l !== id));
        } else {
            setCompletedLessons([...completedLessons, id]);
        }
    };

    // --- RENDER: AFTER ENROLL (Learning Player) ---
    if (mode === 'after') {
        return (
            <div className="flex flex-col h-screen bg-background">
                {/* Top Bar */}
                <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card shrink-0 z-10">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/instructor/courses/new', { state: { courseData } })} className="p-2 hover:bg-secondary rounded-full">
                            <ChevronLeft className="size-5" />
                        </button>
                        <div className="h-8 w-px bg-border mx-2"></div>
                        <h1 className="font-bold text-lg truncate max-w-md">{course.title}</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end mr-4">
                            <div className="text-xs text-muted-foreground font-bold mb-1">Your Progress: {totalLessonsCount > 0 ? Math.round((completedLessons.length / totalLessonsCount) * 100) : 0}%</div>
                            <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                                <div className="h-full bg-success transition-all duration-500" style={{ width: `${totalLessonsCount > 0 ? (completedLessons.length / totalLessonsCount) * 100 : 0}%` }}></div>
                            </div>
                        </div>
                        <button className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg text-sm font-bold border border-green-600 shadow-sm" onClick={() => navigate('/instructor/courses/new', { state: { courseData: { ...course, modules: course.modules } } })}>Return to Submit</button>
                        <div className="size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">U</div>
                    </div>
                </header>

                <div className="flex flex-1 overflow-hidden">
                    {/* Player Area (Left/Center) */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-secondary/10">
                        <div className="max-w-4xl mx-auto space-y-6">
                            {/* Video Player Placeholder */}
                            <div className="aspect-video bg-black rounded-xl relative shadow-2xl overflow-hidden group">
                                {activeLesson?.type === 'video' ? (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black">
                                        {activeLesson?.contentUrl ? (
                                            <video
                                                controls
                                                src={activeLesson.contentUrl}
                                                className="w-full h-full"
                                                controlsList="nodownload"
                                            />
                                        ) : (
                                            <div className="text-center text-white space-y-4">
                                                <Play className="size-20 fill-white opacity-80" />
                                                <p className="font-bold">No Video Source</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 bg-card flex flex-col items-center justify-center text-foreground p-10 text-center">
                                        <FileText className="size-16 text-primary mb-4" />
                                        <h3 className="text-2xl font-bold">{activeLesson?.title}</h3>
                                        <p className="text-muted-foreground mt-2">This is a text reading or PDF resource.</p>
                                        {activeLesson?.file && (
                                            <a
                                                href={activeLesson.contentUrl}
                                                download={activeLesson.file.name}
                                                className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-bold flex items-center gap-2 hover:bg-primary/90"
                                            >
                                                <Upload className="size-4 rotate-180" /> Download Resource
                                            </a>
                                        )}
                                    </div>
                                )}

                            </div>

                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold">{activeLesson?.title || "Select a lesson"}</h2>
                                    <p className="text-muted-foreground mt-1">From module: {course.modules.find(m => m.lessons.some(l => l.id === activeLesson?.id))?.title}</p>
                                </div>
                                <button
                                    onClick={() => activeLesson && toggleComplete(activeLesson.id)}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${completedLessons.includes(activeLesson?.id) ? 'bg-success text-success-foreground' : 'bg-primary text-primary-foreground'}`}
                                >
                                    {completedLessons.includes(activeLesson?.id) ? 'Completed' : 'Mark as Complete'}
                                    {completedLessons.includes(activeLesson?.id) && <Check className="size-4" />}
                                </button>
                            </div>

                            <div className="prose max-w-none pt-8 border-t border-border">
                                <h3>About this lesson</h3>
                                <p className="whitespace-pre-wrap">{activeLesson?.description || "No description provided for this lesson."}</p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar (Right) */}
                    <div className="w-96 bg-card border-l border-border flex flex-col shrink-0">
                        <div className="p-4 border-b border-border bg-secondary/10">
                            <h3 className="font-bold text-lg">Course Content</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {course.modules.map((module) => (
                                <div key={module.id} className="border-b border-border">
                                    <div className="p-4 bg-secondary/5 font-bold text-sm text-foreground flex justify-between items-center cursor-pointer hover:bg-secondary/20">
                                        {module.title}
                                        <span className="text-xs text-muted-foreground">{module.lessons.length} lessons</span>
                                    </div>
                                    <div>
                                        {module.lessons.map(lesson => (
                                            <div
                                                key={lesson.id}
                                                onClick={() => setActiveLesson(lesson)}
                                                className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-secondary/20 transition-colors border-l-4 ${activeLesson?.id === lesson.id ? 'border-primary bg-primary/5' : 'border-transparent'}`}
                                            >
                                                <div className="relative shrink-0">
                                                    <input
                                                        type="checkbox"
                                                        className="peer appearance-none size-5 rounded border border-muted-foreground checked:bg-success checked:border-success"
                                                        checked={completedLessons.includes(lesson.id)}
                                                        readOnly
                                                    />
                                                    <Check className="absolute top-0.5 left-0.5 size-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className={`text-sm font-medium ${activeLesson?.id === lesson.id ? 'text-primary' : ''}`}>{lesson.title}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        {lesson.type === 'video' ? <Play className="size-3 text-muted-foreground" /> : <FileText className="size-3 text-muted-foreground" />}
                                                        <span className="text-xs text-muted-foreground">{lesson.duration || "5:00"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- RENDER: BEFORE ENROLL (Marketing Page) ---
    return (
        <div className="min-h-screen bg-background">
            {/* Sticky Top Bar (Simulating Coursera) */}
            <div className="sticky top-0 z-50 bg-card border-b border-border px-6 py-3 flex items-center justify-between shadow-sm">
                <div className="font-bold text-xl">SkillUp</div>
                <div className="font-bold text-sm text-muted-foreground">Preview Mode: Marketing Page</div>
                <button onClick={() => navigate('/instructor/courses/new', { state: { courseData } })} className="px-4 py-2 text-sm font-bold border border-border rounded hover:bg-secondary">
                    Exit Preview
                </button>
            </div>

            {/* Hero Section */}
            <div className="bg-foreground text-background py-16">
                <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row gap-12">
                    <div className="flex-1 space-y-6">
                        <div className="flex items-center gap-2 text-primary-foreground font-bold text-sm">
                            <span className="text-primary">{course.category}</span>
                            <ChevronRight className="size-4" />
                            <span>{course.level}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black leading-tight text-white">{course.title}</h1>
                        <p className="text-lg text-white/80">{course.subtitle || "Master the skills you need to succeed in this comprehensive course."}</p>

                        <div className="flex items-center gap-6 text-sm font-medium text-white/90">
                            <div className="flex items-center gap-1">
                                <Star className="size-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-bold">{course.rating}</span>
                                <span className="text-white/60">({course.ratingCount.toLocaleString()} ratings)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="size-4" />
                                <span>{course.studentsEnrolled.toLocaleString()} Enrolled</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Globe className="size-4" />
                                <span>{course.language}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 pt-4">
                            <div className="size-12 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-lg border border-white/20">
                                {course.instructor.name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-white/70 text-xs font-bold uppercase tracking-wider">Instructor</p>
                                <p className="text-white font-bold hover:underline cursor-pointer">{course.instructor.name}</p>
                            </div>
                        </div>
                    </div>

                    {/* Floating Price Card (Hidden on mobile, usually) */}
                    <div className="hidden md:block w-80 relative">
                        <div className="absolute top-0 right-0 w-full bg-card text-foreground rounded-2xl p-1 shadow-2xl border border-border">
                            <div className="relative aspect-video rounded-xl overflow-hidden mb-4 group cursor-pointer bg-black">
                                <img src={course.thumbnail || "/placeholder-course.jpg"} className="w-full h-full object-cover opacity-80" alt="Thumbnail" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Play className="size-16 fill-white text-white opacity-80 group-hover:scale-110 transition-transform" />
                                </div>
                                <p className="absolute bottom-4 left-0 right-0 text-center text-white font-bold">Preview this course</p>
                            </div>

                            <div className="p-5 pt-2">
                                <div className="flex items-baseline gap-2 mb-4">
                                    <span className="text-3xl font-black">${course.price}</span>
                                    {course.originalPrice > course.price && <span className="text-muted-foreground line-through decoration-muted-foreground/50">${course.originalPrice}</span>}
                                    {course.originalPrice > course.price && <span className="text-success font-bold text-sm ml-auto">{(100 - (course.price / course.originalPrice) * 100).toFixed(0)}% Off</span>}
                                </div>

                                <button className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold text-lg mb-3 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">Enroll Now</button>
                                <button className="w-full bg-transparent border border-border text-foreground py-3 rounded-xl font-bold hover:bg-secondary transition-colors">Add to Cart</button>

                                {course.hasMoneyBackGuarantee && (
                                    <p className="text-center text-xs text-muted-foreground mt-4 mb-2">30-Day Money-Back Guarantee</p>
                                )}

                                <div className="mt-6 space-y-3 text-sm">
                                    <p className="font-bold text-xs uppercase tracking-wider">This course includes:</p>
                                    {course.includes.map((inc, i) => (
                                        <div key={i} className="flex gap-3 text-muted-foreground"><Check className="size-4 shrink-0 text-primary" /> <span>{inc}</span></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-12">
                <div className="flex-1 space-y-12">
                    {/* What you'll learn */}
                    <section className="bg-secondary/10 border border-border rounded-2xl p-8">
                        <h2 className="text-2xl font-bold mb-6">What you'll learn</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {course.whatYouWillLearn.map((item, i) => (
                                <div key={i} className="flex gap-3">
                                    <Check className="size-5 text-muted-foreground shrink-0" />
                                    <span className="text-sm">{item}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Curriculum */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6">Course Content</h2>
                        <div className="text-sm text-muted-foreground mb-4 flex gap-2">
                            <span>{course.modules.length} modules</span> • <span>{course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} lessons</span> • <span>{course.duration} total length</span>
                        </div>

                        <div className="border border-border rounded-xl divide-y divide-border overflow-hidden">
                            {course.modules.map(module => (
                                <div key={module.id} className="group">
                                    <div className="bg-secondary/20 p-4 px-6 flex justify-between items-center cursor-pointer hover:bg-secondary/30 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <ChevronDown className="size-4 text-muted-foreground" />
                                            <span className="font-bold text-foreground">{module.title}</span>
                                        </div>
                                        <span className="text-sm text-muted-foreground">{module.lessons.length} lectures</span>
                                    </div>
                                    <div className="bg-background">
                                        {module.lessons.map(lesson => (
                                            <div key={lesson.id} className="flex justify-between items-center p-3 px-8 hover:bg-secondary/5 text-sm">
                                                <div className="flex items-center gap-3 text-foreground/80">
                                                    {lesson.type === 'video' ? <Play className="size-3" /> : <FileText className="size-3" />}
                                                    <span>{lesson.title}</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    {lesson.isFree ? (
                                                        <span className="text-primary text-xs font-bold underline cursor-pointer">Preview</span>
                                                    ) : (
                                                        <Lock className="size-3 text-muted-foreground" />
                                                    )}
                                                    <span className="text-muted-foreground text-xs w-10 text-right">{lesson.duration || "5:00"}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Instructor */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6">Instructor</h2>
                        <div>
                            <h3 className="text-xl font-bold text-primary underline mb-1">{course.instructor.name}</h3>
                            <p className="text-muted-foreground mb-4">{course.instructor.title}</p>
                            <div className="flex gap-8 mb-6">
                                <div className="flex flex-col gap-1">
                                    <Star className="size-5 fill-foreground text-foreground" />
                                    <span className="font-bold">{course.instructor.rating} Rating</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <Award className="size-5 text-foreground" />
                                    <span className="font-bold">{course.instructor.students.toLocaleString()} Students</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <Play className="size-5 text-foreground" />
                                    <span className="font-bold">{course.instructor.courses} Courses</span>
                                </div>
                            </div>
                            <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed text-sm">
                                {course.instructor.bio || "Instructor bio will appear here."}
                            </p>
                        </div>
                    </section>
                </div>

                {/* Spacer for right column on large screens */}
                <div className="hidden md:block w-80 shrink-0"></div>
            </div>
        </div>
    );
}
