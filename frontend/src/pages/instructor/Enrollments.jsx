import { InstructorLayout } from "@/layouts/InstructorLayout";
import { Search, Download, Mail } from "lucide-react";

export default function Enrollments() {
    const students = [
        { id: 1, name: "Alice Johnson", email: "alice@example.com", course: "Advanced React Patterns", progress: 85, lastActive: "2 hours ago", status: "Active" },
        { id: 2, name: "Bob Smith", email: "bob@example.com", course: "Node.js Masterclass", progress: 32, lastActive: "1 day ago", status: "Active" },
        { id: 3, name: "Charlie Brown", email: "charlie@example.com", course: "UI/UX Design Fundamentals", progress: 12, lastActive: "5 days ago", status: "Inactive" },
        { id: 4, name: "Diana Prince", email: "diana@example.com", course: "Advanced React Patterns", progress: 100, lastActive: "1 week ago", status: "Completed" },
        { id: 5, name: "Evan Wright", email: "evan@example.com", course: "Node.js Masterclass", progress: 0, lastActive: "Never", status: "Active" },
    ];

    return (
        <InstructorLayout>
            <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Student Enrollments</h1>
                        <p className="text-muted-foreground">Track student progress and engagement.</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg font-medium hover:bg-secondary transition-colors">
                        <Download className="size-4" /> Export CSV
                    </button>
                </div>

                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                    {/* Toolbar */}
                    <div className="p-4 border-b border-border flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search students..."
                                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <select className="px-3 py-2 border border-border rounded-lg text-sm bg-background outline-none w-full md:w-auto">
                            <option>All Courses</option>
                            <option>Advanced React Patterns</option>
                            <option>Node.js Masterclass</option>
                        </select>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-secondary/50 text-muted-foreground font-medium border-b border-border">
                                <tr>
                                    <th className="px-6 py-4">Student Name</th>
                                    <th className="px-6 py-4">Course</th>
                                    <th className="px-6 py-4">Progress</th>
                                    <th className="px-6 py-4">Last Active</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {students.map((student) => (
                                    <tr key={student.id} className="hover:bg-secondary/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-foreground">{student.name}</p>
                                                    <p className="text-xs text-muted-foreground">{student.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium">{student.course}</td>
                                        <td className="px-6 py-4 max-w-[150px]">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                                    <div className="h-full bg-primary rounded-full" style={{ width: `${student.progress}%` }} />
                                                </div>
                                                <span className="text-xs font-bold w-8">{student.progress}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">{student.lastActive}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${student.status === 'Completed' ? 'bg-green-500/10 text-green-500' :
                                                    student.status === 'Inactive' ? 'bg-red-500/10 text-red-500' :
                                                        'bg-blue-500/10 text-blue-500'
                                                }`}>
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors" title="Message Student">
                                                <Mail className="size-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="p-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
                        <p>Showing 1-5 of 128 students</p>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 border border-border rounded hover:bg-secondary disabled:opacity-50" disabled>Previous</button>
                            <button className="px-3 py-1 border border-border rounded hover:bg-secondary">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </InstructorLayout>
    );
}
