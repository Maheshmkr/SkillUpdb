import courseUiux from "@/assets/course-uiux.jpg";
import courseReact from "@/assets/course-react.jpg";
import courseMarketing from "@/assets/course-marketing.jpg";
import courseDatascience from "@/assets/course-datascience.jpg";
import courseBusiness from "@/assets/course-business.jpg";
import courseCopywriting from "@/assets/course-copywriting.jpg";
import courseBranding from "@/assets/course-branding.jpg";
import courseSecurity from "@/assets/course-security.jpg";

export interface Course {
  id: string;
  title: string;
  instructor: string;
  category: string;
  hours: number;
  rating: number;
  reviews: number;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
  badgeColor?: string;
}

export const courses: Course[] = [
  {
    id: "1",
    title: "Mastering UI/UX: Design Modern Interfaces",
    instructor: "Sarah Jenkins",
    category: "Design",
    hours: 12.5,
    rating: 4.9,
    reviews: 12430,
    price: 84.99,
    image: courseUiux,
    badge: "Bestseller",
    badgeColor: "bg-primary",
  },
  {
    id: "2",
    title: "Advanced React Patterns & Performance",
    instructor: "Michael Rivera",
    category: "Development",
    hours: 24,
    rating: 4.7,
    reviews: 8211,
    price: 94.99,
    image: courseReact,
    badge: "Intermediate",
    badgeColor: "bg-foreground",
  },
  {
    id: "3",
    title: "Digital Marketing Strategy 2024",
    instructor: "Alex Chen",
    category: "Marketing",
    hours: 8.5,
    rating: 4.5,
    reviews: 5102,
    price: 49.99,
    image: courseMarketing,
  },
  {
    id: "4",
    title: "Introduction to Data Science",
    instructor: "Dr. Emily Watson",
    category: "Data Science",
    hours: 15,
    rating: 5.0,
    reviews: 450,
    price: 79.99,
    image: courseDatascience,
    badge: "New",
    badgeColor: "bg-success",
  },
  {
    id: "5",
    title: "Agile Project Management",
    instructor: "Marcus Thorne",
    category: "Business",
    hours: 10,
    rating: 4.2,
    reviews: 2341,
    price: 64.99,
    image: courseBusiness,
  },
  {
    id: "6",
    title: "Modern Copywriting for Web",
    instructor: "Liam O'Connor",
    category: "Content",
    hours: 6,
    rating: 4.8,
    reviews: 3410,
    price: 39.99,
    image: courseCopywriting,
    badge: "Popular",
    badgeColor: "bg-primary",
  },
  {
    id: "7",
    title: "Brand Identity Foundations",
    instructor: "Sophia Rodriguez",
    category: "Branding",
    hours: 18,
    rating: 4.6,
    reviews: 1894,
    price: 124.99,
    image: courseBranding,
  },
  {
    id: "8",
    title: "Cybersecurity Fundamentals",
    instructor: "Jack Peterson",
    category: "Security",
    hours: 20,
    rating: 4.1,
    reviews: 4212,
    price: 89.99,
    image: courseSecurity,
  },
];
