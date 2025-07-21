import * as React from "react"
import { cn } from "@/lib/utils"

const cva = (base: string, config?: { variants?: Record<string, Record<string, string>>; defaultVariants?: Record<string, string> }) => {
  return (props?: Record<string, string>) => {
    if (!config || !props) return base;
    
    const { variants, defaultVariants } = config;
    let classes = base;
    
    if (variants) {
      Object.keys(props).forEach(key => {
        if (variants[key] && variants[key][props[key]]) {
          classes += ` ${variants[key][props[key]]}`;
        }
      });
    }
    
    if (defaultVariants && variants) {
      Object.keys(defaultVariants).forEach(key => {
        if (!props[key] && variants[key] && variants[key][defaultVariants[key]]) {
          classes += ` ${variants[key][defaultVariants[key]]}`;
        }
      });
    }
    
    return classes;
  };
};

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-sm",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gradient-primary text-primary-foreground hover:scale-105 shadow-soft",
        secondary:
          "border-transparent bg-gradient-secondary text-secondary-foreground hover:scale-105",
        destructive:
          "border-transparent bg-gradient-danger text-destructive-foreground hover:scale-105 shadow-soft",
        outline: "text-foreground border-border hover:bg-accent hover:scale-105",
        success:
          "border-transparent bg-gradient-success text-success-foreground hover:scale-105 shadow-soft",
        warning:
          "border-transparent bg-gradient-warning text-warning-foreground hover:scale-105 shadow-soft",
        pending:
          "border-transparent bg-gradient-to-r from-orange-400 to-amber-500 text-white hover:scale-105 shadow-soft animate-pulse-custom",
        approved:
          "border-transparent bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:scale-105 shadow-soft",
        rejected:
          "border-transparent bg-gradient-to-r from-red-500 to-rose-600 text-white hover:scale-105 shadow-soft",
      },
      size: {
        default: "px-3 py-1.5 text-xs",
        sm: "px-2 py-1 text-xs",
        lg: "px-4 py-2 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "pending" | "approved" | "rejected"
  size?: "default" | "sm" | "lg"
  icon?: React.ReactNode;
}

function Badge({ className, variant = "default", size = "default", icon, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }