import { Link } from "react-router-dom";
import { MainLayout } from "@/components/MainLayout";
import {
  CirclePlay, Bookmark, Sparkles, Flame, Clock, Play, ChevronLeft, ChevronRight,
  Star, Heart, Trophy, BadgeCheck, Lock, Calendar
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/api/userApi";
import { getPublishedCourses } from "@/api/courseApi";

const recommended = [
  { title: "Full-Stack React & Next.js", hours: 18, lessons: 45, price: "$89.99", rating: 4.8, image: "/assets/course-business.jpg" },
  { title: "Intro to Cloud Architecture", hours: 12, lessons: 30, price: "$124.00", rating: 4.2, image: "/assets/course-datascience.jpg" },
];

export default function Dashboard() {
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      return await getPublishedCourses();
    }
  });

  // Fetch User Profile for Enrollment
  const { data: user, isLoading: loadingProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      return await getUserProfile();
    }
  });

  const enrolledCourses = user?.enrolledCourses || [];
  const mainEnrollment = enrolledCourses[0];
  const mainCourse = mainEnrollment?.course || courses[0];

  if (isLoading || loadingProfile) return <div className="p-10 text-center">Loading Dashboard...</div>;

  return (
    <MainLayout>
      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-[1200px] mx-auto">
          {/* Welcome */}
          <section className="mb-10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Welcome back, {user?.name || "Learner"}! 👋</h1>
                <p className="mt-2 text-muted-foreground text-lg">You've completed {user?.stats?.coursesCompleted || 0} courses. Keep the momentum going!</p>
              </div>
              <div className="bg-card p-4 rounded-xl shadow-sm border border-border w-fit">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent rounded-lg">
                    <Flame className="size-5 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Day Streak</p>
                    <p className="text-xl font-bold">12 Days</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-10">
              {/* Continue Learning */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <CirclePlay className="size-5 text-primary" />
                    Continue Learning
                  </h2>
                  <Link to={"/my-learning"}>
                    <span className="text-primary text-sm font-semibold hover:underline cursor-pointer">My Courses</span>
                  </Link>
                </div>
                {mainCourse && (
                  <Link to={`/course/${mainCourse.id || mainCourse._id}`} className="group relative overflow-hidden bg-card rounded-2xl shadow-md border border-border transition-all hover:shadow-xl block">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 aspect-video md:aspect-auto h-auto relative overflow-hidden">
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                          style={{ backgroundImage: `url(${mainCourse.image})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent flex items-end p-4">
                          <span className="px-2 py-1 bg-primary-foreground/20 backdrop-blur-md rounded text-primary-foreground text-[10px] font-bold uppercase tracking-widest">
                            {mainEnrollment ? "In Progress" : "Available"}
                          </span>
                        </div>
                      </div>
                      <div className="p-6 md:w-2/3 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{mainCourse.title}</h3>
                            <span className="text-xs font-medium bg-secondary px-2.5 py-1 rounded-full whitespace-nowrap">
                              {mainEnrollment ? `${mainEnrollment.progress}% Complete` : "Start Now"}
                            </span>
                          </div>
                          <p className="text-muted-foreground text-sm mb-4">Next up: Mastering {mainCourse.category} Fundamentals</p>
                          <div className="space-y-2 mb-6">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">Course Progress</span>
                              <span className="text-primary font-bold">{mainEnrollment?.progress || 0}%</span>
                            </div>
                            <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${mainEnrollment?.progress || 0}%` }} />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="size-3" /> Last viewed Recently
                          </div>
                          <Link
                            to={`/learning/${mainCourse.id || mainCourse._id}`}
                            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
                          >
                            <Play className="size-4 fill-current" />
                            {mainEnrollment ? "Resume Lesson" : "Start Course"}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Link>
                )}
              </section>

              {/* Enrolled Courses */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Bookmark className="size-5 text-primary" /> Enrolled Courses
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {enrolledCourses.map((enrollment, idx) => {
                    // Try to get populated course, or find it in global courses if only ID is present
                    let c = enrollment.course;
                    if (typeof c === 'string') {
                      c = courses.find(course => (course._id || course.id) === enrollment.course) || { title: 'Unknown Course', image: '' };
                    }

                    if (!c) return null;

                    return (
                      <Link to={`/learning/${c.id || c._id || enrollment.course}`} key={idx} className="bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all block">
                        <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url(${c.image})` }} />
                        <div className="p-4">
                          <h4 className="font-bold text-sm mb-1 line-clamp-1">{c.title}</h4>
                          <p className="text-xs text-muted-foreground mb-3">Progress: {enrollment.progress}%</p>
                          <div className="h-1.5 w-full bg-secondary rounded-full">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${enrollment.progress}%` }} />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                  {enrolledCourses.length === 0 && (
                    <div className="col-span-2 text-center py-10 bg-secondary/20 rounded-xl border border-dashed border-border">
                      <p className="text-muted-foreground">Not enrolled in any courses yet.</p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Upcoming */}
              <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
                <h3 className="font-bold mb-6">Upcoming</h3>
                <div className="space-y-5">
                  {[
                    { month: "Oct", day: "24", title: "Live Q&A Session", desc: "Web Dev Mastery • 2:00 PM" },
                    { month: "Oct", day: "26", title: "Project Deadline", desc: "UI/UX Basics • Midnight" },
                  ].map((e) => (
                    <div key={e.day} className="flex gap-4">
                      <div className="flex flex-col items-center justify-center size-12 bg-secondary rounded-lg">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">{e.month}</span>
                        <span className="text-lg font-bold">{e.day}</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold">{e.title}</p>
                        <p className="text-xs text-muted-foreground">{e.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
                <h3 className="font-bold mb-4">Your Achievements</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col items-center gap-1 group">
                    <div className="size-14 bg-warning/20 rounded-full flex items-center justify-center text-warning group-hover:scale-110 transition-transform">
                      <Trophy className="size-6" />
                    </div>
                    <span className="text-[10px] text-center font-medium">Fast Learner</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 group">
                    <div className="size-14 bg-accent rounded-full flex items-center justify-center text-accent-foreground group-hover:scale-110 transition-transform">
                      <BadgeCheck className="size-6" />
                    </div>
                    <span className="text-[10px] text-center font-medium">Certified</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 group">
                    <div className="size-14 bg-secondary rounded-full flex items-center justify-center text-muted-foreground">
                      <Lock className="size-6" />
                    </div>
                    <span className="text-[10px] text-center font-medium text-muted-foreground">Locked</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </MainLayout>
  );
}
