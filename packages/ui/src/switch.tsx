import { focusRingClass } from "@macro88/tokens";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { useId } from "react";
import { cx } from "./cx";

export type SwitchProps = {
  label: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  name?: string;
  id?: string;
};

export function Switch({
  label,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  name,
  id,
}: SwitchProps) {
  const generatedId = useId();
  const switchId = id ?? generatedId;

  return (
    <div className="flex items-center gap-3">
      <SwitchPrimitive.Root
        id={switchId}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        name={name}
        className={cx("switch", focusRingClass)}
      >
        <SwitchPrimitive.Thumb className="switch-thumb" />
      </SwitchPrimitive.Root>
      <label
        htmlFor={switchId}
        className={cx("type-body-md font-display", disabled ? "text-muted" : "text-text")}
      >
        {label}
      </label>
    </div>
  );
}
