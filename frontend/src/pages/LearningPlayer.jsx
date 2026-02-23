import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    ArrowLeft, Bell, Play, FileText, HelpCircle,
    ChevronDown, ChevronUp, Lock, CheckCircle,
    Trophy, ArrowRight, Star, Clock, Award
} from "lucide-react";
import { getCourseById } from "@/api/courseApi";
import { getUserProgress, updateCourseProgress } from "@/api/userApi";
import { QuizAttempt, QuizResult } from "@/components/learning/QuizComponents";

const getEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes('youtube.com/embed/')) return url;
    let videoId = null;
    if (url.includes('youtube.com/watch?v=')) videoId = url.split('v=')[1].split('&')[0];
    else if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1].split('?')[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
};

export default function LearningPlayer() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [activeLesson, setActiveLesson] = useState(null);
    const [openModules, setOpenModules] = useState({ 0: true });
    const [quizState, setQuizState] = useState(null); // { status: 'idle' | 'attempting' | 'finished', result: null }

    const { data: course, isLoading: loadingCourse } = useQuery({
        queryKey: ['course', courseId],
        queryFn: () => getCourseById(courseId)
    });

    const { data: progressData, isLoading: loadingProgress } = useQuery({
        queryKey: ['progress', courseId],
        queryFn: () => getUserProgress(courseId),
        staleTime: 0
    });

    const modules = course?.modules || [];
    const completedLessons = progressData?.completedLessons || []; // Assume this is an array of lesson IDs
    const moduleGrades = progressData?.moduleGrades || {}; // { [moduleId]: percentage }

    useEffect(() => {
        if (modules.length > 0 && !activeLesson) {
            setActiveLesson(modules[0].lessons[0]);
        }
    }, [modules, activeLesson]);

    const completeMutation = useMutation({
        mutationFn: (lessonId) => updateCourseProgress({ courseId, lessonId, status: 'completed' }),
        onSuccess: () => queryClient.invalidateQueries(['progress', courseId])
    });

    const goToNextLesson = () => {
        const allLessons = modules.flatMap(m => m.lessons);
        const currentIdx = allLessons.findIndex(l => l._id === activeLesson?._id);

        if (currentIdx < allLessons.length - 1) {
            const nextLesson = allLessons[currentIdx + 1];
            // If next lesson is in a locked module, it might fail in the background, 
            // but the UI logic should handle it.
            setActiveLesson(nextLesson);
            if (nextLesson.type === 'quiz') setQuizState({ status: 'idle', result: null });
            else setQuizState(null);
        }
    };

    const handleLessonComplete = () => {
        if (activeLesson && !completedLessons.includes(activeLesson._id)) {
            completeMutation.mutate(activeLesson._id, {
                onSuccess: () => {
                    // Automatically go to next lesson after marking as done
                    setTimeout(goToNextLesson, 500);
                }
            });
        } else {
            // If already completed, just go to next
            goToNextLesson();
        }
    };

    const handleQuizFinish = (result) => {
        setQuizState({ status: 'finished', result });
        if (result.isPassed && activeLesson) {
            // Mark quiz as completed in backend if passed
            completeMutation.mutate(activeLesson._id);
        }
    };

    const isModuleLocked = (moduleIndex) => {
        if (moduleIndex === 0) return false;
        const prevModule = modules[moduleIndex - 1];
        const prevModuleQuiz = prevModule.lessons.find(l => l.type === 'quiz');

        // Logic: All lessons in prev module must be completed AND quiz must be passed
        const allLessonsDone = prevModule.lessons.every(l => completedLessons.includes(l._id));
        const quizPassed = prevModuleQuiz ? (moduleGrades[prevModule._id] >= (prevModuleQuiz.passPercentage || 80)) : true;

        // For demo/UI simplicity, we check if previous module's completion criteria is met
        return !(allLessonsDone && quizPassed);
    };

    if (loadingCourse || loadingProgress) return <div className="h-screen flex items-center justify-center bg-gray-50">Loading Learner Experience...</div>;

    return (
        <div className="h-screen flex flex-col bg-white">
            {/* Top Header */}
            <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-6 z-20">
                <div className="flex items-center gap-4">
                    <Link to={`/course/${courseId}`} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="h-6 w-px bg-gray-200 mx-1" />
                    <h1 className="text-sm font-bold text-gray-900 truncate max-w-sm">{course.title}</h1>
                </div>
                <div className="flex items-center gap-6">
                    {progressData?.progress >= 100 && (
                        <button
                            className="hidden lg:flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
                            onClick={() => window.open(`https://skillup-certificates.s3.amazonaws.com/${courseId}.pdf`, '_blank')}
                        >
                            <Award size={14} /> Download Certificate
                        </button>
                    )}
                    <div className="hidden md:flex flex-col items-end">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Progress</span>
                            <span className="text-xs font-bold text-blue-600">{progressData?.progress || 0}%</span>
                        </div>
                        <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 transition-all duration-700" style={{ width: `${progressData?.progress || 0}%` }} />
                        </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Bell size={20} />
                    </button>
                    <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 text-xs font-bold">
                        MS
                    </div>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar: Curriculum */}
                <aside className="w-80 border-r border-gray-200 bg-gray-50 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Course Content</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {modules.map((module, mIdx) => {
                            const locked = isModuleLocked(mIdx);
                            const isOpen = openModules[mIdx];
                            return (
                                <div key={module._id} className="border-b border-gray-200">
                                    <button
                                        onClick={() => !locked && setOpenModules({ ...openModules, [mIdx]: !isOpen })}
                                        className={`w-full flex items-center justify-between p-4 text-left transition-colors ${locked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {locked ? <Lock size={14} className="text-gray-400" /> : (isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                                            <span className={`text-sm font-bold ${activeLesson?.moduleId === module._id ? 'text-blue-600' : 'text-gray-700'}`}>
                                                {module.title}
                                            </span>
                                        </div>
                                    </button>

                                    {!locked && isOpen && (
                                        <div className="bg-white">
                                            {module.lessons.map((lesson) => (
                                                <button
                                                    key={lesson._id}
                                                    onClick={() => {
                                                        setActiveLesson(lesson);
                                                        if (lesson.type === 'quiz') setQuizState({ status: 'idle', result: null });
                                                        else setQuizState(null);
                                                    }}
                                                    className={`w-full flex items-center justify-between py-3 px-6 text-left border-l-4 transition-all ${activeLesson?._id === lesson._id ? 'bg-blue-50 border-blue-600 text-blue-700' : 'border-transparent text-gray-600 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {completedLessons.includes(lesson._id) ? (
                                                            <CheckCircle size={16} className="text-green-600" />
                                                        ) : (
                                                            lesson.type === 'video' ? <Play size={16} /> :
                                                                lesson.type === 'quiz' ? <HelpCircle size={16} /> : <FileText size={16} />
                                                        )}
                                                        <span className="text-xs font-medium">{lesson.title}</span>
                                                    </div>
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase">{lesson.duration || '5m'}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    {locked && (
                                        <div className="px-10 py-2">
                                            <p className="text-[10px] text-gray-400 italic">Pass Module {mIdx} Quiz to unlock</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </aside>

                {/* Center Panel: Content Player */}
                <main className="flex-1 flex flex-col bg-white overflow-hidden relative">
                    <div className="flex-1 overflow-y-auto p-10">
                        {activeLesson?.type === 'video' && (
                            <div className="max-w-4xl mx-auto">
                                <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl mb-8">
                                    <iframe
                                        src={getEmbedUrl(activeLesson.contentUrl)}
                                        className="w-full h-full"
                                        allowFullScreen
                                        title={activeLesson.title}
                                    />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">{activeLesson.title}</h2>
                                <div className="prose prose-blue max-w-none text-gray-600">
                                    <p>In this lesson, we cover the core concepts of {activeLesson.title}. Follow along with the video and try the examples yourself.</p>
                                </div>
                            </div>
                        )}

                        {activeLesson?.type === 'reading' && (
                            <div className="max-w-3xl mx-auto py-10">
                                <h1 className="text-4xl font-black text-gray-900 mb-8">{activeLesson.title}</h1>
                                <div className="prose prose-lg prose-blue max-w-none text-gray-700 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: activeLesson.content || 'Reading content goes here...' }}
                                />
                            </div>
                        )}

                        {activeLesson?.type === 'quiz' && (
                            <div className="h-full flex items-center justify-center">
                                {quizState?.status === 'idle' && (
                                    <div className="text-center max-w-md">
                                        <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <HelpCircle size={40} />
                                        </div>
                                        <h2 className="text-2xl font-bold mb-2">Module Quiz</h2>
                                        <p className="text-gray-500 mb-8">Test your knowledge. Passing this quiz with at least {activeLesson.passPercentage || 80}% is required to unlock the next module.</p>
                                        <button
                                            onClick={() => setQuizState({ status: 'attempting', result: null })}
                                            className="px-10 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                                        >
                                            Start Quiz
                                        </button>
                                    </div>
                                )}

                                {quizState?.status === 'attempting' && (
                                    <QuizAttempt
                                        quiz={{
                                            title: activeLesson.title,
                                            passPercentage: activeLesson.passPercentage,
                                            questions: activeLesson.questions || [
                                                { questionText: 'What is the primary benefit of this module?', options: ['Option A', 'Option B', 'Option C', 'Option D'], correctAnswer: 0 },
                                                { questionText: 'How do you implement the core pattern?', options: ['Step 1', 'Step 2', 'Step 3', 'Step 4'], correctAnswer: 1 }
                                            ]
                                        }}
                                        onFinish={handleQuizFinish}
                                    />
                                )}

                                {quizState?.status === 'finished' && (
                                    <QuizResult
                                        result={quizState.result}
                                        onRetry={() => setQuizState({ status: 'attempting', result: null })}
                                        onContinue={() => {
                                            goToNextLesson();
                                        }}
                                    />
                                )}
                            </div>
                        )}
                    </div>

                    {/* Bottom Control Bar */}
                    <div className="h-16 border-t border-gray-200 bg-white px-8 flex items-center justify-between">
                        <button className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900">
                            Resources
                        </button>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleLessonComplete}
                                disabled={completedLessons.includes(activeLesson?._id) || activeLesson?.type === 'quiz'}
                                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-sm transition-all shadow-md ${completedLessons.includes(activeLesson?._id)
                                    ? 'bg-green-100 text-green-700 border border-green-200 shadow-none'
                                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100'
                                    }`}
                            >
                                {completedLessons.includes(activeLesson?._id) ? 'Lesson Completed' : 'Mark as Done'}
                                <CheckCircle size={16} />
                            </button>
                            <button
                                onClick={goToNextLesson}
                                className="flex items-center gap-2 px-6 py-2 bg-gray-900 text-white rounded-lg font-bold text-sm hover:bg-black transition-all shadow-md shadow-gray-200"
                            >
                                Next Lesson <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </main>

                {/* Right Panel: Progress & Badges */}
                <aside className="w-80 border-l border-gray-200 bg-gray-50 hidden xl:flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="font-bold text-gray-900 mb-4">Course Progress</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-1">
                                <span className="text-gray-400">Total Completion</span>
                                <span className="text-blue-600">{progressData?.progress || 0}%</span>
                            </div>
                            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600" style={{ width: `${progressData?.progress || 0}%` }} />
                            </div>
                            <p className="text-[10px] text-gray-500 italic">Complete all modules and pass quizzes to earn your certificate.</p>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-900">Achievements</h3>
                            <Link to={`/learn/${courseId}/achievements`} className="text-[10px] font-bold text-blue-600 uppercase hover:underline">View All</Link>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className={`aspect-square rounded-lg flex items-center justify-center border-2 ${i === 1 ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-gray-100 border-gray-200 text-gray-300'}`}>
                                    {i === 1 ? <Trophy size={24} /> : <Lock size={20} />}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-auto p-6 bg-blue-600 text-white">
                        <div className="flex gap-4 items-start">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <Award size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm mb-1">Earn your Certificate</h4>
                                <p className="text-[10px] text-blue-100 mb-3">Reach 80% to unlock your professional credential.</p>
                                <div className="flex items-center gap-2">
                                    <div className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                                        <div className="h-full bg-white" style={{ width: `${progressData?.progress || 0}%` }} />
                                    </div>
                                    <span className="text-[10px] font-bold">{progressData?.progress || 0}%</span>
                                </div>
                                {progressData?.progress >= 100 && (
                                    <button
                                        onClick={() => window.open(`https://skillup-certificates.s3.amazonaws.com/${courseId}.pdf`, '_blank')}
                                        className="mt-4 w-full py-2 bg-white text-blue-600 rounded-lg text-[10px] font-bold hover:bg-blue-50 transition-all shadow-sm"
                                    >
                                        Download Now
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
