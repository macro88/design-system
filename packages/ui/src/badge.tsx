import { type StatusTone } from "@macro88/tokens";
import { type ReactNode } from "react";
import { cx } from "./cx";

export type BadgeProps = {
  tone?: StatusTone;
  children: ReactNode;
  className?: string;
};

export function Badge({ tone = "neutral", children, className }: BadgeProps) {
  return (
    <span data-tone={tone} className={cx("badge inline-flex items-center px-2 py-1", className)}>
      {children}
    </span>
  );
}
