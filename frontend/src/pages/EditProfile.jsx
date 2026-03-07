import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/MainLayout";
import { ChevronRight, ArrowLeft, Camera, User, Mail, MapPin, Briefcase, Info, Plus, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserProfile, updateProfile } from "@/api/userApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EditProfile() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data: user, isLoading } = useQuery({
        queryKey: ['profile'],
        queryFn: getUserProfile
    });

    const [formData, setFormData] = useState({
        name: "",
        title: "",
        location: "",
        about: "",
        interests: []
    });
    const [newInterest, setNewInterest] = useState("");

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                title: user.title || "",
                location: user.location || "",
                about: user.about || "",
                interests: user.interests || []
            });
        }
    }, [user]);

    const updateMutation = useMutation({
        mutationFn: updateProfile,
        onSuccess: () => {
            queryClient.invalidateQueries(['profile']);
            navigate('/profile');
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddInterest = (e) => {
        e.preventDefault();
        const trimmed = newInterest.trim();
        if (trimmed && !formData.interests.includes(trimmed)) {
            setFormData(prev => ({
                ...prev,
                interests: [...prev.interests, trimmed]
            }));
            setNewInterest("");
        }
    };

    const handleRemoveInterest = (tag) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.filter(t => t !== tag)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateMutation.mutate(formData);
    };

    if (isLoading) return <div className="p-10 text-center">Loading Profile...</div>;

    return (
        <MainLayout>
            <div className="flex-1 p-8 lg:p-12 overflow-y-auto max-w-4xl mx-auto w-full">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-secondary rounded-lg transition-colors">
                        <ArrowLeft className="size-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Edit Profile</h1>
                        <p className="text-muted-foreground text-sm">Update your personal information and profile settings.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                    {/* Photo Section */}
                    <section className="bg-card border border-border rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8">
                        <div className="relative group">
                            <div className="size-32 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground overflow-hidden border-2 border-dashed border-border group-hover:border-primary transition-colors">
                                <User className="size-12 opacity-20" />
                            </div>
                            <button type="button" className="absolute -bottom-3 -right-3 size-10 bg-primary text-primary-foreground rounded-full border-4 border-card flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                                <Camera className="size-4" />
                            </button>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="font-bold mb-1">Profile Photo</h3>
                            <p className="text-xs text-muted-foreground mb-4">Recommended size: 400x400px. JPG, PNG or GIF.</p>
                            <div className="flex justify-center md:justify-start gap-3">
                                <Button type="button" variant="secondary" size="sm">Change Photo</Button>
                                <Button type="button" variant="ghost" size="sm" className="text-destructive">Remove</Button>
                            </div>
                        </div>
                    </section>

                    {/* Basic Info */}
                    <section className="space-y-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <span className="size-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary text-sm font-bold">01</span>
                            Basic Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                                <Input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    className="h-12 bg-secondary/50 border-none focus-visible:ring-primary"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Professional Title</label>
                                <Input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Full-stack Developer"
                                    className="h-12 bg-secondary/50 border-none focus-visible:ring-primary"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                    <Input
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="e.g. London, UK"
                                        className="h-12 pl-10 bg-secondary/50 border-none focus-visible:ring-primary"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Bio Section */}
                    <section className="space-y-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <span className="size-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary text-sm font-bold">02</span>
                            About You
                        </h2>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Short Bio</label>
                            <textarea
                                name="about"
                                value={formData.about}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Tell us about yourself, your goals and your passion..."
                                className="w-full p-4 rounded-xl bg-secondary/50 border-none focus:ring-2 focus:ring-primary outline-none text-sm transition-all resize-none"
                            />
                        </div>
                    </section>

                    {/* Interests Section */}
                    <section className="space-y-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <span className="size-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary text-sm font-bold">03</span>
                            Learning Interests
                        </h2>
                        <div className="p-6 bg-card border border-border rounded-2xl">
                            <div className="flex flex-wrap gap-2 mb-6">
                                {formData.interests.map((tag) => (
                                    <span key={tag} className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full border border-primary/20">
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveInterest(tag)}
                                            className="p-0.5 hover:bg-primary/20 rounded-full transition-colors"
                                        >
                                            <X className="size-3" />
                                        </button>
                                    </span>
                                ))}
                                {formData.interests.length === 0 && (
                                    <p className="text-xs text-muted-foreground italic">No interests added yet.</p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    value={newInterest}
                                    onChange={(e) => setNewInterest(e.target.value)}
                                    placeholder="Add a skill or interest (e.g. React, UX Design)"
                                    className="bg-secondary/50 border-none h-11"
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddInterest(e)}
                                />
                                <Button type="button" variant="outline" className="h-11" onClick={handleAddInterest}>
                                    <Plus className="size-4 mr-2" /> Add
                                </Button>
                            </div>
                        </div>
                    </section>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-4 pt-6 border-t border-border">
                        <Button type="button" variant="ghost" onClick={() => navigate('/profile')}>Cancel</Button>
                        <Button
                            type="submit"
                            disabled={updateMutation.isPending}
                            className="px-10 h-12 font-bold shadow-lg shadow-primary/20"
                        >
                            {updateMutation.isPending ? "Saving..." : "Save Profile"}
                        </Button>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
}
