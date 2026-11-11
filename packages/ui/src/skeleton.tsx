import { type ReactNode, useEffect, useRef, useState } from "react";
import { cx } from "./cx";

export type SkeletonVariant = "line" | "card" | "column";

const variantClass: Record<SkeletonVariant, string> = {
  line: "skeleton-line rounded-control",
  card: "skeleton-card rounded-panel",
  column: "skeleton-column rounded-panel",
};

function readMs(name: string, fallback: number): number {
  if (typeof window === "undefined") return fallback;
  const inline = document.documentElement.style.getPropertyValue(name).trim();
  const raw =
    inline || window.getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) ? value : fallback;
}

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
  const delay = readMs("--skeleton-delay", 200);
  const minimum = readMs("--skeleton-min", 400);
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
