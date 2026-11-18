import { type ReactNode } from "react";
import { cx } from "./cx";

export type FormMessageProps = {
  tone?: "error" | "hint";
  id?: string;
  children: ReactNode;
  className?: string;
};

export function FormMessage({ tone = "hint", id, children, className }: FormMessageProps) {
  return (
    <p
      id={id}
      role={tone === "error" ? "alert" : undefined}
      className={cx(
        "type-caption font-display",
        tone === "error" ? "text-danger-fg" : "text-muted",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function InlineError(props: Omit<FormMessageProps, "tone">) {
  return <FormMessage {...props} tone="error" />;
}
