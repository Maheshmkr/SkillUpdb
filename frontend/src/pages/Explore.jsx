import { useState } from "react";
import { MainLayout } from "@/components/MainLayout";
import CourseCard from "@/components/CourseCard";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { getPublishedCourses } from "@/api/courseApi";
import { getUserProfile } from "@/api/userApi";

const tabs = ["Trending", "Newest", "Popular"];
const COURSES_PER_PAGE = 8;

export default function Explore() {
  const [activeTab, setActiveTab] = useState("Trending");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: courses = [], isLoading: loadingCourses } = useQuery({
    queryKey: ['courses'],
    queryFn: getPublishedCourses
  });

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const { data: user, isLoading: loadingProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: getUserProfile,
    enabled: !!userInfo.token
  });

  if (loadingCourses || loadingProfile) return <div className="p-10 text-center">Loading courses...</div>;

  const enrolledCourseIds = user?.enrolledCourses?.map(e => (e.course._id || e.course)) || [];

  // Filter courses that are not enrolled
  const filteredCourses = courses.filter(course =>
    !enrolledCourseIds.includes(course._id) && !enrolledCourseIds.includes(course.id)
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredCourses.length / COURSES_PER_PAGE);
  const indexOfLastCourse = currentPage * COURSES_PER_PAGE;
  const indexOfFirstCourse = indexOfLastCourse - COURSES_PER_PAGE;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  return (
    <MainLayout>
      <section className="p-8 lg:p-10 flex-1">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <nav className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
              <span className="hover:text-primary transition-colors cursor-pointer">SkillUp</span>
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

        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
            {currentCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-secondary/20 rounded-2xl border border-dashed border-border">
            <p className="text-muted-foreground">You've enrolled in everything we have for now! Check back later.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-16 flex items-center justify-center gap-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-muted-foreground hover:text-primary hover:bg-card rounded-xl transition-all border border-transparent hover:border-border disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="size-4" /> Previous
            </button>
            <div className="flex items-center gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`size-10 rounded-xl text-sm font-bold transition-all ${currentPage === i + 1
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "hover:bg-card border border-transparent hover:border-border text-muted-foreground"}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-muted-foreground hover:text-primary hover:bg-card rounded-xl transition-all border border-transparent hover:border-border disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next <ChevronRight className="size-4" />
            </button>
          </div>
        )}
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
