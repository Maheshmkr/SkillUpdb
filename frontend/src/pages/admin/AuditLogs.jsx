import { AdminLayout } from "@/layouts/AdminLayout";
import { Activity, Clock, User, Filter } from "lucide-react";

export default function AuditLogs() {
    const logs = [
        { id: 1, action: "Approved Course: 'Advanced Machine Learning'", user: "Admin User", role: "Super Admin", time: "28 mins ago", type: "Approval" },
        { id: 2, action: "Suspended User: 'BadActor123'", user: "Admin User", role: "Super Admin", time: "2 hours ago", type: "Security" },
        { id: 3, action: "Updated Platform Fees", user: "Finance Admin", role: "Manager", time: "5 hours ago", type: "Settings" },
        { id: 4, action: "Verified Instructor: 'Dr. Alan Turing'", user: "Admin User", role: "Super Admin", time: "1 day ago", type: "Verification" },
        { id: 5, action: "Deleted Course: 'Spam 101'", user: "Moderator", role: "Moderator", time: "1 day ago", type: "Deletion" },
    ];

    return (
        <AdminLayout>
            <div className="p-6 md:p-10 space-y-8 max-w-5xl mx-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
                        <p className="text-muted-foreground">Track all administrative actions.</p>
                    </div>
                    <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm font-medium hover:bg-secondary">
                        <Filter className="size-4" /> Filter Logs
                    </button>
                </div>

                <div className="relative border-l-2 border-border ml-3 space-y-8">
                    {logs.map((log) => (
                        <div key={log.id} className="relative pl-8">
                            <div className="absolute -left-[9px] top-1 size-4 rounded-full bg-background border-2 border-primary" />
                            <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-bold text-sm md:text-base">{log.action}</h3>
                                    <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                                        <Clock className="size-3" /> {log.time}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <User className="size-3" /> {log.user} ({log.role})
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full bg-secondary text-foreground font-medium">
                                        {log.type}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
