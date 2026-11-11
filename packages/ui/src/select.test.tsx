import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Select } from "./select";

const options = [
  { value: "york", label: "York" },
  { value: "bath", label: "Bath" },
] as const;

describe("Select", () => {
  it("chooses an option from the keyboard", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Select label="City" options={options} onValueChange={onValueChange} />);

    const trigger = screen.getByRole("combobox", { name: "City" });
    trigger.focus();
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");

    expect(onValueChange).toHaveBeenCalledWith("york");
  });

  it("exposes an error", () => {
    render(<Select label="City" options={options} error="Choose a city." />);
    expect(screen.getByRole("combobox", { name: "City" })).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Choose a city.")).toBeInTheDocument();
  });
});
