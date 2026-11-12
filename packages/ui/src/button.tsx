import { Slot } from "@radix-ui/react-slot";
import { focusRingClass } from "@macro88/tokens";
import {
  forwardRef,
  type ButtonHTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { cx } from "./cx";

type ButtonBase = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "disabled"> & {
  pending?: boolean;
  disabled?: boolean;
  asChild?: boolean;
};

export type ButtonProps =
  | (ButtonBase & {
      variant?: "primary";
      size?: "md" | "lg";
    })
  | (ButtonBase & {
      variant: "outline" | "ghost" | "danger";
      size?: "sm" | "md" | "lg";
    });

export type ButtonVariant = "primary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const variantClass = {
  primary: "button-primary border-transparent bg-accent text-accent-on",
  outline: "button-outline border-border-strong bg-surface text-text",
  ghost: "button-ghost border-transparent bg-transparent text-text",
  danger: "button-danger border-transparent bg-danger-bg text-danger-fg",
} as const;

const sizeClass = {
  sm: "h-control-sm px-3 type-body-sm",
  md: "h-control px-4 type-body-md",
  lg: "h-control-lg px-5 type-body-md",
} as const;

function blockActivation(event: { preventDefault(): void; stopPropagation(): void }) {
  event.preventDefault();
  event.stopPropagation();
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    pending = false,
    asChild = false,
    className,
    children,
    disabled,
    type,
    onClick,
    onKeyDown,
    ...props
  },
  ref,
) {
  const blocked = Boolean(disabled || pending);
  const stopKeys = (event: ReactKeyboardEvent<HTMLElement>) => {
    onKeyDown?.(event as ReactKeyboardEvent<HTMLButtonElement>);
    if (event.defaultPrevented || !blocked) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.stopPropagation();
    }
  };
  const classes = cx(
    "button inline-flex items-center justify-center gap-2 rounded-control border font-display outline-none",
    focusRingClass,
    variantClass[variant],
    sizeClass[size],
    className,
  );
  if (asChild) {
    return (
      <Slot
        {...props}
        ref={ref}
        aria-busy={pending || undefined}
        aria-disabled={blocked || undefined}
        className={classes}
        onKeyDown={stopKeys}
        onClick={(event) => {
          if (blocked) {
            blockActivation(event);
            return;
          }
          onClick?.(event as ReactMouseEvent<HTMLButtonElement>);
        }}
      >
        {children}
      </Slot>
    );
  }

  return (
    <button
      {...props}
      ref={ref}
      type={type ?? "button"}
      disabled={Boolean(disabled)}
      aria-disabled={blocked || undefined}
      aria-busy={pending || undefined}
      className={classes}
      onKeyDown={stopKeys}
      onClick={(event) => {
        if (blocked) {
          blockActivation(event);
          return;
        }
        onClick?.(event);
      }}
    >
      {children}
    </button>
  );
});
