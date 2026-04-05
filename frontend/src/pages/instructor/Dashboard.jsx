import { InstructorLayout } from "@/layouts/InstructorLayout";
import { Users, BookOpen, Star, TrendingUp, Plus, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function InstructorDashboard() {
    const kpiData = [
        { title: "Total Courses", value: "12", change: "+2 this month", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" },
        { title: "Total Enrollments", value: "1,482", change: "+12% vs last month", icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
        { title: "Avg. Rating", value: "4.8", change: "0.2 increase", icon: Star, color: "text-yellow-500", bg: "bg-yellow-500/10" },
        { title: "Total Revenue", value: "$12,450", change: "+8% vs last month", icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" },
    ];

    const recentEnrollments = [
        { id: 1, student: "Alice Johnson", course: "Advanced React Patterns", date: "2 hours ago", progress: 0 },
        { id: 2, student: "Bob Smith", course: "Node.js Masterclass", date: "5 hours ago", progress: 12 },
        { id: 3, student: "Charlie Brown", course: "UI/UX Design Fundamentals", date: "1 day ago", progress: 45 },
        { id: 4, student: "Diana Prince", course: "Advanced React Patterns", date: "1 day ago", progress: 100 },
    ];
    const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    return (
        <InstructorLayout>
            <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Instructor Dashboard</h1>
                        <p className="text-muted-foreground">Welcome back, {JSON.parse(localStorage.getItem('userInfo') || '{}').name?.split(' ')[0] || 'Instructor'}! Here's what's happening today.</p>
                    </div>
                    <Link to="/instructor/courses/new" className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                        <Plus className="size-5" />
                        Create New Course
                    </Link>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {kpiData.map((item, idx) => (
                        <div key={idx} className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">{item.title}</p>
                                <h3 className="text-2xl font-bold">{item.value}</h3>
                                <p className="text-xs text-muted-foreground mt-1">{item.change}</p>
                            </div>
                            <div className={`p-3 rounded-lg ${item.bg} ${item.color}`}>
                                <item.icon className="size-5" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Enrollments */}
                    <div className="lg:col-span-2 bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-border flex items-center justify-between">
                            <h3 className="font-bold text-lg">Recent Enrollments</h3>
                            <Link to="/instructor/enrollments" className="text-sm text-primary hover:underline flex items-center gap-1">
                                View All <ArrowRight className="size-4" />
                            </Link>
                        </div>
                        <div className="divide-y divide-border">
                            {recentEnrollments.map((item) => (
                                <div key={item.id} className="p-4 flex items-center justify-between hover:bg-secondary/20 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="size-10 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-muted-foreground">
                                            {item.student.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{item.student}</p>
                                            <p className="text-xs text-muted-foreground">Enrolled in <span className="text-primary">{item.course}</span></p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-medium">{item.date}</p>
                                        <p className="text-[10px] text-muted-foreground">Progress: {item.progress}%</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions & Reviews */}
                    <div className="space-y-8">
                        <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                            <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:bg-secondary transition-colors text-sm font-medium">
                                    Create Announcement <ArrowRight className="size-4 text-muted-foreground" />
                                </button>
                                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:bg-secondary transition-colors text-sm font-medium">
                                    View Course Analytics <ArrowRight className="size-4 text-muted-foreground" />
                                </button>
                                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:bg-secondary transition-colors text-sm font-medium">
                                    Edit Profile <ArrowRight className="size-4 text-muted-foreground" />
                                </button>
                            </div>
                        </div>

                        <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                            <h3 className="font-bold text-lg mb-4">Recent Reviews</h3>
                            <div className="space-y-4">
                                {[1, 2].map((i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <div className="flex text-yellow-500">
                                                {[...Array(5)].map((_, i) => <Star key={i} className="size-3 fill-current" />)}
                                            </div>
                                            <span className="text-xs text-muted-foreground">2 days ago</span>
                                        </div>
                                        <p className="text-sm italic text-muted-foreground">"Great course! The explanations are very clear and the projects are fun."</p>
                                        <p className="text-xs font-bold">- Happy Student</p>
                                    </div>
                                ))}
                            </div>
                            <Link to="/instructor/reviews" className="block mt-4 text-sm text-center text-primary hover:underline">View all reviews</Link>
                        </div>
                    </div>
                </div>
            </div>
        </InstructorLayout>
    );
}
