import { AdminSidebar } from "../components/AdminSidebar";
import { TopHeader } from "../components/TopHeader";

export function AdminLayout({ children }) {
    return (
        <div className="flex min-h-screen w-full">
            <AdminSidebar />
            <main className="flex-1 md:ml-72 flex flex-col min-w-0">
                <TopHeader />
                <div className="flex-1 bg-red-50/10">{children}</div>
            </main>
        </div>
    );
}
