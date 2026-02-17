import { AdminLayout } from "@/layouts/AdminLayout";
import { Search, Filter, Ellipsis, Shield, Ban, CircleCheck } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ManageUsers() {
    const users = [
        { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Student", status: "Active", joined: "Jan 12, 2024" },
        { id: 2, name: "Dr. Alan Turing", email: "alan@example.com", role: "Instructor", status: "Active", joined: "Dec 05, 2023" },
        { id: 3, name: "Bad Actor", email: "scammer@example.com", role: "Student", status: "Suspended", joined: "Feb 10, 2024" },
        { id: 4, name: "Sarah Connors", email: "sarah@example.com", role: "Instructor", status: "Pending Verification", joined: "Yesterday" },
    ];

    return (
        <AdminLayout>
            <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Manage Users</h1>
                    <p className="text-muted-foreground">View and manage all platform users and their roles.</p>
                </div>

                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                    {/* Toolbar */}
                    <div className="p-4 border-b border-border flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search by name, email, or ID..."
                                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                            <select className="px-3 py-2 border border-border rounded-lg text-sm bg-background outline-none">
                                <option>All Roles</option>
                                <option>Student</option>
                                <option>Instructor</option>
                                <option>Admin</option>
                            </select>
                            <select className="px-3 py-2 border border-border rounded-lg text-sm bg-background outline-none">
                                <option>All Statuses</option>
                                <option>Active</option>
                                <option>Suspended</option>
                                <option>Pending</option>
                            </select>
                        </div>
                    </div>

                    <table className="w-full text-sm text-left">
                        <thead className="bg-secondary/50 text-muted-foreground font-medium border-b border-border">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Joined</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-secondary/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-foreground">{user.name}</p>
                                                <p className="text-xs text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5">
                                            {user.role === 'Instructor' && <Shield className="size-3 text-blue-500" />}
                                            <span className={user.role === 'Instructor' ? "font-medium text-blue-500" : ""}>{user.role}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${user.status === 'Active' ? 'bg-green-500/10 text-green-500' :
                                            user.status === 'Suspended' ? 'bg-red-500/10 text-red-500' :
                                                'bg-yellow-500/10 text-yellow-500'
                                            }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">{user.joined}</td>
                                    <td className="px-6 py-4 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className="focus:outline-none">
                                                <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                                                    <Ellipsis className="size-4 text-muted-foreground" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>View Profile</DropdownMenuItem>
                                                <DropdownMenuItem>Reset Password</DropdownMenuItem>
                                                {user.status !== 'Suspended' ? (
                                                    <DropdownMenuItem className="text-destructive focus:text-destructive gap-2">
                                                        <Ban className="size-4" /> Suspend User
                                                    </DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem className="text-green-500 focus:text-green-500 gap-2">
                                                        <CircleCheck className="size-4" /> Reactivate User
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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
