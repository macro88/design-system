import { type StatusRole } from "@macro88/tokens";
import { type ReactNode } from "react";
import { cx } from "./cx";

export type BadgeProps = {
  status: StatusRole;
  children: ReactNode;
  className?: string;
};

export function Badge({ status, children, className }: BadgeProps) {
  return (
    <span
      data-status={status}
      className={cx("badge inline-flex items-center rounded-badge px-2 py-1", className)}
    >
      {children}
    </span>
  );
}
