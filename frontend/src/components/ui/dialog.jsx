import React, { createContext, useContext, useState, forwardRef } from "react";

const DialogContext = createContext(undefined);

function useDialogContext() {
  const ctx = useContext(DialogContext);
  if (!ctx) {
    throw new Error("Dialog compound components must be used inside <Dialog>");
  }
  return ctx;
}

function Dialog({ children, open: openProp, defaultOpen, onOpenChange }) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen ?? false);
  const open = openProp !== undefined ? openProp : uncontrolledOpen;

  const setOpen = (value) => {
    if (openProp === undefined) {
      setUncontrolledOpen(value);
    }
    if (onOpenChange) onOpenChange(value);
  };

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

function DialogTrigger({ children }) {
  const { setOpen } = useDialogContext();

  return React.cloneElement(children, {
    onClick: (event) => {
      if (children.props.onClick) {
        children.props.onClick(event);
      }
      if (!event.defaultPrevented) {
        setOpen(true);
      }
    },
  });
}

const DialogContent = forwardRef(function DialogContent(
  { className = "", ...props },
  ref,
) {
  const { open, setOpen } = useDialogContext();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={() => setOpen(false)} />
      <div
        ref={ref}
        className={`relative z-50 w-full max-w-md rounded-lg bg-card p-6 shadow-lg ${className}`}
        {...props}
      />
    </div>
  );
});

function DialogHeader({ className = "", ...props }) {
  return <div className={`mb-4 space-y-1 ${className}`} {...props} />;
}

function DialogFooter({ className = "", ...props }) {
  return (
    <div
      className={`mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end ${className}`}
      {...props}
    />
  );
}

function DialogTitle({ className = "", ...props }) {
  return (
    <h2
      className={`text-lg font-semibold leading-none tracking-tight ${className}`}
      {...props}
    />
  );
}

function DialogDescription({ className = "", ...props }) {
  return (
    <p className={`text-sm text-muted-foreground ${className}`} {...props} />
  );
}

function DialogClose({ children }) {
  const { setOpen } = useDialogContext();

  return React.cloneElement(children, {
    onClick: (event) => {
      if (children.props.onClick) {
        children.props.onClick(event);
      }
      if (!event.defaultPrevented) {
        setOpen(false);
      }
    },
  });
}

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
};
