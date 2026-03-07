import { useState } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/MainLayout";
import { ChevronRight, Search, Play, Activity, Sparkles, BookOpen, CircleHelp, Video, Star, MessageSquare, Trophy } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserProfile, submitFeedback } from "@/api/userApi";
import { getPublishedCourses } from "@/api/courseApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const tabs = ["In Progress", "Completed", "Wishlist"];

export default function MyLearning() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("In Progress");
  const [search, setSearch] = useState("");
  const [selectedCourseForFeedback, setSelectedCourseForFeedback] = useState(null);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState("");

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const { data: user, isLoading: loadingProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: getUserProfile,
    enabled: !!userInfo.token
  });

  const { data: allCourses = [] } = useQuery({
    queryKey: ['courses'],
    queryFn: getPublishedCourses
  });

  const feedbackMutation = useMutation({
    mutationFn: submitFeedback,
    onSuccess: () => {
      queryClient.invalidateQueries(['profile']);
      setSelectedCourseForFeedback(null);
      setFeedbackRating(0);
      setFeedbackComment("");
    }
  });

  const handleFeedbackSubmit = () => {
    if (selectedCourseForFeedback && feedbackRating > 0) {
      feedbackMutation.mutate({
        courseId: selectedCourseForFeedback._id,
        rating: feedbackRating,
        comment: feedbackComment
      });
    }
  };

  const enrolledCourses = [...(user?.enrolledCourses || [])].sort((a, b) =>
    new Date(b.lastAccessed || 0) - new Date(a.lastAccessed || 0)
  );

  if (loadingProfile) return <div className="p-10 text-center">Loading your courses...</div>;

  return (
    <MainLayout>
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="p-8 bg-card border-b border-border">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">My Learning</h1>
              <p className="text-muted-foreground mt-1">Pick up where you left off or explore something new.</p>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search my courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-secondary focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-8 mt-8 border-b border-border">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-2 text-sm font-medium transition-colors ${activeTab === tab
                  ? "text-primary border-b-2 border-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </header>

        {/* Content */}
        <div className="p-8 flex flex-col xl:flex-row gap-8">
          {/* Course List */}
          <div className="flex-1 space-y-6">
            {(() => {
              const processed = enrolledCourses
                .map(e => {
                  if (typeof e.course === 'string') {
                    const populatedCourse = allCourses.find(c => (c._id || c.id) === e.course);
                    return populatedCourse ? { ...e, course: populatedCourse } : e;
                  }
                  return e;
                })
                .filter(e => e.course && typeof e.course !== 'string')
                .filter(e => activeTab === "Completed" ? e.progress === 100 : e.progress < 100)
                .filter((e) => (e.course.title || "").toLowerCase().includes(search.toLowerCase()));

              return processed.map((enrollment) => {
                const course = enrollment.course;
                return (
                  <div
                    key={course._id}
                    className="bg-card rounded-xl p-4 shadow-sm border border-border flex flex-col md:flex-row gap-6 items-center group hover:shadow-md transition-shadow"
                  >
                    <div className="relative w-full md:w-48 h-32 rounded-lg overflow-hidden shrink-0">
                      <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-foreground/20 group-hover:bg-transparent transition-all" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1 gap-2">
                        <h3 className="font-bold text-lg truncate">{course.title}</h3>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded shrink-0">
                          {course.category}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {course.subtitle}
                      </p>
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md">
                          <BookOpen className="size-3" />
                          <span>{enrollment.completedLessons.length} / {course.modules.flatMap(m => m.lessons).length} Lessons</span>
                        </div>
                        <div className="flex-1 min-w-[120px]">
                          <div className="flex justify-between text-[10px] font-bold mb-1 uppercase tracking-tighter">
                            <span>Progress</span>
                            <span className="text-primary">{enrollment.progress}%</span>
                          </div>
                          <div className="h-1 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${enrollment.progress}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0 w-full md:w-auto flex flex-col gap-2">
                      <Link
                        to={`/learn/${course._id}`}
                        className="w-full md:w-auto px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                      >
                        <Play className="size-4" />
                        {enrollment.isCompleted ? "Review" : "Continue"}
                      </Link>
                      {enrollment.progress === 100 && (
                        <Link
                          to={`/learn/${course._id}/achievements`}
                          className="w-full md:w-auto px-6 py-2 bg-success/10 text-success rounded-lg font-bold hover:bg-success/20 transition-colors flex items-center justify-center gap-2 text-xs"
                        >
                          <Trophy className="size-3" /> Download Certificate
                        </Link>
                      )}
                      {enrollment.progress === 100 && !enrollment.rating && (
                        <button
                          onClick={() => setSelectedCourseForFeedback(course)}
                          className="w-full md:w-auto px-6 py-2 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2 text-xs"
                        >
                          <MessageSquare className="size-3" /> Leave Review
                        </button>
                      )}
                    </div>
                  </div>
                );
              });
            })()}
            {enrolledCourses.filter(e => activeTab === "Completed" ? e.progress === 100 : e.progress < 100).length === 0 && (
              <div className="text-center py-20 bg-card rounded-xl border border-dashed border-border">
                <BookOpen className="size-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                <p className="text-muted-foreground">No courses found in "{activeTab}"</p>
                {activeTab === "In Progress" && (
                  <Link to="/explore" className="text-primary font-bold hover:underline mt-2 inline-block">Explore Courses</Link>
                )}
              </div>
            )}
          </div>

          {/* Feedback Dialog */}
          <Dialog open={!!selectedCourseForFeedback} onOpenChange={(open) => !open && setSelectedCourseForFeedback(null)}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Course Feedback</DialogTitle>
                <DialogDescription>
                  How was your experience with "{selectedCourseForFeedback?.title}"? Your feedback helps us improve.
                </DialogDescription>
              </DialogHeader>
              <div className="py-6 space-y-6">
                <div className="flex flex-col items-center gap-3">
                  <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Overall Rating</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setFeedbackRating(star)}
                        className="transition-transform active:scale-95"
                      >
                        <Star className={`size-8 ${star <= feedbackRating ? "fill-yellow-400 text-yellow-400" : "text-border"}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Your Thoughts</label>
                  <textarea
                    className="w-full p-4 rounded-xl bg-secondary focus:ring-2 focus:ring-primary outline-none transition-all resize-none text-sm min-h-[100px]"
                    placeholder="What did you like or dislike? How can we make it better?"
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setSelectedCourseForFeedback(null)}>Cancel</Button>
                <Button
                  onClick={handleFeedbackSubmit}
                  disabled={feedbackRating === 0 || feedbackMutation.isPending}
                  className="px-8 font-bold"
                >
                  {feedbackMutation.isPending ? "Submitting..." : "Submit Review"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Right Sidebar */}
          <aside className="w-full xl:w-80 space-y-8">
            {/* Weekly Goal */}
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Activity className="size-5 text-primary" />
                Weekly Goal
              </h4>
              <div className="relative flex flex-col items-center">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="stroke-secondary fill-none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      strokeWidth="3"
                    />
                    <path
                      className="stroke-primary fill-none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      strokeDasharray="80, 100"
                      strokeLinecap="round"
                      strokeWidth="3"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold">4.2</span>
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Hours</span>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <p className="text-sm font-medium text-muted-foreground">80% of your weekly goal met!</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">Goal: 5 hours • 0.8h remaining</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </MainLayout>
  );
}
