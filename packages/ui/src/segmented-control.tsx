import { focusRingClass } from "@macro88/tokens";
import { type KeyboardEvent, useRef, useState } from "react";
import { cx } from "./cx";

export type SegmentedOption = {
  value: string;
  label: string;
};

export type SegmentedControlProps = {
  label: string;
  options: readonly SegmentedOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  name?: string;
};

export function SegmentedControl({
  label,
  options,
  value,
  defaultValue,
  onValueChange,
  disabled,
  name,
}: SegmentedControlProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? options[0]?.value ?? "");
  const selected = value ?? uncontrolled;
  const items = useRef<Array<HTMLButtonElement | null>>([]);

  function commit(next: string) {
    if (value === undefined) setUncontrolled(next);
    onValueChange?.(next);
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const nextKey = event.key === "ArrowRight" || event.key === "ArrowDown";
    const previousKey = event.key === "ArrowLeft" || event.key === "ArrowUp";
    if (!nextKey && !previousKey) return;
    event.preventDefault();
    const delta = nextKey ? 1 : -1;
    const nextIndex = (index + delta + options.length) % options.length;
    const next = options[nextIndex];
    if (!next) return;
    commit(next.value);
    items.current[nextIndex]?.focus();
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex flex-wrap gap-1 rounded-control border border-border p-1"
    >
      {name ? <input type="hidden" name={name} value={selected} /> : null}
      {options.map((option, index) => {
        const checked = option.value === selected;
        return (
          <button
            key={option.value}
            ref={(node) => {
              items.current[index] = node;
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            data-state={checked ? "checked" : "unchecked"}
            tabIndex={checked ? 0 : -1}
            disabled={disabled}
            className={cx(
              "segmented-item inline-flex h-control items-center justify-center rounded-control px-3 font-display text-text outline-none",
              focusRingClass,
            )}
            onClick={() => commit(option.value)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
