import { InstructorLayout } from "@/layouts/InstructorLayout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

export default function CourseAnalytics() {
    const engagementData = [
        { name: 'Mon', hours: 24, completions: 4 },
        { name: 'Tue', hours: 13, completions: 2 },
        { name: 'Wed', hours: 45, completions: 8 },
        { name: 'Thu', hours: 32, completions: 5 },
        { name: 'Fri', hours: 28, completions: 6 },
        { name: 'Sat', hours: 15, completions: 3 },
        { name: 'Sun', hours: 10, completions: 1 },
    ];

    const lessonDropoff = [
        { lesson: 'Intro', students: 100 },
        { lesson: 'Setup', students: 95 },
        { lesson: 'Components', students: 85 },
        { lesson: 'Props', students: 70 },
        { lesson: 'State', students: 65 },
        { lesson: 'Effects', students: 40 },
    ];

    return (
        <InstructorLayout>
            <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Course Analytics</h1>
                        <p className="text-muted-foreground">Deep dive into course performance and student behavior.</p>
                    </div>
                    <select className="px-4 py-2 border border-border rounded-lg bg-background outline-none">
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                        <option>All Time</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Watch Time & Engagement */}
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                        <h3 className="font-bold text-lg mb-6">Total Watch Time (Hours)</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={engagementData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                        cursor={{ fill: 'hsl(var(--secondary))' }}
                                    />
                                    <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Lesson Drop-off */}
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                        <h3 className="font-bold text-lg mb-6">Student Retention (Lesson Drop-off)</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={lessonDropoff}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                    <XAxis dataKey="lesson" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                    />
                                    <Line type="monotone" dataKey="students" stroke="hsl(var(--destructive))" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Detailed Stats */}
                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-border">
                        <h3 className="font-bold text-lg">Top Performing Lessons</h3>
                    </div>
                    <table className="w-full text-sm text-left">
                        <thead className="bg-secondary/50 text-muted-foreground font-medium border-b border-border">
                            <tr>
                                <th className="px-6 py-4">Lesson Title</th>
                                <th className="px-6 py-4">Views</th>
                                <th className="px-6 py-4">Avg. Watch Time</th>
                                <th className="px-6 py-4">Completion Rate</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {[
                                { title: "Introduction to React", views: 1250, time: "4:30", rate: "98%" },
                                { title: "Understanding Props", views: 1100, time: "12:15", rate: "92%" },
                                { title: "State Management", views: 950, time: "15:45", rate: "85%" },
                            ].map((lesson, idx) => (
                                <tr key={idx} className="hover:bg-secondary/20 transition-colors">
                                    <td className="px-6 py-4 font-bold">{lesson.title}</td>
                                    <td className="px-6 py-4">{lesson.views}</td>
                                    <td className="px-6 py-4">{lesson.time}</td>
                                    <td className="px-6 py-4 text-green-500 font-medium">{lesson.rate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </InstructorLayout>
    );
}
