import { AdminLayout } from "@/layouts/AdminLayout";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";
import { Download, Calendar } from "lucide-react";

export default function Reports() {
    const growthData = [
        { name: 'Jan', users: 400, revenue: 2400 },
        { name: 'Feb', users: 300, revenue: 1398 },
        { name: 'Mar', users: 200, revenue: 9800 },
        { name: 'Apr', users: 278, revenue: 3908 },
        { name: 'May', users: 189, revenue: 4800 },
        { name: 'Jun', users: 239, revenue: 3800 },
        { name: 'Jul', users: 349, revenue: 4300 },
    ];

    const categoryData = [
        { name: 'Web Dev', value: 400 },
        { name: 'Data Science', value: 300 },
        { name: 'Design', value: 300 },
        { name: 'Marketing', value: 200 },
    ];

    const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];

    return (
        <AdminLayout>
            <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Platform Reports</h1>
                        <p className="text-muted-foreground">Analytics and growth metrics.</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-secondary">
                            <Calendar className="size-4" /> Last 6 Months
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 shadow-lg shadow-primary/20">
                            <Download className="size-4" /> Export Report
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* User Growth Chart */}
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                        <h3 className="font-bold text-lg mb-6">User Growth & Revenue</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={growthData}>
                                    <defs>
                                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
                                    <Area type="monotone" dataKey="users" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={2} />
                                    <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Course Categories */}
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                        <h3 className="font-bold text-lg mb-6">Course Categories Distribution</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
