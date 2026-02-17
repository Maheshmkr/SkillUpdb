import { InstructorSidebar } from "../components/InstructorSidebar";
import { TopHeader } from "../components/TopHeader";

export function InstructorLayout({ children }) {
    return (
        <div className="flex min-h-screen w-full">
            <InstructorSidebar />
            <main className="flex-1 md:ml-72 flex flex-col min-w-0">
                <TopHeader />
                <div className="flex-1">{children}</div>
            </main>
        </div>
    );
}
