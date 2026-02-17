import React, { forwardRef } from "react";

const Button = forwardRef(function Button(
  { className = "", variant = "default", ...props },
  ref,
) {
  let variantClasses = "bg-primary text-primary-foreground hover:bg-primary/90";
  if (variant === "outline") {
    variantClasses = "border border-input bg-background hover:bg-accent hover:text-accent-foreground";
  } else if (variant === "ghost") {
    variantClasses = "hover:bg-accent hover:text-accent-foreground";
  }

  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium px-4 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${variantClasses} ${className}`}
      {...props}
    />
  );
});

export { Button };
