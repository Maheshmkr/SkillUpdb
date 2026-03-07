import { Link, useLocation, useNavigate } from "react-router-dom";
import { GraduationCap, Compass, CirclePlay, Users, Bookmark, LayoutDashboard, User, LogOut, Settings as SettingsIcon } from "lucide-react";

const mainNav = [
  { title: "Dashboard", to: "/", icon: LayoutDashboard },
  { title: "Explore", to: "/explore", icon: Compass },
  { title: "My Learning", to: "/my-learning", icon: CirclePlay },
  { title: "Profile", to: "/profile", icon: User },
  { title: "Settings", to: "/settings", icon: SettingsIcon },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  const getInitials = (name) => {
    if (!name) return "MS";
    const parts = name.split(' ').filter(Boolean);
    if (parts.length === 0) return "MS";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleLogout = (e) => {
    e.preventDefault();
    console.log('🚪 Logging out...');
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border flex-col hidden md:flex">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link to="/" className="flex items-center gap-3 text-primary">
          <div className="size-9 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
            <Compass className="size-5" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">SkillUp</h2>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-6">
        <nav className="space-y-1 mb-10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4 px-2">Menu</p>
          {mainNav.map((item) => {
            const isActive = location.pathname === item.to;
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
              {getInitials(userInfo.name)}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">{userInfo.name || "Alex Morgan"}</p>
            <p className="text-[10px] text-muted-foreground truncate">{userInfo.role || "Premium Student"}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <LogOut className="size-5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
