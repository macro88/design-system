import { focusRingClass } from "@macro88/tokens";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { useId } from "react";
import { cx } from "./cx";

export type SwitchProps = {
  label: string;
  hint?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  name?: string;
  id?: string;
};

export function Switch({
  label,
  hint,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  name,
  id,
}: SwitchProps) {
  const generatedId = useId();
  const switchId = id ?? generatedId;
  const hintId = hint ? `${switchId}-hint` : undefined;

  return (
    <div className="switch-row flex items-center gap-3">
      <SwitchPrimitive.Root
        id={switchId}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        name={name}
        aria-describedby={hintId}
        className={cx("switch", focusRingClass)}
      >
        <SwitchPrimitive.Thumb className="switch-thumb" />
      </SwitchPrimitive.Root>
      <div className="grid gap-1">
        <label
          htmlFor={switchId}
          className={cx("type-body-md font-display", disabled ? "text-muted" : "text-text")}
        >
          {label}
        </label>
        {hint ? (
          <p id={hintId} className="type-caption font-display text-muted">
            {hint}
          </p>
        ) : null}
      </div>
    </div>
  );
}
