import { Star, Heart } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * @param {{ course: import("@/data/courses").Course }} props
 */
export function CourseCard({ course }) {
  return (
    <Link
      to={`/course/${course._id}`}
      className="course-card group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-border flex flex-col"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          src={course.image}
          alt={course.title}
        />
        {course.badge && (
          <div className={`absolute top-4 left-4 ${course.badgeColor} text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-lg`}>
            {course.badge}
          </div>
        )}
        <button className="absolute top-4 right-4 size-8 bg-foreground/20 backdrop-blur-md rounded-full flex items-center justify-center text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity">
          <Heart className="size-4" />
        </button>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-bold text-accent-foreground bg-accent px-2 py-0.5 rounded uppercase">
            {course.category}
          </span>
          <span className="text-[10px] font-bold text-muted-foreground">{course.hours} hrs</span>
        </div>
        <h3 className="font-bold text-lg leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {course.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4">{course.instructor}</p>
        <div className="flex items-center gap-1.5 mb-6 mt-auto">
          <div className="flex items-center text-primary">
            <Star className="size-4 fill-primary" />
            <span className="text-sm font-bold ml-1">{course.rating}</span>
          </div>
          <span className="text-[10px] text-muted-foreground">({course.reviews.toLocaleString()})</span>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <span className="text-xl font-bold">${course.price}</span>
          <span className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/20">
            Enroll Now
          </span>
        </div>
      </div>
    </Link>
  );
}
