import React, { useState } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { Check, X, Eye, FileText, Video, ChevronDown, ChevronUp } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { getPendingCourses, approveCourse, rejectCourse } from "@/api/courseApi";

export default function CourseApprovals() {
    const [selectedCourse, setSelectedCourse] = React.useState(null);
    const [isReviewOpen, setIsReviewOpen] = React.useState(false);
    const [pendingCourses, setPendingCourses] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [feedback, setFeedback] = React.useState("");

    React.useEffect(() => {
        fetchPendingCourses();
    }, []);

    const fetchPendingCourses = async () => {
        try {
            setLoading(true);
            const data = await getPendingCourses();
            setPendingCourses(data);
        } catch (error) {
            console.error('Error fetching pending courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (courseId) => {
        if (window.confirm("Approve this course for publication?")) {
            try {
                await approveCourse(courseId);
                alert("Course approved successfully!");
                // Refresh list
                fetchPendingCourses();
                setIsReviewOpen(false);
            } catch (error) {
                console.error('Error approving course:', error);
                alert(error.response?.data?.message || 'Failed to approve course');
            }
        }
    };

    const handleReject = async (courseId) => {
        if (!feedback.trim()) {
            alert("Please provide feedback for rejection");
            return;
        }
        if (window.confirm("Reject this course submission?")) {
            try {
                await rejectCourse(courseId, feedback);
                alert("Course rejected");
                setFeedback("");
                // Refresh list
                fetchPendingCourses();
                setIsReviewOpen(false);
            } catch (error) {
                console.error('Error rejecting course:', error);
                alert(error.response?.data?.message || 'Failed to reject course');
            }
        }
    };

    const handleOpenReview = (course) => {
        setSelectedCourse(course);
        setFeedback("");
        setIsReviewOpen(true);
    };

    return (
        <AdminLayout>
            <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Course Approvals</h1>
                    <p className="text-muted-foreground">Review and approve new course submissions.</p>
                </div>

                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-secondary/50 text-muted-foreground font-medium border-b border-border">
                            <tr>
                                <th className="px-6 py-4">Course Title</th>
                                <th className="px-6 py-4">Instructor</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Submitted</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {pendingCourses.map((course) => (
                                <tr key={course.id} className="hover:bg-secondary/20 transition-colors">
                                    <td className="px-6 py-4 font-bold">{course.title}</td>
                                    <td className="px-6 py-4">{course.instructor}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-secondary px-2 py-1 rounded text-xs font-medium">{course.category}</span>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">{course.submitted}</td>
                                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleOpenReview(course)}
                                            className="flex items-center gap-1 px-3 py-1.5 border border-border rounded-lg hover:bg-secondary transition-colors text-xs font-medium"
                                        >
                                            <Eye className="size-3" /> Review
                                        </button>
                                        <button
                                            onClick={() => handleApprove(course._id)}
                                            className="p-1.5 bg-green-500/10 text-green-600 rounded-lg hover:bg-green-500/20 transition-colors"
                                        >
                                            <Check className="size-4" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedCourse(course);
                                                setFeedback("");
                                                // Open dialog for rejection with feedback
                                                setIsReviewOpen(true);
                                            }}
                                            className="p-1.5 bg-red-500/10 text-red-600 rounded-lg hover:bg-red-500/20 transition-colors"
                                        >
                                            <X className="size-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {pendingCourses.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-muted-foreground">
                                        No pending approvals.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Review Dialog */}
                <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Review Course Submission</DialogTitle>
                            <DialogDescription>Review course details and content before approving.</DialogDescription>
                        </DialogHeader>

                        {selectedCourse && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                                <div className="md:col-span-2 space-y-6">
                                    <div className="aspect-video bg-secondary rounded-xl overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${selectedCourse.thumbnail})` }} />
                                    <div>
                                        <h2 className="text-2xl font-bold mb-2">{selectedCourse.title}</h2>
                                        <p className="text-muted-foreground">{selectedCourse.description}</p>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="font-bold border-b border-border pb-2">Curriculum Preview</h3>
                                        {[1, 2, 3].map((s) => (
                                            <div key={s} className="border border-border rounded-lg p-4">
                                                <div className="flex items-center justify-between font-bold text-sm mb-2">
                                                    <span>Section {s}: Introduction</span>
                                                    <span className="text-muted-foreground font-normal">3 Lessons</span>
                                                </div>
                                                <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Video className="size-3 text-blue-500" /> Welcome Video
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <FileText className="size-3 text-orange-500" /> Course Resources
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-secondary/30 p-4 rounded-xl border border-border">
                                        <h3 className="font-bold text-sm mb-4">Instructor Details</h3>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="size-10 bg-primary/20 rounded-full flex items-center justify-center font-bold text-primary">AT</div>
                                            <div>
                                                <p className="font-bold text-sm">{selectedCourse.instructor}</p>
                                                <p className="text-xs text-muted-foreground">Verified Instructor</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2 text-sm text-muted-foreground">
                                            <p>Joined: 2 months ago</p>
                                            <p>Total Courses: 5</p>
                                            <p>Reputation: High</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-sm font-bold">Admin Feedback</label>
                                        <textarea
                                            value={feedback}
                                            onChange={(e) => setFeedback(e.target.value)}
                                            className="w-full h-32 p-3 text-sm bg-background border border-border rounded-lg outline-none focus:border-primary"
                                            placeholder="Enter specific feedback for the instructor if requesting changes or rejecting..."
                                        />
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => handleReject(selectedCourse._id)}
                                                className="w-full py-2 bg-destructive/10 text-destructive font-bold rounded-lg hover:bg-destructive/20 text-sm"
                                            >
                                                Reject
                                            </button>
                                            <button className="w-full py-2 border border-border font-bold rounded-lg hover:bg-secondary text-sm">
                                                Request Changes
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => handleApprove(selectedCourse._id)}
                                            className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow-lg shadow-green-600/20"
                                        >
                                            Approve Course
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
