import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard, BookOpen, CirclePlus, Users,
    Activity, MessageSquare, LogOut, GraduationCap
} from "lucide-react";

const instructorNav = [
    { title: "Dashboard", to: "/instructor/dashboard", icon: LayoutDashboard },
    { title: "My Courses", to: "/instructor/courses", icon: BookOpen },
    { title: "Create Course", to: "/instructor/courses/new", icon: CirclePlus },
    { title: "Enrollments", to: "/instructor/enrollments", icon: Users },
    { title: "Analytics", to: "/instructor/analytics", icon: Activity },
    { title: "Reviews", to: "/instructor/reviews", icon: MessageSquare },
];

export function InstructorSidebar() {
    const location = useLocation();

    return (
        <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border flex-col hidden md:flex">
            {/* Logo */}
            <div className="p-6 border-b border-border">
                <Link to="/instructor/dashboard" className="flex items-center gap-3 text-primary">
                    <div className="size-9 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                        <GraduationCap className="size-5" />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-foreground">SkillUp <span className="text-xs font-normal text-muted-foreground">Instructor</span></h2>
                </Link>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto p-6">
                <nav className="space-y-1 mb-10">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4 px-2">Instructor Menu</p>
                    {instructorNav.map((item) => {
                        const isExact = location.pathname === item.to;
                        const isSubPath = location.pathname.startsWith(item.to + "/");

                        // Check if there's a more specific item in the nav that matches the current path
                        const hasMoreSpecificMatch = instructorNav.some(other =>
                            other.to !== item.to &&
                            (location.pathname === other.to || location.pathname.startsWith(other.to + "/")) &&
                            other.to.length > item.to.length
                        );

                        const isActive = (isExact || isSubPath) && !hasMoreSpecificMatch;
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
                    <div className="size-10 rounded-full bg-secondary overflow-hidden border-2 border-primary/20">
                        <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                            JD
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">John Doe</p>
                        <p className="text-[10px] text-muted-foreground truncate">Senior Instructor</p>
                    </div>
                    <Link to="/logout" className="text-muted-foreground hover:text-primary">
                        <LogOut className="size-5" />
                    </Link>
                </div>
            </div>
        </aside>
    );
}
