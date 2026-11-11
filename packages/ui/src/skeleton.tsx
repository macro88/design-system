import { type ReactNode, useEffect, useRef, useState } from "react";
import { cx } from "./cx";
import { readToken } from "./read-token";

export type SkeletonVariant = "line" | "card" | "column";

const variantClass: Record<SkeletonVariant, string> = {
  line: "skeleton-line rounded-control",
  card: "skeleton-card rounded-panel",
  column: "skeleton-column rounded-panel",
};

function useMinimumPresence(active: boolean, delay: number, minimum: number): boolean {
  const [visible, setVisible] = useState(false);
  const shownAt = useRef<number | null>(null);

  useEffect(() => {
    if (active) {
      if (shownAt.current !== null) return;
      const show = setTimeout(() => {
        shownAt.current = Date.now();
        setVisible(true);
      }, delay);
      return () => clearTimeout(show);
    }

    if (shownAt.current === null) {
      setVisible(false);
      return;
    }

    const elapsed = Date.now() - shownAt.current;
    const wait = Math.max(0, minimum - elapsed);
    const hide = setTimeout(() => {
      shownAt.current = null;
      setVisible(false);
    }, wait);
    return () => clearTimeout(hide);
  }, [active, delay, minimum]);

  return visible;
}

export type SkeletonProps = {
  variant?: SkeletonVariant;
  pending?: boolean;
  label?: string;
  children?: ReactNode;
};

export function Skeleton({
  variant = "line",
  pending,
  label = "Loading",
  children,
}: SkeletonProps) {
  const delay = readToken("--skeleton-delay");
  const minimum = readToken("--skeleton-min");
  const waiting = useMinimumPresence(pending === true, delay, minimum);
  const show = pending === undefined ? true : waiting;

  if (!show) return <>{children}</>;

  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={label}
      className={cx("motion-shimmer", variantClass[variant])}
    />
  );
}
