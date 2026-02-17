import React from "react";
import { useToast } from "@/hooks/use-toast";

function Toaster() {
  const { toasts, dismiss } = useToast();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto w-full max-w-sm rounded-md border bg-card text-foreground shadow-lg p-4"
        >
          {toast.title && <div className="font-semibold mb-1">{toast.title}</div>}
          {toast.description && (
            <div className="text-sm text-muted-foreground">{toast.description}</div>
          )}
          {toast.action}
          <button
            type="button"
            onClick={() => dismiss(toast.id)}
            className="mt-3 text-xs text-muted-foreground hover:text-foreground"
          >
            Close
          </button>
        </div>
      ))}
    </div>
  );
}

export { Toaster };
