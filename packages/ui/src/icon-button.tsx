import { focusRingClass } from "@macro88/tokens";
import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { cx } from "./cx";
import { type IconSize } from "./icon";

export type IconButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "aria-label" | "children"
> & {
  label: string;
  size?: IconSize;
  children: ReactNode;
};

const sizeClass: Record<IconSize, string> = {
  sm: "icon-button-sm h-control-sm",
  md: "h-control",
  lg: "icon-button-lg h-control-lg",
};

export function IconButton({
  label,
  size = "md",
  className,
  children,
  type,
  ...props
}: IconButtonProps) {
  if (label.trim().length === 0) {
    throw new Error("IconButton requires an accessible name.");
  }

  return (
    <button
      {...props}
      type={type ?? "button"}
      aria-label={label}
      className={cx(
        "icon-button button button-ghost inline-flex items-center justify-center rounded-control border border-transparent bg-transparent text-text outline-none",
        focusRingClass,
        sizeClass[size],
        className,
      )}
    >
      {children}
    </button>
  );
}
