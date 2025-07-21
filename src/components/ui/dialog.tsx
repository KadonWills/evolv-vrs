import * as React from "react"
import { cn } from "@/lib/utils"

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  return (
    <>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { open, onOpenChange } as Record<string, unknown>);
        }
        return child;
      })}
    </>
  );
};

const DialogTrigger: React.FC<{ 
  children: React.ReactNode; 
  asChild?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}> = ({ children, open, onOpenChange }) => {
  const handleClick = () => {
    onOpenChange?.(!open);
  };

  if (React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: handleClick,
    } as Record<string, unknown>);
  }
  
  return <button onClick={handleClick}>{children}</button>;
};

const DialogOverlay: React.FC<{ 
  className?: string; 
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}> = ({ className, open, onOpenChange }) => {
  if (!open) return null;
  
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-black/20 backdrop-blur-sm animate-fade-in",
        className
      )}
      onClick={() => onOpenChange?.(false)}
    />
  );
};

const DialogContent: React.FC<{ 
  className?: string; 
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}> = ({ className, children, open, onOpenChange }) => {
  if (!open) return null;

  return (
    <>
      <DialogOverlay open={open} onOpenChange={onOpenChange} />
      <div
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-6 border bg-card p-8 shadow-floating rounded-2xl animate-scale-in backdrop-glass",
          className
        )}
      >
        {children}
        <button
          onClick={() => onOpenChange?.(false)}
          className="absolute right-4 top-4 rounded-xl p-2 opacity-70 hover:opacity-100 hover:bg-muted transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <span className="h-4 w-4 inline-block font-bold text-lg leading-none">×</span>
          <span className="sr-only">Close</span>
        </button>
      </div>
    </>
  );
};

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-3 text-center sm:text-left pb-4 border-b border-border/50",
      className
    )}
    {...props}
  />
);

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 gap-3 pt-4 border-t border-border/50",
      className
    )}
    {...props}
  />
);

const DialogTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ 
  className, 
  ...props 
}) => (
  <h3
    className={cn(
      "text-xl font-semibold leading-tight tracking-tight text-card-foreground",
      className
    )}
    {...props}
  />
);

const DialogDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ 
  className, 
  ...props 
}) => (
  <p
    className={cn("text-sm text-muted-foreground leading-relaxed", className)}
    {...props}
  />
);

export {
  Dialog,
  DialogOverlay,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}