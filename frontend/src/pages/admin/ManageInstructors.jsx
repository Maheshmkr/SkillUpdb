import { useState } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import {
    Search, ShieldCheck, CircleX, Ellipsis, CircleCheck,
    Plus, Trash2, Mail, Lock, User, MapPin, Briefcase
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getInstructors, createInstructor, deleteInstructor } from "@/api/adminApi";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ManageInstructors() {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        title: "",
        about: "",
        location: ""
    });

    const { data: instructors = [], isLoading } = useQuery({
        queryKey: ['admin', 'instructors'],
        queryFn: getInstructors
    });

    const createMutation = useMutation({
        mutationFn: createInstructor,
        onSuccess: () => {
            queryClient.invalidateQueries(['admin', 'instructors']);
            setIsCreateOpen(false);
            setFormData({ name: "", email: "", password: "", title: "", about: "", location: "" });
        },
        onError: (error) => {
            alert(error.response?.data?.message || "Failed to create instructor account");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteInstructor,
        onSuccess: () => {
            queryClient.invalidateQueries(['admin', 'instructors']);
        },
        onError: (error) => {
            alert(error.response?.data?.message || "Failed to remove instructor");
        }
    });

    const handleCreate = (e) => {
        e.preventDefault();
        createMutation.mutate(formData);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to remove this instructor?")) {
            deleteMutation.mutate(id);
        }
    };

    const filteredInstructors = instructors.filter(ins =>
        ins.name.toLowerCase().includes(search.toLowerCase()) ||
        ins.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Manage Instructors</h1>
                        <p className="text-muted-foreground">Verification and management of platform instructors.</p>
                    </div>

                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="font-bold gap-2">
                                <Plus className="size-4" /> Add New Instructor
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold">New Instructor Account</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreate} className="space-y-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Full Name</label>
                                        <Input
                                            placeholder="Alan Turing"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Professional Title</label>
                                        <Input
                                            placeholder="Senior Data Scientist"
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email Address</label>
                                    <Input
                                        type="email"
                                        placeholder="alan@skillup.com"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Temporary Password</label>
                                    <Input
                                        type="password"
                                        placeholder="Min. 8 characters"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Location</label>
                                        <Input
                                            placeholder="Cambridge, UK"
                                            value={formData.location}
                                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Bio/About</label>
                                        <Input
                                            placeholder="Expert in AI & Cryptography"
                                            value={formData.about}
                                            onChange={e => setFormData({ ...formData, about: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full font-bold h-12 mt-4"
                                    disabled={createMutation.isPending}
                                >
                                    {createMutation.isPending ? "Creating Account..." : "Create Instructor Account"}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                    {/* Toolbar */}
                    <div className="p-4 border-b border-border flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-secondary/50 text-muted-foreground font-medium border-b border-border">
                                <tr>
                                    <th className="px-6 py-4">Instructor</th>
                                    <th className="px-6 py-4">Title / Specialty</th>
                                    <th className="px-6 py-4">Location</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {isLoading ? (
                                    <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">Loading instructors...</td></tr>
                                ) : filteredInstructors.length === 0 ? (
                                    <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No instructors found.</td></tr>
                                ) : filteredInstructors.map((instructor) => (
                                    <tr key={instructor._id} className="hover:bg-secondary/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                                    {instructor.name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-foreground">{instructor.name}</p>
                                                    <p className="text-xs text-muted-foreground">{instructor.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground font-medium">{instructor.title || "Instructor"}</td>
                                        <td className="px-6 py-4 text-muted-foreground">{instructor.location || "Not specified"}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(instructor._id)}
                                                className="p-2 hover:bg-destructive/10 rounded-lg text-muted-foreground hover:text-destructive transition-colors"
                                                title="Delete Instructor"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
