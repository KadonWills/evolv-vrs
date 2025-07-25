import * as React from "react"
import { cn } from "@/lib/utils"

const cva = (base: string, config?: { variants?: Record<string, Record<string, string>>; defaultVariants?: Record<string, string> }) => {
  return (props?: Record<string, string>) => {
    if (!config) return base;
    
    const { variants, defaultVariants } = config;
    let classes = base;
    
    // Merge props with default variants
    const mergedProps = { ...defaultVariants, ...props };
    
    if (variants && mergedProps) {
      Object.keys(mergedProps).forEach(key => {
        const value = mergedProps[key];
        if (variants[key] && variants[key][value]) {
          classes += ` ${variants[key][value]}`;
        }
      });
    }
    
    return classes.trim();
  };
};

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium relative overflow-hidden transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 group",
  {
    variants: {
      variant: {
        default: "bg-gradient-primary text-primary-foreground shadow-soft hover:shadow-elevated hover:scale-105 before:absolute before:inset-0 before:bg-white/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity",
        destructive: "bg-gradient-danger text-destructive-foreground shadow-soft hover:shadow-elevated hover:scale-105",
        outline: "border-2 border-border bg-background hover:bg-accent hover:text-accent-foreground hover:border-primary/50 shadow-soft hover:shadow-elevated",
        secondary: "bg-gradient-secondary text-secondary-foreground shadow-soft hover:shadow-elevated hover:scale-105",
        ghost: "hover:bg-accent/80 hover:text-accent-foreground transition-colors hover:scale-105",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80",
        success: "bg-gradient-success text-success-foreground shadow-soft hover:shadow-elevated hover:scale-105",
        warning: "bg-gradient-warning text-warning-foreground shadow-soft hover:shadow-elevated hover:scale-105",
        premium: "bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white shadow-soft hover:shadow-elevated hover:scale-105 relative before:absolute before:inset-0 before:bg-white/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity",
      },
      size: {
        default: "h-11 px-6 py-2 text-sm",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-2xl px-10 text-lg",
        icon: "h-11 w-11 rounded-xl",
        "icon-sm": "h-9 w-9 rounded-lg",
        "icon-lg": "h-12 w-12 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "success" | "warning" | "premium"
  size?: "default" | "sm" | "lg" | "xl" | "icon" | "icon-sm" | "icon-lg"
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }