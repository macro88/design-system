import { type ReactNode } from "react";
import { cx } from "./cx";

export type IconSize = "sm" | "md" | "lg";

const sizeClass: Record<IconSize, string> = {
  sm: "size-icon-sm",
  md: "size-icon-md",
  lg: "size-icon-lg",
};

export type IconProps = {
  size?: IconSize;
  children: ReactNode;
};

/** Stroke wrapper. Pass any SVG element; no icon set is bundled. */
export function Icon({ size = "md", children }: IconProps) {
  return (
    <span aria-hidden="true" className={cx("icon", sizeClass[size])}>
      {children}
    </span>
  );
}
