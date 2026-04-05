import React from 'react';
import { InstructorLayout } from "@/layouts/InstructorLayout";
import { Search, Filter, EllipsisVertical, Pencil, FileText, Eye, Upload, Trash, Users } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInstructorCourses, deleteCourse } from "@/api/courseApi";

export default function MyCourses() {
    const [courses, setCourses] = React.useState([]);
    const [filterStatus, setFilterStatus] = React.useState('All Statuses');
    const [searchQuery, setSearchQuery] = React.useState('');
    const [loading, setLoading] = React.useState(true);
    const navigate = useNavigate();
    const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    React.useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const data = await getInstructorCourses();
                setCourses(data);
            } catch (error) {
                console.error('Error fetching courses:', error);
                // Fallback to empty array on error
                setCourses([]);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this course?")) {
            try {
                await deleteCourse(id);
                setCourses(courses.filter(c => c._id !== id));
            } catch (error) {
                console.error('Error deleting course:', error);
                alert(error.response?.data?.message || 'Failed to delete course');
            }
        }
    };

    const handleView = (course) => {
        navigate(`/instructor/courses/preview?mode=before`, { state: { courseData: course } });
    };

    const handleEdit = (id) => {
        navigate(`/instructor/courses/${id}/edit`);
    };

    const filteredCourses = courses.filter(course => {
        const matchesStatus = filterStatus === 'All Statuses' || course.status === filterStatus;
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });
    console.log('Filtered Courses:', filteredCourses);
    const getStatusColor = (status) => {
        switch (status) {
            case "Published": return "bg-green-500/10 text-green-500 border-green-200/20";
            case "Pending Review": return "bg-yellow-500/10 text-yellow-500 border-yellow-200/20";
            case "Draft": return "bg-gray-500/10 text-gray-500 border-gray-200/20";
            default: return "bg-gray-500/10 text-gray-500";
        }
    };

    return (
        <InstructorLayout>
            <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
                        <p className="text-muted-foreground">Manage your content and track performance.</p>
                    </div>
                    <Link to="/instructor/courses/new" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                        Create New Course
                    </Link>
                </div>

                {/* Filters and Search */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border border-border shadow-sm">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search your courses..."
                            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm font-medium hover:bg-secondary transition-colors">
                            <Filter className="size-4" /> Filter
                        </button>
                        <select
                            className="px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option>All Statuses</option>
                            <option>Published</option>
                            <option>Draft</option>
                            <option>Pending Review</option>
                        </select>
                    </div>
                </div>

                {/* Course Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.length === 0 && (
                        <div className="col-span-full text-center py-12 text-muted-foreground">
                            No courses found matching your criteria.
                        </div>
                    )}
                    {filteredCourses.map((course) => (
                        <div key={course._id} className="bg-card rounded-xl border border-border shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                            <div className="aspect-video bg-cover bg-center relative" style={{ backgroundImage: `url(${VITE_BACKEND_URL}${course.thumbnail || course.image || '/assets/course-placeholder.jpg'})` }}>
                                <div className="absolute top-3 left-3">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(course.status)} backdrop-blur-md`}>
                                        {course.status}
                                    </span>
                                </div>
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => handleView(course)}
                                        className="p-2 bg-background/90 rounded-full hover:bg-background transition-colors text-foreground"
                                        title="View Course"
                                    >
                                        <Eye className="size-4" />
                                    </button>
                                    <button
                                        onClick={() => handleEdit(course._id)}
                                        className="p-2 bg-background/90 rounded-full hover:bg-background transition-colors text-foreground"
                                        title="Edit Course"
                                    >
                                        <Pencil className="size-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg line-clamp-1">{course.title}</h3>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="focus:outline-none">
                                            <EllipsisVertical className="size-5 text-muted-foreground hover:text-foreground" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem className="gap-2 cursor-pointer" asChild>
                                                <Link to={`/instructor/courses/${course._id}/edit`}>
                                                    <Pencil className="size-4" /> Edit Course
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="gap-2 cursor-pointer">
                                                <FileText className="size-4" /> Curriculum
                                            </DropdownMenuItem>
                                            {course.status === 'Draft' && (
                                                <DropdownMenuItem className="gap-2 cursor-pointer text-blue-500">
                                                    <Upload className="size-4" /> Submit for Review
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive" onClick={() => handleDelete(course._id)}>
                                                <Trash className="size-4" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <div className="flex items-center justify-between text-sm text-muted-foreground my-4">
                                    <span>{course.price}</span>
                                    <span className="flex items-center gap-1">
                                        <Users className="size-3" /> {course.students} Students
                                    </span>
                                </div>

                                <div className="pt-4 border-t border-border flex items-center justify-between">
                                    <Link to={`/instructor/courses/${course._id}/edit`} className="text-sm font-medium text-primary hover:underline">
                                        Edit Details
                                    </Link>
                                    <button onClick={() => handleDelete(course._id)} className="text-sm font-medium text-destructive hover:underline">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </InstructorLayout>
    );
}
