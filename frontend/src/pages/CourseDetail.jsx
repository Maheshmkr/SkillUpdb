import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MainLayout } from "@/components/MainLayout";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
// import { courses } from "@/data/courses";
import {
  Star, Users, Clock, ChevronRight, ChevronDown, ChevronUp,
  CirclePlay, FileText, CircleCheck, Monitor, Download, Infinity,
  Smartphone, Award, Share2, Bookmark, Play
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
  const [module2Open, setModule2Open] = useState(true);

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
                style={{ backgroundImage: `url(${course.image})` }}
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

            {/* What you'll learn */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">What you'll learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-card p-8 rounded-2xl border border-border shadow-sm">
                {learningPoints.map((point, i) => (
                  <div key={i} className="flex gap-3">
                    <CircleCheck className="size-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{point}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Course Content */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Course Content</h2>
              <div className="space-y-3">
                <div className="border border-border rounded-xl overflow-hidden">
                  <div className="bg-secondary/50 p-4 flex justify-between items-center cursor-pointer">
                    <div className="flex items-center gap-3">
                      <ChevronDown className="size-5 text-muted-foreground" />
                      <span className="font-bold">Module 1: Foundations of Product Thinking</span>
                    </div>
                    <span className="text-sm text-muted-foreground">4 lectures • 45m</span>
                  </div>
                </div>
                <div className="border border-border rounded-xl overflow-hidden">
                  <div
                    onClick={() => setModule2Open(!module2Open)}
                    className="bg-secondary/50 p-4 flex justify-between items-center cursor-pointer border-b border-border"
                  >
                    <div className="flex items-center gap-3">
                      {module2Open ? <ChevronUp className="size-5 text-primary" /> : <ChevronDown className="size-5 text-muted-foreground" />}
                      <span className="font-bold">Module 2: Advanced Interaction Systems</span>
                    </div>
                    <span className="text-sm text-muted-foreground">8 lectures • 2h 15m</span>
                  </div>
                  {module2Open && (
                    <div>
                      <div className="flex items-center justify-between p-4 hover:bg-secondary/30">
                        <div className="flex items-center gap-3">
                          <CirclePlay className="size-5 text-muted-foreground" />
                          <span className="text-sm">Complex State Management in UI</span>
                        </div>
                        <span className="text-xs text-muted-foreground">12:40</span>
                      </div>
                      <div className="flex items-center justify-between p-4 hover:bg-secondary/30">
                        <div className="flex items-center gap-3">
                          <FileText className="size-5 text-muted-foreground" />
                          <span className="text-sm">Case Study: Enterprise Dashboard Architecture</span>
                        </div>
                        <span className="text-xs text-muted-foreground">PDF Guide</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <button className="mt-4 text-primary font-bold text-sm hover:underline">Show all 12 modules</button>
            </section>

            {/* About Instructor */}
            <section className="pb-20">
              <h2 className="text-2xl font-bold mb-6">About the Instructor</h2>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="shrink-0">
                  <div className="w-32 h-32 rounded-2xl overflow-hidden bg-secondary flex items-center justify-center text-primary font-bold text-3xl">
                    MT
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-primary mb-1">{course.instructor}</h3>
                  <p className="text-muted-foreground mb-4 font-medium uppercase tracking-wider text-xs">
                    Expert Instructor in {course.category}
                  </p>
                  <div className="flex gap-4 mb-4 text-sm font-bold">
                    <div className="flex items-center gap-1">
                      <Star className="size-4 text-warning fill-warning" />
                      <span>{course.rating} Instructor Rating</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="size-4 text-primary" />
                      <span>156,000+ Students</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Marcus is a design veteran with over 15 years of experience leading UI/UX teams at Fortune 500 companies. He focuses on bridging the gap between aesthetic beauty and functional business requirements.
                  </p>
                  <button className="px-6 py-2 border border-border rounded-xl text-sm font-bold hover:bg-secondary transition-colors">
                    View Profile
                  </button>
                </div>
              </div>
            </section>
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
                        to={`/learning/${id}`}
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
                      {[
                        { icon: Monitor, text: `${course.hours} hours on-demand video` },
                        { icon: FileText, text: "12 downloadable resources" },
                        { icon: Infinity, text: "Full lifetime access" },
                        { icon: Smartphone, text: "Access on mobile and TV" },
                        { icon: Award, text: "Certificate of completion" },
                      ].map(({ icon: Icon, text }) => (
                        <li key={text} className="flex items-center gap-3 text-sm text-muted-foreground">
                          <Icon className="size-5 text-primary" />
                          <span>{text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="border-t border-border pt-6">
                    <h4 className="font-bold text-sm mb-4">Skills you'll gain</h4>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
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
