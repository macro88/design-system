import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { RadioGroup } from "./radio-group";

const options = [
  { value: "weekly", label: "Weekly", description: "Repeats every week." },
  { value: "once", label: "Once" },
] as const;

describe("RadioGroup", () => {
  it("moves the checked radio with the arrow keys and leaves the following field alone", async () => {
    const onValueChange = vi.fn();
    render(
      <>
        <RadioGroup
          label="Schedule"
          defaultValue="weekly"
          onValueChange={onValueChange}
          options={options}
        />
        <input aria-label="Note" />
      </>,
    );

    const weekly = screen.getByRole("radio", { name: "Weekly" });
    const once = screen.getByRole("radio", { name: "Once" });
    expect(weekly).toBeChecked();
    expect(weekly).toHaveAttribute("aria-checked", "true");
    expect(once).toHaveAttribute("aria-checked", "false");
    expect(weekly).toHaveAccessibleDescription("Repeats every week.");

    weekly.focus();
    fireEvent.keyDown(weekly, { key: "ArrowDown" });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(once).toBeChecked();
    expect(once).toHaveFocus();
    expect(onValueChange).toHaveBeenCalledWith("once");
    expect(screen.getByRole("textbox", { name: "Note" })).not.toHaveFocus();
  });

  it("supports a controlled value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    function Controlled() {
      const [value, setValue] = useState("weekly");
      return (
        <RadioGroup
          label="Schedule"
          value={value}
          onValueChange={(next) => {
            onValueChange(next);
            setValue(next);
          }}
          options={options}
        />
      );
    }

    render(<Controlled />);
    await user.click(screen.getByRole("radio", { name: "Once" }));

    expect(onValueChange).toHaveBeenCalledWith("once");
    expect(screen.getByRole("radio", { name: "Once" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "Weekly" })).toHaveAttribute("aria-checked", "false");
  });

  it("does not change while disabled", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup
        disabled
        label="Schedule"
        defaultValue="weekly"
        onValueChange={onValueChange}
        options={options}
      />,
    );

    await user.click(screen.getByRole("radio", { name: "Once" }));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("radio", { name: "Weekly" })).toBeChecked();
  });
});
