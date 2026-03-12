import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MainLayout } from "@/components/MainLayout";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
// import { courses } from "@/data/courses";
import {
  Star, Users, Clock, ChevronRight, ChevronDown, ChevronUp,
  CirclePlay, FileText, CircleCheck, Monitor, Download, Infinity,
  Smartphone, Award, Share2, Bookmark, Play, MessageSquare
} from "lucide-react";
import courseVideoBg from "@/assets/course-video-bg.jpg";
import { getCourseById } from "@/api/courseApi";

const tabs = ["Overview", "Syllabus", "Reviews", "Instructor"];

const learningPoints = [
  "Design complex user interfaces from scratch using industry-standard tools.",
  "Understand the cognitive psychology behind high-conversion UX design.",
  "Build interactive, high-fidelity prototypes that mirror production apps.",
  "Learn advanced layout systems and responsive design frameworks.",
  "Master accessibility (a11y) standards for enterprise-grade applications.",
  "Collaborate with developers using professional handoff workflows.",
];

const skills = ["UI Design", "User Experience", "Prototyping", "Figma", "Product Strategy"];

export default function CourseDetail() {
  const { id } = useParams();

  const { data: course, isLoading, error } = useQuery({
    queryKey: ['course', id],
    queryFn: async () => {
      return await getCourseById(id);
    }
  });

  const { data: user } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      try {
        const { data } = await axios.get('/api/users/profile');
        return data;
      } catch (err) {
        return null;
      }
    },
    retry: false
  });

  const isEnrolled = user?.enrolledCourses?.some(e => {
    const cid = e.course._id || e.course.id || e.course; // Handle populated object or ID string
    return cid.toString() === course?._id?.toString();
  });

  const [activeTab, setActiveTab] = useState("Overview");
  const [expandedModules, setExpandedModules] = useState({ 0: true });

  if (isLoading) return <div className="p-10 text-center">Loading course details...</div>;
  if (error) return <div className="p-10 text-center text-red-500">Error loading course</div>;
  if (!course) return <div className="p-10 text-center">Course not found</div>;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-6 text-sm font-medium text-muted-foreground gap-2 items-center">
          <Link to="/explore" className="hover:text-primary">{course.category}</Link>
          <ChevronRight className="size-3" />
          <span className="text-foreground">{course.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Content */}
          <div className="lg:col-span-8">
            <div className="mb-8">
              <h1 className="text-4xl font-extrabold mb-4 leading-tight">
                {course.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
                {course.description || "Master the art of creating sophisticated digital products. Learn design psychology, advanced prototyping, and modern workflow integration."}
              </p>
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-warning font-bold">{course.rating}</span>
                  <div className="flex text-warning">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`size-4 ${i < Math.floor(course.rating) ? "fill-current" : ""}`} />
                    ))}
                  </div>
                  <span className="text-muted-foreground underline cursor-pointer ml-1">({course.reviews?.toLocaleString()} ratings)</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="size-4" />
                  <span>45,210 students enrolled</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="size-4" />
                  <span>{course.hours} total hours</span>
                </div>
              </div>
            </div>

            {/* Video Preview */}
            <div className="relative group aspect-video rounded-2xl overflow-hidden bg-foreground shadow-2xl mb-12 border border-border">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:scale-105 transition-transform duration-700"
                style={{ backgroundImage: `url(${course.thumbnail})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
              <button className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-primary/90 text-primary-foreground rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-xl shadow-primary/30">
                  <Play className="size-10 fill-current" />
                </div>
              </button>
              <div className="absolute bottom-6 left-8 right-8">
                <p className="text-primary-foreground font-bold text-xl mb-1">Preview this course</p>
                <p className="text-primary-foreground/80 text-sm">2:45 minutes of introductory content • Module 1</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-border mb-8 overflow-x-auto">
              <div className="flex gap-8 min-w-max">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 font-medium text-base transition-colors ${activeTab === tab
                      ? "text-primary border-b-2 border-primary font-bold"
                      : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              {activeTab === "Overview" && (
                <section className="mb-12 animate-in fade-in duration-500">
                  <h2 className="text-2xl font-bold mb-6">What you'll learn</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-card p-8 rounded-2xl border border-border shadow-sm">
                    {(course.whatYouWillLearn || learningPoints).map((point, i) => (
                      <div key={i} className="flex gap-3">
                        <CircleCheck className="size-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{point}</span>
                      </div>
                    ))}
                  </div>

                  {course.description && (
                    <div className="mt-10 prose prose-slate max-w-none">
                      <h2 className="text-2xl font-bold mb-4 text-foreground">Description</h2>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {course.description}
                      </p>
                    </div>
                  )}
                </section>
              )}

              {activeTab === "Syllabus" && (
                <section className="mb-12 animate-in fade-in duration-500">
                  <h2 className="text-2xl font-bold mb-6">Course Content</h2>
                  <div className="space-y-3">
                    {(course.modules || []).map((module, idx) => (
                      <div key={module._id || idx} className="border border-border rounded-xl overflow-hidden">
                        <div
                          onClick={() => setExpandedModules(prev => ({ ...prev, [idx]: !prev[idx] }))}
                          className="bg-secondary/50 p-4 flex justify-between items-center cursor-pointer border-b border-border"
                        >
                          <div className="flex items-center gap-3">
                            {expandedModules[idx] ? <ChevronUp className="size-5 text-primary" /> : <ChevronDown className="size-5 text-muted-foreground" />}
                            <span className="font-bold">{module.title}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{module.lessons?.length || 0} lectures</span>
                        </div>
                        {expandedModules[idx] && (
                          <div className="divide-y divide-border/10">
                            {(module.lessons || []).map((lesson, lidx) => (
                              <div key={lesson._id || lidx} className="flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors">
                                <div className="flex items-center gap-3">
                                  {lesson.type === 'video' ? <CirclePlay className="size-5 text-primary/60" /> :
                                    lesson.type === 'quiz' ? <CircleCheck className="size-5 text-success/60" /> :
                                      <FileText className="size-5 text-muted-foreground" />}
                                  <span className="text-sm">{lesson.title}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">{lesson.duration || (lesson.type === 'quiz' ? 'Quiz' : 'Reading')}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {activeTab === "Reviews" && (
                <section className="mb-12 animate-in fade-in duration-500">
                  <h2 className="text-2xl font-bold mb-6 text-foreground">Student Feedback</h2>
                  <div className="flex flex-col md:flex-row gap-8 mb-10">
                    <div className="flex flex-col items-center justify-center p-8 bg-card border border-border rounded-2xl w-full md:w-48">
                      <span className="text-5xl font-black text-primary mb-2">{course.rating}</span>
                      <div className="flex text-warning mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} className={i < Math.floor(course.rating) ? "fill-current" : ""} />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Course Rating</span>
                    </div>
                    <div className="flex-1 space-y-3 justify-center flex flex-col">
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const count = course.reviewList?.filter(r => Math.floor(r.rating) === rating).length || 0;
                        const percentage = course.reviewList?.length > 0 ? (count / course.reviewList.length) * 100 : 0;
                        return (
                          <div key={rating} className="flex items-center gap-4">
                            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                              <div className="bg-warning h-full" style={{ width: `${percentage}%` }} />
                            </div>
                            <div className="flex items-center gap-1 min-w-[60px]">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={10} className={i < rating ? "text-warning fill-current" : "text-muted-foreground"} />
                              ))}
                            </div>
                            <span className="text-xs font-bold text-muted-foreground w-8">{Math.round(percentage)}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-6">
                    {course.reviewList && course.reviewList.length > 0 ? (
                      course.reviewList.map((review, idx) => (
                        <div key={idx} className="p-6 bg-card border border-border rounded-2xl shadow-sm">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="size-12 rounded-full bg-accent flex items-center justify-center font-bold text-accent-foreground border border-border">
                              {review.avatar ? <img src={review.avatar} alt="" className="w-full h-full rounded-full object-cover" /> : (review.name?.substring(0, 2).toUpperCase() || "ST")}
                            </div>
                            <div>
                              <p className="font-bold">{review.name}</p>
                              <div className="flex items-center gap-2">
                                <div className="flex text-warning">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={12} className={i < review.rating ? "fill-current" : ""} />
                                  ))}
                                </div>
                                <span className="text-xs text-muted-foreground font-medium">
                                  {new Date(review.date).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-muted-foreground leading-relaxed italic">"{review.comment}"</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 bg-secondary/20 rounded-2xl border border-dashed border-border px-6">
                        <MessageSquare className="size-10 text-muted-foreground mx-auto mb-4 opacity-20" />
                        <p className="text-muted-foreground font-medium">No reviews yet for this course. Be the first to share your experience!</p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {activeTab === "Instructor" && (
                <section className="pb-20 animate-in fade-in duration-500">
                  <h2 className="text-2xl font-bold mb-6">About the Instructor</h2>
                  <div className="flex flex-col md:flex-row gap-8 bg-card border border-border p-8 rounded-2xl shadow-sm">
                    <div className="shrink-0 flex flex-col items-center">
                      <div className="w-32 h-32 rounded-2xl overflow-hidden bg-secondary flex items-center justify-center text-primary font-bold text-3xl mb-4 border-2 border-primary/10 shadow-inner">
                        {(course.instructor?.name || course.instructor)?.split(' ').map(n => n[0]).join('').toUpperCase() || "SI"}
                      </div>
                      <div className="space-y-2 w-full">
                        <div className="flex items-center gap-2 text-sm font-bold bg-secondary/50 px-3 py-2 rounded-lg justify-center">
                          <Star size={14} className="text-warning fill-current" />
                          <span>{course.rating} Rating</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-bold bg-secondary/50 px-3 py-2 rounded-lg justify-center">
                          <Users size={14} className="text-primary" />
                          <span>45k+ Students</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-primary mb-1">{course.instructor?.name || course.instructor}</h3>
                      <p className="text-muted-foreground mb-6 font-bold uppercase tracking-widest text-xs opacity-70">
                        Expert Instructor in {course.category}
                      </p>
                      <p className="text-muted-foreground leading-relaxed mb-6 text-lg italic">
                        "I believe that anyone can learn complex technical skills if they are explained with passion and clarity. My goal is to empower the next generation of digital creators through high-quality, practical education."
                      </p>
                      <button className="px-8 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-black hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                        View Instructor Profile
                      </button>
                    </div>
                  </div>
                </section>
              )}
            </div>
          </div>

          {/* Right Sidebar - Pricing */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-24">
              <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6">
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-4xl font-black">${course.price}</span>
                    {course.originalPrice && (
                      <span className="text-muted-foreground line-through text-lg">${course.originalPrice}</span>
                    )}
                    {course.originalPrice && (
                      <span className="text-success font-bold text-sm ml-auto">
                        {Math.round((1 - course.price / course.originalPrice) * 100)}% Off
                      </span>
                    )}
                  </div>
                  <div className="space-y-3 mb-6">
                    {isEnrolled ? (
                      <Link
                        to={`/learn/${id}`}
                        className="w-full py-4 bg-success text-white font-extrabold text-lg rounded-xl hover:bg-success/90 transition-all shadow-lg shadow-success/20 block text-center"
                      >
                        Go to Course
                      </Link>
                    ) : (
                      <Link
                        to="/enrollment-success"
                        state={{ courseTitle: course.title, courseId: course._id }}
                        className="w-full py-4 bg-primary text-primary-foreground font-extrabold text-lg rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 block text-center"
                      >
                        Enroll Now
                      </Link>
                    )}
                    <button className="w-full py-4 bg-secondary text-foreground font-bold text-base rounded-xl hover:bg-secondary/80 transition-all">
                      Add to Cart
                    </button>
                  </div>
                  <p className="text-center text-xs text-muted-foreground mb-8">30-Day Money-Back Guarantee</p>
                  <div className="space-y-4 mb-8">
                    <h4 className="font-bold text-sm uppercase tracking-widest">This course includes:</h4>
                    <ul className="space-y-3">
                      {(course.includes && course.includes.length > 0) ? (
                        course.includes.map((text, i) => {
                          let Icon = Monitor;
                          if (text.toLowerCase().includes('download')) Icon = Download;
                          if (text.toLowerCase().includes('lifetime')) Icon = Infinity;
                          if (text.toLowerCase().includes('mobile')) Icon = Smartphone;
                          if (text.toLowerCase().includes('certificate')) Icon = Award;
                          if (text.toLowerCase().includes('article')) Icon = FileText;

                          return (
                            <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                              <Icon className="size-5 text-primary" />
                              <span>{text}</span>
                            </li>
                          );
                        })
                      ) : (
                        [
                          { icon: Monitor, text: `${course.hours || course.duration || '0'} hours on-demand video` },
                          { icon: FileText, text: "Downloadable resources" },
                          { icon: Infinity, text: "Full lifetime access" },
                          { icon: Smartphone, text: "Access on mobile and TV" },
                          { icon: Award, text: "Certificate of completion" },
                        ].map(({ icon: Icon, text }) => (
                          <li key={text} className="flex items-center gap-3 text-sm text-muted-foreground">
                            <Icon className="size-5 text-primary" />
                            <span>{text}</span>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                  <div className="border-t border-border pt-6">
                    <h4 className="font-bold text-sm mb-4">Skills you'll gain</h4>
                    <div className="flex flex-wrap gap-2">
                      {(course.skills || skills).map((skill) => (
                        <span key={skill} className="px-3 py-1 bg-secondary rounded-full text-xs font-semibold text-muted-foreground">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-between px-2">
                <button className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary">
                  <Share2 className="size-4" /> Share
                </button>
                <button className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary">
                  <Bookmark className="size-4" /> Save to list
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border gap-4">
            <p className="text-xs text-muted-foreground">© 2024 EduDiscover, Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </MainLayout>
  );
}
