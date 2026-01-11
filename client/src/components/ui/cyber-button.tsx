import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface CyberButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
}

export const CyberButton = forwardRef<HTMLButtonElement, CyberButtonProps>(
  ({ className, variant = 'primary', isLoading, children, disabled, ...props }, ref) => {
    
    const variants = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_-5px_hsl(var(--primary)/0.5)] border-transparent",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-[0_0_20px_-5px_hsl(var(--secondary)/0.5)] border-transparent",
      outline: "bg-transparent border-2 border-primary/50 text-primary hover:bg-primary/10 hover:border-primary shadow-[0_0_15px_-5px_hsl(var(--primary)/0.3)]",
      ghost: "bg-transparent hover:bg-accent hover:text-accent-foreground border-transparent",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center rounded-lg px-8 py-3 text-sm font-bold uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]",
          "font-mono", 
          variants[variant],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
        
        {/* Tech decorative corners for outline variant */}
        {variant === 'outline' && (
          <>
            <span className="absolute top-0 left-0 -mt-1 -ml-1 w-2 h-2 border-t-2 border-l-2 border-primary" />
            <span className="absolute bottom-0 right-0 -mb-1 -mr-1 w-2 h-2 border-b-2 border-r-2 border-primary" />
          </>
        )}
      </button>
    );
  }
);

CyberButton.displayName = "CyberButton";
