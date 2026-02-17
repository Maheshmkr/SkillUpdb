import React from "react";

// Minimal visual toast component. Types are handled in the TS hook.
function Toast({ title, description, action }) {
  return (
    <div className="rounded-md border bg-card text-foreground shadow-lg p-4">
      {title && <div className="font-semibold mb-1">{title}</div>}
      {description && (
        <div className="text-sm text-muted-foreground">{description}</div>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export { Toast };
