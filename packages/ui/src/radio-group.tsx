import { focusRingClass } from "@macro88/tokens";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { useId } from "react";
import { cx } from "./cx";

export type RadioOption = {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
};

export type RadioGroupProps = {
  label: string;
  options: readonly RadioOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  name?: string;
  id?: string;
};

export function RadioGroup({
  label,
  options,
  value,
  defaultValue,
  onValueChange,
  disabled,
  name,
  id,
}: RadioGroupProps) {
  const generatedId = useId();
  const groupId = id ?? generatedId;
  const labelId = `${groupId}-label`;

  return (
    <div className="grid gap-2">
      <p id={labelId} className="type-body-sm font-display text-text">
        {label}
      </p>
      <RadioGroupPrimitive.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
        name={name}
        aria-labelledby={labelId}
        className="grid gap-3"
      >
        {options.map((option, index) => {
          const itemId = `${groupId}-option-${index}`;
          const descriptionId = option.description ? `${itemId}-description` : undefined;
          const itemDisabled = Boolean(disabled || option.disabled);
          return (
            <div key={option.value} className="grid gap-1">
              <label htmlFor={itemId} className="flex items-center gap-3">
                <RadioGroupPrimitive.Item
                  id={itemId}
                  value={option.value}
                  disabled={option.disabled}
                  aria-describedby={descriptionId}
                  className={cx("radio", focusRingClass)}
                >
                  <RadioGroupPrimitive.Indicator forceMount className="radio-dot" />
                </RadioGroupPrimitive.Item>
                <span
                  className={cx(
                    "type-body-md font-display",
                    itemDisabled ? "text-muted" : "text-text",
                  )}
                >
                  {option.label}
                </span>
              </label>
              {option.description ? (
                <p
                  id={descriptionId}
                  className="radio-description type-caption font-display text-muted"
                >
                  {option.description}
                </p>
              ) : null}
            </div>
          );
        })}
      </RadioGroupPrimitive.Root>
    </div>
  );
}
