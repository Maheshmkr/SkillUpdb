import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Trophy, Award, Crown, CheckCircle2, ExternalLink, ShieldCheck, Calendar } from "lucide-react";
import { getCourseById } from "@/api/courseApi";
import { getUserProgress } from "@/api/userApi";
import { MainLayout } from "@/components/MainLayout";
import { BadgesPanel, CertificatePanel } from "@/components/achievements/AchievementsComponents";

export default function AchievementsPage() {
    const { courseId } = useParams();

    const { data: course, isLoading: loadingCourse } = useQuery({
        queryKey: ['course', courseId],
        queryFn: () => getCourseById(courseId)
    });

    // In a real app, this would be a specific badges/certificate endpoint
    const { data: progressData, isLoading: loadingProgress } = useQuery({
        queryKey: ['progress', courseId],
        queryFn: () => getUserProgress(courseId)
    });

    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const userName = userInfo.name || 'Mahesh Kumar';

    if (loadingCourse || loadingProgress) return <div className="h-screen flex items-center justify-center">Loading achievements...</div>;

    // Mock data for badges and certificates
    const mockBadges = [
        {
            _id: 'b1',
            name: 'Curriculum Starter',
            description: 'Completed your first module in the course.',
            isUnlocked: true,
            rules: [{ text: 'Complete Module 1', isMet: true }]
        },
        {
            _id: 'b2',
            name: 'Quiz Master',
            description: 'Scored 100% on any module quiz.',
            isUnlocked: false,
            rules: [
                { text: 'Score 100% on a Module Quiz', isMet: false },
                { text: 'Complete all lessons in that module', isMet: false }
            ]
        },
        {
            _id: 'b3',
            name: 'Deep Diver',
            description: 'Spent over 10 hours actively learning.',
            isUnlocked: false,
            rules: [{ text: 'Track 10+ hours of learning time', isMet: false }]
        }
    ];

    const certificateState = progressData?.progress >= 100
        ? { status: 'issued', certificateId: `CERT-${courseId.slice(-4).toUpperCase()}-2026-X921BA`, issuedAt: 'Feb 18, 2026' }
        : progressData?.progress >= 80
            ? { status: 'eligible' }
            : { status: 'notEligible', missingItems: ['Complete Module 3 Quiz', 'View all 12 lessons'] };

    return (
        <MainLayout>
            <div className="bg-gray-50 min-h-screen">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 py-10">
                    <div className="max-w-7xl mx-auto px-4 lg:px-12">
                        <Link to={`/learn/${courseId}`} className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline mb-6">
                            <ArrowLeft size={16} />
                            Back to Course
                        </Link>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div>
                                <h1 className="text-4xl font-black text-gray-900 mb-2">My Achievements</h1>
                                <p className="text-gray-500 max-w-xl">Track your progress, view your badges, and access your professional credentials for <strong>{course.title}</strong>.</p>
                            </div>
                            <div className="flex items-center gap-6 bg-blue-50 border border-blue-100 rounded-2xl p-6">
                                <div className="text-center border-r border-blue-200 pr-6">
                                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Badges</p>
                                    <p className="text-3xl font-black text-blue-700">1/3</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Certificate</p>
                                    <p className="text-sm font-bold text-blue-700">{progressData?.progress >= 100 ? 'Issued' : 'In Progress'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-7xl mx-auto px-4 lg:px-12 py-16 space-y-24">
                    {/* Certificates Section */}
                    <section>
                        <div className="flex items-center gap-3 mb-10">
                            <Award className="text-blue-600" size={32} />
                            <h2 className="text-3xl font-bold text-gray-900">Professional Certificate</h2>
                        </div>
                        <CertificatePanel
                            state={certificateState}
                            courseTitle={course?.title || "Professional Certificate"}
                            userName={userName}
                        />
                    </section>

                    {/* Badges Section */}
                    <section>
                        <div className="flex items-center gap-3 mb-10">
                            <Trophy className="text-yellow-500" size={32} />
                            <h2 className="text-3xl font-bold text-gray-900">Course Badges</h2>
                        </div>
                        <BadgesPanel badges={mockBadges} />
                    </section>

                    {/* How it works */}
                    <section className="bg-white border border-gray-200 rounded-3xl p-12">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 size={24} />
                                </div>
                                <h4 className="font-bold text-gray-900 mb-2">Learn & Pass</h4>
                                <p className="text-sm text-gray-500">Complete all curriculum items and pass module quizzes to qualify.</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Crown size={24} />
                                </div>
                                <h4 className="font-bold text-gray-900 mb-2">Earn Credentials</h4>
                                <p className="text-sm text-gray-500">Unlock unique digital badges as you hit major course milestones.</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <ExternalLink size={24} />
                                </div>
                                <h4 className="font-bold text-gray-900 mb-2">Share Success</h4>
                                <p className="text-sm text-gray-500">Add your verified certificate to LinkedIn and boost your career.</p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer info */}
                <div className="bg-gray-900 text-white py-20 mt-24">
                    <div className="max-w-7xl mx-auto px-4 lg:px-12 flex flex-col items-center text-center">
                        <ShieldCheck size={48} className="text-blue-500 mb-6" />
                        <h3 className="text-2xl font-bold mb-4 text-white">Verified SkillUp Credentials</h3>
                        <p className="text-gray-400 max-w-lg mb-8">All certificates and badges issued by SkillUp are securely verified and can be shared globally to prove your expertise.</p>
                        <div className="flex flex-wrap justify-center gap-12">
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-gray-500" />
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Lifetime Access</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={16} className="text-gray-500" />
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Industry Recognized</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
