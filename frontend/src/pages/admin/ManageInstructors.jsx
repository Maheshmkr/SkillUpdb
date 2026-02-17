import { AdminLayout } from "@/layouts/AdminLayout";
import { Search, ShieldCheck, CircleX, Ellipsis, CircleCheck } from "lucide-react";

export default function ManageInstructors() {
    const instructors = [
        { id: 1, name: "Dr. Alan Turing", specialty: "Data Science", courses: 5, status: "Verified", earnings: "$12,400" },
        { id: 2, name: "Sarah Connors", specialty: "Design", courses: 2, status: "Pending Verification", earnings: "$0" },
        { id: 3, name: "John Doe", specialty: "Web Development", courses: 14, status: "Verified", earnings: "$45,200" },
    ];

    return (
        <AdminLayout>
            <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Manage Instructors</h1>
                    <p className="text-muted-foreground">Verify and manage instructor accounts.</p>
                </div>

                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                    {/* Toolbar */}
                    <div className="p-4 border-b border-border flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search instructors..."
                                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    </div>

                    <table className="w-full text-sm text-left">
                        <thead className="bg-secondary/50 text-muted-foreground font-medium border-b border-border">
                            <tr>
                                <th className="px-6 py-4">Instructor</th>
                                <th className="px-6 py-4">Specialty</th>
                                <th className="px-6 py-4">Courses</th>
                                <th className="px-6 py-4">Total Earnings</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {instructors.map((instructor) => (
                                <tr key={instructor.id} className="hover:bg-secondary/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold text-xs">
                                                {instructor.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-foreground">{instructor.name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">{instructor.specialty}</td>
                                    <td className="px-6 py-4 font-medium">{instructor.courses}</td>
                                    <td className="px-6 py-4 text-muted-foreground">{instructor.earnings}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${instructor.status === 'Verified' ? 'bg-green-500/10 text-green-500' :
                                            'bg-yellow-500/10 text-yellow-500'
                                            }`}>
                                            {instructor.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                                        {instructor.status === 'Pending Verification' && (
                                            <button className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-xs font-bold shadow-lg shadow-primary/20">
                                                <CircleCheck className="size-3" /> Verify
                                            </button>
                                        )}
                                        <button className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                                            <Ellipsis className="size-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
