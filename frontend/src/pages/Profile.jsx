import { useState } from "react";
import { MainLayout } from "@/components/MainLayout";
import { ChevronRight, MapPin, Linkedin, Globe, Pencil, CircleCheck, Clock, Brain, Flag, Download, Trophy } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import profileAvatar from "@/assets/profile-avatar.jpg";
import certUiux from "@/assets/cert-uiux.jpg";

const initialInterests = ["UI/UX Design", "Python", "Data Visualization", "React", "TypeScript", "Cloud Architecture"];

const heatMapData = [
  5, 20, 60, 10, 80, 40, 5, 10, 5, 40, 20, 90, 10, 5, 20, 60, 10, 80, 40, 5,
  5, 5, 40, 100, 20, 5, 40, 20, 90, 10, 5, 5, 5, 60, 10, 80, 40, 5, 10, 5,
  20, 60, 10, 80, 40, 5, 10, 5, 40, 20, 90, 10, 5, 20, 5, 60, 10, 80, 40, 5,
  5, 10, 5, 40, 20, 90, 10, 5, 20, 60, 10, 80, 40, 5, 10, 5, 5, 60, 10, 80,
];

export default function Profile() {
  const { data: courses = [] } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data } = await axios.get('/api/courses');
      return data;
    }
  });

  const { data: user, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      try {
        const { data } = await axios.get('/api/users/profile');
        return data;
      } catch (err) {
        return {
          name: "Alex Chen",
          location: "San Francisco, CA",
          title: "Full-stack Learner",
          about: "I'm a passionate designer and developer currently focusing on the intersection of AI and User Experience.",
          interests: initialInterests,
          stats: { coursesCompleted: 12, hoursLearned: 284, skillsMastered: 42 },
          certificates: []
        };
      }
    }
  });

  const [userInterests, setUserInterests] = useState(user?.interests || initialInterests);
  const [newInterest, setNewInterest] = useState("");

  if (isLoading) return <div className="p-10 text-center text-white bg-foreground min-h-screen">Loading Profile...</div>;

  const userStats = [
    { icon: CircleCheck, value: user?.stats?.coursesCompleted || 0, label: "Courses Completed" },
    { icon: Clock, value: user?.stats?.hoursLearned || 0, label: "Hours Learned" },
    { icon: Brain, value: user?.stats?.skillsMastered || 0, label: "Skills Mastered" },
  ];

  const userCertificates = user?.certificates || [];

  const handleAddInterest = () => {
    const trimmed = newInterest.trim();
    if (!trimmed) return;
    if (!userInterests.includes(trimmed)) {
      setUserInterests([...userInterests, trimmed]);
    }
    setNewInterest("");
  };

  return (
    <MainLayout>
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Center Column */}
        <div className="flex-1 p-8 lg:p-12 overflow-y-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6">
            <span className="hover:text-primary transition-colors cursor-pointer">EduDiscover</span>
            <ChevronRight className="size-3" />
            <span className="text-foreground">Profile</span>
          </nav>

          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 mb-10">
            <div className="relative">
              <img
                src={profileAvatar}
                alt={user.name}
                className="w-32 h-32 rounded-2xl object-cover border-4 border-card shadow-xl"
              />
              <span className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground p-1.5 rounded-full border-2 border-card">
                <CircleCheck className="size-3.5" />
              </span>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground mt-1">
                <MapPin className="size-3.5" />
                <span>{user.location || "San Francisco, CA"}</span>
                <span className="mx-1">•</span>
                <span>{user.title || "Full-stack Learner"}</span>
              </div>
              <div className="flex gap-3 mt-4 justify-center sm:justify-start">
                <a href="#" className="size-10 flex items-center justify-center rounded-lg bg-card border border-border text-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-sm">
                  <Linkedin className="size-5" />
                </a>
                <a href="#" className="size-10 flex items-center justify-center rounded-lg bg-card border border-border text-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-sm">
                  <Globe className="size-5" />
                </a>
                <button className="px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-all shadow-md flex items-center gap-2">
                  <Pencil className="size-4" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* About */}
          <section className="mb-10">
            <h2 className="text-lg font-semibold mb-3">About Me</h2>
            <p className="text-muted-foreground leading-relaxed max-w-3xl">
              {user.about || "I'm a passionate designer and developer currently focusing on the intersection of AI and User Experience."}
            </p>
          </section>

          {/* Interest Tags */}
          <section className="mb-12">
            <h2 className="text-lg font-semibold mb-4">Interest Tags</h2>
            <div className="flex flex-wrap gap-2">
              {(user.interests || userInterests).map((tag) => (
                <span key={tag} className="px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full">
                  {tag}
                </span>
              ))}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="px-3 py-1.5 border border-dashed border-primary/40 text-primary/60 text-sm font-medium rounded-full hover:border-primary hover:text-primary transition-all">
                    + Add Interest
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Interest</DialogTitle>
                    <DialogDescription>
                      Add a new interest tag to personalize your learning profile.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3">
                    <Input
                      placeholder="e.g. Web Development"
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                    />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button onClick={handleAddInterest}>Add Tag</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </section>

          {/* Stats Grid */}
          <div className="flex flex-col md:flex-row gap-6 mb-12">
            {userStats.map((item) => (
              <div key={item.label} className="flex-1 flex flex-col items-center gap-2 p-6 bg-card border border-border rounded-xl">
                <item.icon className="size-6 text-primary" />
                <span className="text-2xl font-bold">{item.value}</span>
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Certificates */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Certificates Earned</h2>
              <button className="text-primary text-sm font-semibold hover:underline">View All</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {userCertificates.length > 0 ? userCertificates.map((cert, idx) => (
                <div key={idx} className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-all">
                  <div className="relative aspect-video overflow-hidden">
                    <img src={cert.course.image} alt={cert.course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Download className="size-8 text-white" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm mb-1">{cert.course.title}</h3>
                    <p className="text-xs text-muted-foreground">{new Date(cert.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                  </div>
                </div>
              )) : (
                <div className="col-span-3 py-10 text-center bg-secondary/20 rounded-xl border border-dashed border-border">
                  <Trophy className="size-10 mx-auto mb-4 text-muted-foreground opacity-20" />
                  <p className="text-muted-foreground">No certificates earned yet. Complete a course to earn one!</p>
                </div>
              )}
            </div>
          </section>

          {/* Activity Map */}
          <section>
            <h2 className="text-xl font-bold mb-6">Learning Activity</h2>
            <div className="bg-card p-8 border border-border rounded-2xl overflow-x-auto">
              <div className="flex gap-1 min-w-[600px]">
                {heatMapData.map((val, i) => (
                  <div
                    key={i}
                    className="flex-1 aspect-square rounded-sm"
                    style={{
                      backgroundColor: `hsl(var(--primary) / ${val / 100})`,
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-4 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
                <span>Sep</span>
                <span>Oct</span>
                <span>Nov</span>
                <span>Dec</span>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column / Quick Stats */}
        <aside className="w-full lg:w-80 p-8 lg:p-12 border-t lg:border-t-0 lg:border-l border-border bg-card/50">
          <div className="sticky top-8 space-y-10">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">Current Progress</h3>
              <div className="space-y-6">
                {user.enrolledCourses?.slice(0, 3).map((enrollment, idx) => {
                  let c = enrollment.course;
                  if (typeof c === 'string') {
                    c = courses.find(course => (course._id || course.id) === enrollment.course) || { title: enrollment.course };
                  }
                  if (!c) return null;
                  return (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="truncate pr-4">{c.title}</span>
                        <span>{enrollment.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${enrollment.progress}%` }} />
                      </div>
                    </div>
                  );
                })}
                {(!user.enrolledCourses || user.enrolledCourses.length === 0) && (
                  <p className="text-xs text-muted-foreground">No active courses.</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">Skill Level</h3>
              <div className="space-y-4">
                {[
                  { label: "Design", level: 85 },
                  { label: "Frontend", level: 60 },
                  { label: "Strategy", level: 40 },
                ].map((skill) => (
                  <div key={skill.label} className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${skill.level}%` }} />
                    </div>
                    <span className="text-[10px] font-bold min-w-[40px]">{skill.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-primary/10 rounded-2xl border border-primary/20">
              <Flag className="size-6 text-primary mb-3" />
              <h4 className="font-bold text-sm mb-1">Weekly Goal</h4>
              <p className="text-xs text-muted-foreground mb-4">You're 82% towards your weekly learning goal!</p>
              <button className="w-full py-2 bg-primary text-primary-foreground text-xs font-bold rounded-lg hover:bg-primary/90 transition-all">
                Update Goal
              </button>
            </div>
          </div>
        </aside>
      </div>
    </MainLayout>
  );
}