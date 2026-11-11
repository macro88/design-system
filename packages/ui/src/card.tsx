import { type HTMLAttributes, type ReactNode } from "react";
import { cx } from "./cx";

type SurfaceProps = {
  children: ReactNode;
  className?: string;
};

export function Card({
  children,
  className,
  ...props
}: SurfaceProps & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cx(
        "rounded-panel border border-border bg-surface p-4 text-text shadow-rest",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Panel({
  children,
  className,
  ...props
}: SurfaceProps & HTMLAttributes<HTMLElement>) {
  return (
    <section
      {...props}
      className={cx(
        "rounded-panel border border-border bg-surface p-6 text-text shadow-rest",
        className,
      )}
    >
      {children}
    </section>
  );
}
