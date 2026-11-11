import { focusRingClass } from "@macro88/tokens";
import { type InputHTMLAttributes, useId } from "react";
import { cx } from "./cx";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
};

export function Input({ label, hint, error, id, className, ...props }: InputProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="grid gap-2">
      <label htmlFor={fieldId} className="type-body-sm text-text">
        {label}
      </label>
      <input
        {...props}
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        data-invalid={error ? "true" : undefined}
        className={cx(
          "field h-control w-full rounded-field border border-border-strong bg-surface px-3 text-text outline-none",
          focusRingClass,
          className,
        )}
      />
      {hint ? (
        <p id={hintId} className="type-caption text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="type-caption text-danger-fg">
          {error}
        </p>
      ) : null}
    </div>
  );
}
