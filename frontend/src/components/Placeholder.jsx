import { Construction } from "lucide-react";

export default function Placeholder({ title }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
            <div className="size-24 bg-secondary rounded-full flex items-center justify-center mb-6">
                <Construction className="size-12 text-muted-foreground" />
            </div>
            <h2 className="text-3xl font-bold mb-2">{title || "Coming Soon"}</h2>
            <p className="text-muted-foreground max-w-md">
                This page is currently under development. Check back later for updates!
            </p>
        </div>
    );
}
