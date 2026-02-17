import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { GraduationCap, PartyPopper, Mail, UserPlus, FileText, MessageSquare, ChevronRight } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enrollInCourse } from "@/api/userApi";

const steps = [
  {
    icon: UserPlus,
    title: "Complete your profile",
    desc: "Add your professional goals, learning interests, and a photo to help mentors get to know you better.",
  },
  {
    icon: FileText,
    title: "Download the syllabus",
    desc: "Get the full course roadmap, project deadlines, and recommended reading list for the semester.",
  },
  {
    icon: MessageSquare,
    title: "Introduce yourself in the forum",
    desc: "Join the student community! Say hello to your peers and start building your network today.",
  },
];

export default function EnrollmentSuccess() {
  const location = useLocation();
  const queryClient = useQueryClient();
  const { courseTitle, courseId } = location.state || { courseTitle: "Your Course", courseId: "1" };

  const enrollMutation = useMutation({
    mutationFn: async (id) => {
      return await enrollInCourse(id);
    },
    onSuccess: () => {
      // Invalidate profile query to refresh enrolled courses list
      queryClient.invalidateQueries(['profile']);
    }
  });

  useEffect(() => {
    if (courseId) {
      enrollMutation.mutate(courseId);
    }
  }, [courseId]);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Nav */}
      <header className="flex items-center justify-between border-b border-border px-10 py-3 bg-card shadow-sm">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3 text-primary">
            <div className="size-8 flex items-center justify-center bg-accent rounded-lg">
              < GraduationCap className="size-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold leading-tight tracking-tight text-foreground">EduDiscover</h2>
          </Link>
          <nav className="hidden md:flex items-center gap-9">
            <Link to="/" className="text-muted-foreground text-sm font-medium hover:text-primary transition-colors">Browse</Link>
            <Link to="/my-learning" className="text-muted-foreground text-sm font-medium hover:text-primary transition-colors">My Courses</Link>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="px-4 flex flex-1 justify-center py-12">
        <div className="flex flex-col max-w-[720px] flex-1">
          {/* Celebration Card */}
          <div className="bg-card rounded-xl shadow-xl overflow-hidden border border-border">
            <div className="relative h-56 w-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary-foreground rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-60 h-60 bg-primary-foreground rounded-full blur-3xl" />
              </div>
              <div className="relative flex flex-col items-center text-center px-6">
                <div className="size-20 bg-card rounded-full flex items-center justify-center shadow-lg mb-4">
                  <PartyPopper className="size-10 text-primary" />
                </div>
                <h1 className="text-primary-foreground text-3xl font-bold tracking-tight">You're enrolled!</h1>
              </div>
            </div>
            <div className="p-8 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{courseTitle}</h3>
                  <p className="text-muted-foreground text-base leading-relaxed">
                    {enrollMutation.isPending ? "Setting up your learning materials..." : "Your journey into this course starts now. We've unlocked all your learning materials."}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 min-w-max">
                  <Link
                    to={`/learning/${courseId}`}
                    className="flex items-center justify-center rounded-lg h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold transition-all shadow-md active:scale-95"
                  >
                    Start Learning
                  </Link>
                  <Link
                    to="/my-learning"
                    className="flex items-center justify-center rounded-lg h-12 px-6 bg-secondary hover:bg-secondary/80 text-foreground font-semibold transition-all"
                  >
                    My Courses
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Email alert */}
          <div className="mt-6 flex items-center justify-center gap-2 text-muted-foreground text-sm py-2 bg-accent rounded-lg">
            <Mail className="size-4" />
            <span>A confirmation and receipt have been sent to your registered email.</span>
          </div>

          {/* What to expect */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              What to expect next
            </h2>
            <div className="space-y-0 relative">
              <div className="absolute left-[20px] top-4 bottom-4 w-[2px] bg-border hidden md:block" />
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={i} className="flex flex-col md:flex-row gap-6 p-4 rounded-xl hover:bg-card transition-colors group">
                    <div className="z-10 flex flex-shrink-0 items-center justify-center size-10 rounded-lg bg-accent text-accent-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      <Icon className="size-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-lg font-semibold mb-1">{step.title}</p>
                      <p className="text-muted-foreground text-base">{step.desc}</p>
                    </div>
                    <div className="flex items-center">
                      <ChevronRight className="size-5 text-muted-foreground/30 hidden md:block" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 pb-12 border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-muted-foreground text-sm">© 2024 EduDiscover Inc. All rights reserved.</div>
            <div className="flex gap-6">
              <a className="text-muted-foreground hover:text-primary text-sm font-medium" href="#">Support Center</a>
              <a className="text-muted-foreground hover:text-primary text-sm font-medium" href="#">Terms of Service</a>
              <a className="text-muted-foreground hover:text-primary text-sm font-medium" href="#">Privacy Policy</a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
