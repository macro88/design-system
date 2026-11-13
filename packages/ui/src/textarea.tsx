import { focusRingClass } from "@macro88/tokens";
import { type TextareaHTMLAttributes, useId } from "react";
import { cx } from "./cx";
import { FormMessage } from "./form-message";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  hint?: string;
  error?: string;
};

export function Textarea({ label, hint, error, id, className, ...props }: TextareaProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="grid gap-2">
      <label htmlFor={fieldId} className="type-body-sm font-display text-text">
        {label}
      </label>
      <textarea
        {...props}
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        data-invalid={error ? "true" : undefined}
        className={cx(
          "field field-area w-full rounded-field border border-border-strong bg-surface px-3 py-3 font-display text-text outline-none",
          focusRingClass,
          className,
        )}
      />
      {hint ? (
        <FormMessage id={hintId} tone="hint">
          {hint}
        </FormMessage>
      ) : null}
      {error ? (
        <FormMessage id={errorId} tone="error">
          {error}
        </FormMessage>
      ) : null}
    </div>
  );
}
