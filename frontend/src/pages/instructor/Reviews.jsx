import { InstructorLayout } from "@/layouts/InstructorLayout";
import { Star, MessageSquare } from "lucide-react";

export default function InstructorReviews() {
    const reviews = [
        { id: 1, student: "Alice Johnson", course: "Advanced React Patterns", rating: 5, date: "2 days ago", comment: "This course is amazing! I learned so much about advanced patterns that I can apply immediately." },
        { id: 2, student: "Bob Smith", course: "Node.js Masterclass", rating: 4, date: "1 week ago", comment: "Great content, but could use more examples on async/await error handling." },
        { id: 3, student: "Charlie Brown", course: "Advanced React Patterns", rating: 5, date: "2 weeks ago", comment: "Best React course I've taken so far. Highly recommended!" },
    ];

    return (
        <InstructorLayout>
            <div className="p-6 md:p-10 space-y-8 max-w-5xl mx-auto">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Student Reviews</h1>
                    <p className="text-muted-foreground">See what your students are saying about your courses.</p>
                </div>

                <div className="grid gap-6">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-card p-6 rounded-xl border border-border shadow-sm">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-secondary flex items-center justify-center font-bold text-muted-foreground">
                                        {review.student.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">{review.student}</p>
                                        <p className="text-xs text-muted-foreground">on <span className="font-medium text-foreground">{review.course}</span></p>
                                    </div>
                                </div>
                                <span className="text-xs text-muted-foreground">{review.date}</span>
                            </div>
                            <div className="flex items-center gap-1 mb-3 text-yellow-500">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`size-4 ${i < review.rating ? "fill-current" : "text-border fill-transparent"}`} />
                                ))}
                            </div>
                            <p className="text-sm leading-relaxed">{review.comment}</p>
                            <div className="mt-4 pt-4 border-t border-border flex gap-4">
                                <button className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
                                    <MessageSquare className="size-3" /> Reply to Review
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </InstructorLayout>
    );
}
