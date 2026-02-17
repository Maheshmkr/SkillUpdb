import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard, ListChecks, Users, ShieldCheck,
    FileText, Activity, LogOut, GraduationCap
} from "lucide-react";

const adminNav = [
    { title: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
    { title: "Course Approvals", to: "/admin/course-approvals", icon: ListChecks },
    { title: "Manage Users", to: "/admin/users", icon: Users },
    { title: "Instructors", to: "/admin/instructors", icon: ShieldCheck },
    { title: "Reports", to: "/admin/reports", icon: FileText },
    { title: "Audit Logs", to: "/admin/audit-logs", icon: Activity },
];

export function AdminSidebar() {
    const location = useLocation();

    return (
        <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border flex-col hidden md:flex">
            {/* Logo */}
            <div className="p-6 border-b border-border">
                <Link to="/admin/dashboard" className="flex items-center gap-3 text-destructive">
                    <div className="size-9 bg-destructive rounded-xl flex items-center justify-center text-destructive-foreground shadow-lg shadow-destructive/20">
                        <GraduationCap className="size-5" />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-foreground">SkillUp <span className="text-xs font-normal text-muted-foreground">Admin</span></h2>
                </Link>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto p-6">
                <nav className="space-y-1 mb-10">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4 px-2">Administration</p>
                    {adminNav.map((item) => {
                        const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + "/");
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.title}
                                to={item.to}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${isActive
                                    ? "bg-accent text-accent-foreground font-semibold"
                                    : "text-muted-foreground hover:bg-secondary"
                                    }`}
                            >
                                <Icon className="size-5" />
                                <span>{item.title}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* User */}
            <div className="p-6 border-t border-border">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-secondary overflow-hidden border-2 border-destructive/20">
                        <div className="w-full h-full bg-destructive/10 flex items-center justify-center text-destructive font-bold text-sm">
                            AD
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">Admin User</p>
                        <p className="text-[10px] text-muted-foreground truncate">Super Admin</p>
                    </div>
                    <Link to="/logout" className="text-muted-foreground hover:text-destructive">
                        <LogOut className="size-5" />
                    </Link>
                </div>
            </div>
        </aside>
    );
}
