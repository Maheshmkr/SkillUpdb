import React from 'react';
import { InstructorLayout } from "@/layouts/InstructorLayout";
import { User, Mail, MapPin, Award, BookOpen, Users, Star, Calendar, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

export default function InstructorProfile() {
    const [profile, setProfile] = React.useState({
        name: "John Doe",
        email: "instructor@skillup.com",
        title: "Senior Software Engineer & Educator",
        location: "San Francisco, CA",
        about: "Passionate educator with 10+ years of experience in software development and teaching. Specialized in web development, cloud architecture, and modern JavaScript frameworks.",
        avatar: "",
        stats: {
            totalCourses: 0,
            totalStudents: 0,
            averageRating: 0,
            joinedDate: new Date().toISOString()
        }
    });

    const [isEditing, setIsEditing] = React.useState(false);

    React.useEffect(() => {
        // Load user info from localStorage
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        if (userInfo.name) {
            setProfile(prev => ({
                ...prev,
                name: userInfo.name,
                email: userInfo.email || prev.email,
            }));
        }
    }, []);

    const handleSave = () => {
        // TODO: Save to backend API
        setIsEditing(false);
        alert("Profile updated successfully!");
    };

    return (
        <InstructorLayout>
            <div className="p-6 md:p-10 space-y-8 max-w-5xl mx-auto">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
                    <p className="text-muted-foreground">Manage your instructor profile and settings</p>
                </div>

                {/* Profile Header */}
                <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="size-32 bg-primary/10 rounded-full flex items-center justify-center text-primary text-4xl font-bold">
                            {profile.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 space-y-4">
                            {isEditing ? (
                                <>
                                    <input
                                        type="text"
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        className="w-full text-2xl font-bold bg-background border border-border rounded-lg px-4 py-2"
                                    />
                                    <input
                                        type="text"
                                        value={profile.title}
                                        onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                                        className="w-full text-muted-foreground bg-background border border-border rounded-lg px-4 py-2"
                                    />
                                </>
                            ) : (
                                <>
                                    <h2 className="text-2xl font-bold">{profile.name}</h2>
                                    <p className="text-muted-foreground">{profile.title}</p>
                                </>
                            )}

                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Mail className="size-4" />
                                    {profile.email}
                                </div>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={profile.location}
                                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                        className="flex-1 bg-background border border-border rounded-lg px-3 py-1"
                                        placeholder="Location"
                                    />
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="size-4" />
                                        {profile.location}
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3">
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={handleSave}
                                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90"
                                        >
                                            Save Changes
                                        </button>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="px-4 py-2 border border-border rounded-lg font-medium hover:bg-secondary"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90"
                                        >
                                            Edit Profile
                                        </button>
                                        <Link
                                            to="/logout"
                                            className="px-4 py-2 border border-destructive text-destructive rounded-lg font-medium hover:bg-destructive/10 flex items-center gap-2"
                                        >
                                            <LogOut className="size-4" />
                                            Logout
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-card border border-border rounded-xl p-6 text-center">
                        <BookOpen className="size-8 mx-auto mb-2 text-blue-500" />
                        <div className="text-3xl font-bold">{profile.stats.totalCourses}</div>
                        <div className="text-sm text-muted-foreground">Total Courses</div>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-6 text-center">
                        <Users className="size-8 mx-auto mb-2 text-green-500" />
                        <div className="text-3xl font-bold">{profile.stats.totalStudents}</div>
                        <div className="text-sm text-muted-foreground">Total Students</div>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-6 text-center">
                        <Star className="size-8 mx-auto mb-2 text-yellow-500" />
                        <div className="text-3xl font-bold">{profile.stats.averageRating.toFixed(1)}</div>
                        <div className="text-sm text-muted-foreground">Avg Rating</div>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-6 text-center">
                        <Calendar className="size-8 mx-auto mb-2 text-purple-500" />
                        <div className="text-3xl font-bold">
                            {new Date(profile.stats.joinedDate).getFullYear()}
                        </div>
                        <div className="text-sm text-muted-foreground">Member Since</div>
                    </div>
                </div>

                {/* About Section */}
                <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
                    <h3 className="text-xl font-bold mb-4">About Me</h3>
                    {isEditing ? (
                        <textarea
                            value={profile.about}
                            onChange={(e) => setProfile({ ...profile, about: e.target.value })}
                            className="w-full h-32 bg-background border border-border rounded-lg px-4 py-3 resize-none"
                            placeholder="Tell students about yourself..."
                        />
                    ) : (
                        <p className="text-muted-foreground leading-relaxed">{profile.about}</p>
                    )}
                </div>
            </div>
        </InstructorLayout>
    );
}
