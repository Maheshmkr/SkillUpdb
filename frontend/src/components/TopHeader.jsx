import { Search, CircleHelp, Bell } from "lucide-react";

export function TopHeader() {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-card/80 backdrop-blur-md px-8 py-4">
      <div className="flex-1 max-w-xl">
        <div className="flex items-center bg-secondary rounded-xl px-4 py-2 border border-transparent focus-within:border-primary/30 focus-within:bg-card transition-all">
          <Search className="size-5 text-muted-foreground" />
          <input
            className="bg-transparent border-none focus:ring-0 focus:outline-none text-sm w-full placeholder:text-muted-foreground ml-2"
            placeholder="What do you want to learn today?"
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-4 ml-8">
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-secondary rounded-lg transition-colors">
          <CircleHelp className="size-5" />
          <span className="hidden md:inline">Support</span>
        </button>
        <button className="p-2.5 text-muted-foreground hover:bg-secondary rounded-xl relative">
          <Bell className="size-5" />
          <span className="absolute top-2.5 right-2.5 size-2 bg-destructive rounded-full border-2 border-card" />
        </button>
      </div>
    </header>
  );
}
