import { focusRingClass } from "@macro88/tokens";
import * as SelectPrimitive from "@radix-ui/react-select";
import { useId } from "react";
import { cx } from "./cx";

export type SelectOption = {
  value: string;
  label: string;
};

export type SelectProps = {
  label: string;
  options: readonly SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  name?: string;
  id?: string;
};

export function Select({
  label,
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Choose",
  hint,
  error,
  disabled,
  name,
  id,
}: SelectProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="grid gap-2">
      <label id={`${fieldId}-label`} htmlFor={fieldId} className="type-body-sm text-text">
        {label}
      </label>
      <SelectPrimitive.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
        name={name}
      >
        <SelectPrimitive.Trigger
          id={fieldId}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          data-invalid={error ? "true" : undefined}
          className={cx(
            "field inline-flex h-control w-full items-center justify-between rounded-field border border-border-strong bg-surface px-3 text-left text-text outline-none",
            focusRingClass,
          )}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            position="popper"
            className="select-content rounded-overlay border border-border bg-surface p-1 shadow-lift"
          >
            <SelectPrimitive.Viewport>
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  className={cx(
                    "select-item type-body-md cursor-default rounded-field px-3 py-2 text-text outline-none",
                    focusRingClass,
                  )}
                >
                  <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
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
