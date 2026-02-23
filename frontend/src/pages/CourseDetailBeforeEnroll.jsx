import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
    Star, Users, Clock, ChevronRight, Lock,
    PlayCircle, FileText, HelpCircle, CheckCircle,
    Award, Globe, ShieldCheck, ShoppingCart, Share2
} from "lucide-react";
import { getCourseById } from "@/api/courseApi";
import { MainLayout } from "@/components/MainLayout";

const tabs = ["Overview", "Syllabus", "Reviews", "Instructor"];

export default function CourseDetailBeforeEnroll() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("Overview");
    const [expandedModules, setExpandedModules] = useState([0]);

    const { data: course, isLoading, error } = useQuery({
        queryKey: ['course', id],
        queryFn: () => getCourseById(id)
    });

    const toggleModule = (index) => {
        setExpandedModules(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    const handleEnroll = () => {
        // In a real app, this would call an API
        // For now, redirect to success or learning page
        navigate(`/enrollment-success`, { state: { courseId: id, courseTitle: course?.title } });
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (error || !course) return <div className="min-h-screen flex items-center justify-center">Course not found.</div>;

    return (
        <MainLayout>
            <div className="bg-white min-h-screen">
                {/* Header / Hero Section */}
                <div className="bg-gray-900 text-white py-12">
                    <div className="max-w-7xl mx-auto px-4 lg:px-12">
                        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                            <span className="hover:text-blue-400 cursor-pointer">Browse</span>
                            <ChevronRight size={14} />
                            <span className="hover:text-blue-400 cursor-pointer">{course.category}</span>
                            <ChevronRight size={14} />
                            <span className="text-white truncate lg:max-w-xs">{course.title}</span>
                        </nav>

                        <div className="lg:w-2/3">
                            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                                {course.title}
                            </h1>
                            <p className="text-lg md:text-xl text-gray-300 mb-6 font-light">
                                {course.subtitle || "Master professional skills and earn industry-recognized credentials."}
                            </p>

                            <div className="flex flex-wrap items-center gap-6 text-sm mb-8">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-yellow-400 font-bold text-base">{course.rating || 4.8}</span>
                                    <div className="flex text-yellow-400">
                                        <Star size={16} fill="currentColor" />
                                    </div>
                                    <span className="text-gray-400 underline">(1,240 reviews)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold">{course.instructor?.name || 'SkillUp Instructor'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Globe size={16} />
                                    <span>English</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handleEnroll}
                                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded shadow-lg transition-transform active:scale-95"
                                >
                                    Enroll for Free
                                </button>
                                <div className="text-sm font-medium">
                                    <p>154,230 already enrolled</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sticky Sidebar (Desktop only) */}
                <div className="max-w-7xl mx-auto px-4 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 py-10 relative">
                    <div className="lg:col-span-8">
                        <div className="border-b border-gray-200 mb-8 sticky top-0 bg-white z-10">
                            <div className="flex gap-8">
                                {tabs.map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === tab ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-gray-900'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tab Contents */}
                        {activeTab === 'Overview' && (
                            <div className="space-y-12">
                                <section>
                                    <h2 className="text-2xl font-bold mb-4">About this course</h2>
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                        {course.description || "In this course, you will learn the fundamental skills required to excel in your field. This comprehensive program covers everything from basics to advanced techniques, ensuring you're ready for the professional world."}
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-bold mb-6">What you'll learn</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {course.whatYouWillLearn?.length > 0 ? (
                                            course.whatYouWillLearn.map((point, i) => (
                                                <div key={i} className="flex gap-3 items-start">
                                                    <CheckCircle size={20} className="text-green-600 shrink-0 mt-0.5" />
                                                    <span className="text-gray-600 text-sm">{point}</span>
                                                </div>
                                            ))
                                        ) : (
                                            ['Master advanced concepts', 'Real-world project experience', 'Industry best practices'].map((point, i) => (
                                                <div key={i} className="flex gap-3 items-start">
                                                    <CheckCircle size={20} className="text-green-600 shrink-0 mt-0.5" />
                                                    <span className="text-gray-600 text-sm">{point}</span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </section>
                            </div>
                        )}

                        {activeTab === 'Syllabus' && (
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold mb-6">Syllabus - What you'll learn from this course</h2>
                                {course.modules?.map((module, mIndex) => (
                                    <div key={module._id} className="border border-gray-200 rounded-lg overflow-hidden">
                                        <button
                                            onClick={() => toggleModule(mIndex)}
                                            className="w-full text-left p-4 bg-gray-50 flex items-center justify-between group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <span className="text-blue-600 font-bold uppercase text-xs">Module {mIndex + 1}</span>
                                                <h3 className="font-bold text-gray-900">{module.title}</h3>
                                            </div>
                                            <span className="text-xs text-gray-500 font-bold uppercase">
                                                {module.lessons?.length || 0} items
                                            </span>
                                        </button>
                                        {expandedModules.includes(mIndex) && (
                                            <div className="divide-y divide-gray-100">
                                                {module.lessons?.map((lesson) => (
                                                    <div key={lesson._id} className="p-4 flex items-center justify-between hover:bg-gray-50 group">
                                                        <div className="flex items-center gap-4">
                                                            {lesson.type === 'video' && <PlayCircle size={18} className="text-gray-400" />}
                                                            {lesson.type === 'reading' && <FileText size={18} className="text-gray-400" />}
                                                            {lesson.type === 'quiz' && <HelpCircle size={18} className="text-gray-400" />}
                                                            <span className="text-sm text-gray-700 font-medium group-hover:text-blue-600">
                                                                {lesson.title}
                                                            </span>
                                                        </div>
                                                        <Lock size={16} className="text-gray-300" />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sticky Sidebar Right */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-24 space-y-6">
                            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden p-6">
                                <div className="aspect-video bg-gray-100 rounded mb-6 flex items-center justify-center relative group cursor-pointer overflow-hidden border border-gray-200">
                                    <img
                                        src={course.thumbnail}
                                        alt={course.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <PlayCircle size={48} className="text-white" />
                                    </div>
                                </div>

                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-3xl font-bold">${course.price || 0}</span>
                                    {course.originalPrice && (
                                        <span className="text-gray-400 line-through">${course.originalPrice}</span>
                                    )}
                                </div>

                                <button
                                    onClick={handleEnroll}
                                    className="w-full py-4 bg-blue-600 text-white font-bold rounded mb-3 hover:bg-blue-700 shadow-md transition-colors"
                                >
                                    Go to course
                                </button>
                                <button className="w-full py-3 bg-white border border-blue-600 text-blue-600 font-bold rounded hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                                    <ShoppingCart size={18} />
                                    Add to Cart
                                </button>

                                <div className="mt-8 space-y-4">
                                    <h4 className="font-bold text-sm">Course Includes</h4>
                                    <ul className="space-y-3 text-sm text-gray-600">
                                        <li className="flex items-center gap-3">
                                            <Clock size={16} className="text-blue-600" />
                                            <span>{course.totalHours || 12} hours on-demand video</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <ShieldCheck size={16} className="text-blue-600" />
                                            <span>Professional Certificate</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <Award size={16} className="text-blue-600" />
                                            <span>Sharable Badge</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="mt-8 flex justify-center gap-4 text-gray-500">
                                    <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                                        <Share2 size={16} />
                                        <span className="text-xs font-bold uppercase">Share</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
