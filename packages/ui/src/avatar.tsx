import { cx } from "./cx";

export type AvatarSize = "sm" | "md" | "lg";

const sizeClass: Record<AvatarSize, string> = {
  sm: "size-8",
  md: "size-10",
  lg: "size-12",
};

export type AvatarProps = {
  name: string;
  size?: AvatarSize;
};

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0];
  if (!first) return "";
  const last = parts.length > 1 ? parts[parts.length - 1] : undefined;
  if (!last) return first.slice(0, 2).toUpperCase();
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
}

export function Avatar({ name, size = "md" }: AvatarProps) {
  return (
    <span
      role="img"
      aria-label={name}
      className={cx(
        "inline-flex items-center justify-center rounded-full bg-accent-subtle font-display text-text",
        size === "lg" ? "type-body-md" : "type-caption",
        sizeClass[size],
      )}
    >
      {initials(name)}
    </span>
  );
}
