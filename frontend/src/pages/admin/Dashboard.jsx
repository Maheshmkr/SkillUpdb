import { AdminLayout } from "@/layouts/AdminLayout";
import { Users, BookOpen, ShieldCheck, CircleAlert, ArrowUpRight, CircleCheck, CircleX } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
    const kpiData = [
        { title: "Total Users", value: "8,540", change: "+120 this week", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
        { title: "Active Instructors", value: "142", change: "+5 this month", icon: ShieldCheck, color: "text-purple-500", bg: "bg-purple-500/10" },
        { title: "Total Courses", value: "340", change: "+12 pending approval", icon: BookOpen, color: "text-green-500", bg: "bg-green-500/10" },
        { title: "Pending Approvals", value: "12", change: "Requires attention", icon: CircleAlert, color: "text-orange-500", bg: "bg-orange-500/10" },
    ];

    return (
        <AdminLayout>
            <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                        <p className="text-muted-foreground">System overview and management.</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium hover:bg-secondary">
                            Generate Report
                        </button>
                    </div>
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
                    {/* Pending Course Approvals */}
                    <div className="lg:col-span-2 bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-border flex items-center justify-between">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <CircleAlert className="size-5 text-orange-500" />
                                Pending Course Approvals
                            </h3>
                            <Link to="/admin/course-approvals" className="text-sm text-primary hover:underline flex items-center gap-1">
                                View All <ArrowUpRight className="size-4" />
                            </Link>
                        </div>
                        <div className="divide-y divide-border">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-secondary/20 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 bg-secondary rounded-lg flex items-center justify-center">
                                            <BookOpen className="size-6 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm">Advanced Machine Learning</h4>
                                            <p className="text-xs text-muted-foreground">by <span className="text-foreground font-medium">Dr. Alan Turing</span> • Submitted 2 days ago</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="px-3 py-1.5 bg-green-500/10 text-green-500 text-xs font-bold rounded-lg hover:bg-green-500/20 transition-colors">
                                            Approve
                                        </button>
                                        <button className="px-3 py-1.5 bg-red-500/10 text-red-500 text-xs font-bold rounded-lg hover:bg-red-500/20 transition-colors">
                                            Reject
                                        </button>
                                        <button className="px-3 py-1.5 border border-border text-muted-foreground text-xs font-bold rounded-lg hover:bg-secondary transition-colors">
                                            Review
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* System Health / Recent Activity */}
                    <div className="space-y-6">
                        <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                            <h3 className="font-bold text-lg mb-4">System Alerts</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3 p-3 bg-red-500/10 rounded-lg text-red-600 border border-red-200/20">
                                    <CircleAlert className="size-5 shrink-0" />
                                    <div>
                                        <p className="text-sm font-bold">High Server Load</p>
                                        <p className="text-xs opacity-80">CPU usage detected at 85%.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 bg-yellow-500/10 rounded-lg text-yellow-600 border border-yellow-200/20">
                                    <CircleAlert className="size-5 shrink-0" />
                                    <div>
                                        <p className="text-sm font-bold">New Instructor Applications</p>
                                        <p className="text-xs opacity-80">5 new applications pending verification.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                            <h3 className="font-bold text-lg mb-4">Recent Audit Logs</h3>
                            <div className="space-y-4 relative pl-4 border-l border-border">
                                {[
                                    { user: "Admin User", action: "Approved Course: React Basics", time: "10 mins ago" },
                                    { user: "Admin User", action: "Suspended User: BadActor123", time: "2 hours ago" },
                                    { user: "Admin User", action: "Updated Platform Settings", time: "5 hours ago" },
                                ].map((log, i) => (
                                    <div key={i} className="relative">
                                        <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-primary border-2 border-card" />
                                        <p className="text-sm font-medium">{log.action}</p>
                                        <p className="text-xs text-muted-foreground">{log.user} • {log.time}</p>
                                    </div>
                                ))}
                            </div>
                            <Link to="/admin/audit-logs" className="block mt-4 text-sm text-center text-primary hover:underline">View Full Log</Link>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
