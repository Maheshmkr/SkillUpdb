import { AppSidebar } from "./AppSidebar";
import { TopHeader } from "./TopHeader";

export function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 md:ml-72 flex flex-col min-w-0">
        <TopHeader />
        <div className="flex-1">{children}</div>
      </main>
    </div>
  );
}
