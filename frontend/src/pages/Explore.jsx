import { useState } from "react";
import { MainLayout } from "@/components/MainLayout";
import CourseCard from "@/components/CourseCard";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
// import { courses } from "@/data/courses";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { getPublishedCourses } from "@/api/courseApi";
const categories = ["All Courses", "Development", "Business", "Design"];
const difficulties = ["Beginner", "Intermediate", "Advanced"];
const tabs = ["Trending", "Newest", "Popular"];

export default function Explore() {
  const [activeTab, setActiveTab] = useState("Trending");
  const [selectedCategories, setSelectedCategories] = useState(["All Courses"]);

  const { data: courses = [], isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      return await getPublishedCourses();
    }
  });

  if (isLoading) return <div className="p-10 text-center">Loading courses...</div>;
  if (error) return <div className="p-10 text-center text-red-500">Error loading courses</div>;

  return (
    <MainLayout>
      <section className="p-8 lg:p-10 flex-1">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <nav className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
              <span className="hover:text-primary transition-colors cursor-pointer">EduDiscover</span>
              <ChevronRight className="size-3" />
              <span className="text-foreground">Explore Courses</span>
            </nav>
            <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Explore Courses</h1>
            <p className="text-muted-foreground">
              Join over <span className="text-primary font-bold">120,000+</span> students learning from world-class experts.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold bg-card p-1.5 rounded-xl border border-border shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-lg transition-colors ${activeTab === tab
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "hover:bg-secondary text-muted-foreground"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-16 flex items-center justify-center gap-4">
          <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-muted-foreground hover:text-primary hover:bg-card rounded-xl transition-all border border-transparent hover:border-border disabled:opacity-30" disabled>
            <ChevronLeft className="size-4" /> Previous
          </button>
          <div className="flex items-center gap-2">
            <button className="size-10 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/20">1</button>
            {[2, 3].map((n) => (
              <button key={n} className="size-10 rounded-xl hover:bg-card border border-transparent hover:border-border text-sm font-bold text-muted-foreground transition-all">
                {n}
              </button>
            ))}
            <span className="px-2 text-muted-foreground">...</span>
            <button className="size-10 rounded-xl hover:bg-card border border-transparent hover:border-border text-sm font-bold text-muted-foreground transition-all">12</button>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-muted-foreground hover:text-primary hover:bg-card rounded-xl transition-all border border-transparent hover:border-border">
            Next <ChevronRight className="size-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="md:ml-0 bg-card border-t border-border py-6 px-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-medium text-muted-foreground">© 2024 EduDiscover Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors" href="#">Privacy Policy</a>
            <a className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors" href="#">Terms of Service</a>
            <a className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors" href="#">Help Center</a>
          </div>
        </div>
      </footer>
    </MainLayout>
  );
}
