import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckIcon, XIcon, SparklesIcon } from "./icons";

export interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  type?: "success" | "error" | "info" | "warning";
  duration?: number;
  onRemove?: (id: string) => void;
}

const toastVariants = {
  success: {
    icon: CheckIcon,
    className: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-emerald-200",
  },
  error: {
    icon: XIcon,
    className: "bg-gradient-to-r from-red-500 to-rose-600 text-white border-red-200",
  },
  info: {
    icon: SparklesIcon,
    className: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-blue-200",
  },
  warning: {
    icon: SparklesIcon,
    className: "bg-gradient-to-r from-orange-500 to-amber-600 text-white border-orange-200",
  },
};

export const Toast: React.FC<ToastProps> = ({
  id,
  title,
  description,
  type = "info",
  duration = 5000,
  onRemove,
}) => {
  const [isRemoving, setIsRemoving] = React.useState(false);
  const variant = toastVariants[type];
  const Icon = variant.icon;

  const handleRemove = React.useCallback(() => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove?.(id);
    }, 300);
  }, [id, onRemove]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      handleRemove();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, handleRemove]);

  return (
    <div
      className={cn(
        "pointer-events-auto relative flex w-full max-w-sm items-center space-x-4 overflow-hidden rounded-2xl border p-4 pr-8 shadow-elevated transition-all duration-300 ease-out",
        variant.className,
        isRemoving && "translate-x-full opacity-0"
      )}
      style={{
        animation: "slideInRight 0.3s ease-out",
      }}
    >
      <Icon size={20} className="flex-shrink-0" />
      <div className="flex-1 space-y-1">
        {title && (
          <div className="text-sm font-semibold leading-none">{title}</div>
        )}
        {description && (
          <div className="text-sm opacity-90 leading-relaxed">{description}</div>
        )}
      </div>
      <button
        onClick={handleRemove}
        className="absolute right-2 top-2 rounded-lg p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/50"
      >
        <XIcon size={14} />
      </button>
    </div>
  );
};

// Toast container component
export interface ToastContainerProps {
  toasts: ToastProps[];
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemove,
}) => {
  return (
    <div className="pointer-events-none fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-4 sm:right-4 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

// Custom hook for managing toasts
export const useToast = () => {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  const addToast = React.useCallback((toast: Omit<ToastProps, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = React.useCallback((title: string, description?: string) => {
    addToast({ title, description, type: "success" });
  }, [addToast]);

  const error = React.useCallback((title: string, description?: string) => {
    addToast({ title, description, type: "error" });
  }, [addToast]);

  const info = React.useCallback((title: string, description?: string) => {
    addToast({ title, description, type: "info" });
  }, [addToast]);

  const warning = React.useCallback((title: string, description?: string) => {
    addToast({ title, description, type: "warning" });
  }, [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning,
  };
};