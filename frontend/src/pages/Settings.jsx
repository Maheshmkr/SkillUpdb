import { MainLayout } from "@/components/MainLayout";
import { Settings as SettingsIcon, User, Bell, Shield, CircleHelp } from "lucide-react";

const Settings = () => {
    const settingsSections = [
        { title: "Profile Info", icon: User, desc: "Manage your public profile and avatar" },
        { title: "Notifications", icon: Bell, desc: "Configure how you receive alerts and emails" },
        { title: "Security", icon: Shield, desc: "Update your password and 2FA settings" },
        { title: "Support", icon: CircleHelp, desc: "Get help with your account or billing" },
    ];

    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="flex items-center gap-4 mb-10">
                    <div className="size-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                        <SettingsIcon size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Account Settings</h1>
                        <p className="text-muted-foreground">Manage your account preferences and security.</p>
                    </div>
                </div>

                <div className="grid gap-6">
                    {settingsSections.map((section) => (
                        <div
                            key={section.title}
                            className="group bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
                        >
                            <div className="flex items-center gap-5">
                                <div className="size-12 bg-secondary rounded-xl flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                    <section.icon size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{section.title}</h3>
                                    <p className="text-sm text-muted-foreground">{section.desc}</p>
                                </div>
                            </div>
                            <div className="text-primary font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                Manage
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </MainLayout>
    );
};

export default Settings;
