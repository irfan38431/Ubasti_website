import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "./Spinner";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size    = "sm" | "md" | "lg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:   "bg-[var(--ubasti-olive-dark)] text-[var(--ubasti-cream)] hover:opacity-90",
  secondary: "bg-[var(--ubasti-blush)] text-[var(--ubasti-ink)] hover:opacity-90",
  ghost:     "bg-transparent text-[var(--ubasti-ink)] border border-[var(--ubasti-sage-light)] hover:bg-[var(--ubasti-cream)]",
  danger:    "bg-[var(--ubasti-danger)] text-white hover:opacity-90",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-9  px-4 text-sm  rounded-full",
  md: "h-12 px-6 text-sm  rounded-full",
  lg: "h-14 px-8 text-base rounded-full",
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ variant = "primary", size = "md", loading, disabled, children, className, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-all",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  )
);
Button.displayName = "Button";
