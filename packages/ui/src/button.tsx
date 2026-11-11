import { Slot } from "@radix-ui/react-slot";
import { focusRingClass } from "@macro88/tokens";
import { type ButtonHTMLAttributes } from "react";
import { cx } from "./cx";

export type ButtonVariant = "primary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  pending?: boolean;
  asChild?: boolean;
};

const variantClass: Record<ButtonVariant, string> = {
  primary: "button-primary border-transparent bg-accent text-accent-on",
  outline: "button-outline border-border-strong bg-surface text-text",
  ghost: "button-ghost border-transparent bg-transparent text-text",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "h-control-sm px-3 type-body-sm",
  md: "h-control px-4 type-body-md",
  lg: "h-control-lg px-5 type-body-md",
};

export function Button({
  variant = "primary",
  size = "md",
  pending = false,
  asChild = false,
  className,
  children,
  disabled,
  type,
  ...props
}: ButtonProps) {
  const isDisabled = Boolean(disabled || pending);
  const height =
    variant === "primary" && size === "sm" ? "h-control px-3 type-body-sm" : sizeClass[size];
  const classes = cx(
    "button inline-flex items-center justify-center gap-2 rounded-control border font-display outline-none",
    focusRingClass,
    variantClass[variant],
    height,
    className,
  );

  if (asChild) {
    return (
      <Slot
        {...props}
        aria-busy={pending || undefined}
        aria-disabled={isDisabled || undefined}
        className={classes}
      >
        {children}
      </Slot>
    );
  }

  return (
    <button
      {...props}
      type={type ?? "button"}
      disabled={isDisabled}
      aria-busy={pending || undefined}
      className={classes}
    >
      {children}
    </button>
  );
}
