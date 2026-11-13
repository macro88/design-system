import { readFileSync } from "node:fs";
import path from "node:path";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Switch } from "./switch";

describe("Switch", () => {
  it("toggles with Space and reports aria-checked", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch label="Reminders" onCheckedChange={onCheckedChange} />);

    const control = screen.getByRole("switch", { name: "Reminders" });
    expect(control).toHaveAttribute("aria-checked", "false");
    control.focus();
    await user.keyboard(" ");

    expect(control).toBeChecked();
    expect(control).toHaveAttribute("aria-checked", "true");
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("does not change while disabled", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch label="Reminders" disabled defaultChecked onCheckedChange={onCheckedChange} />);

    await user.click(screen.getByRole("switch", { name: "Reminders" }));
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(screen.getByRole("switch", { name: "Reminders" })).toBeChecked();
  });

  it("moves the thumb with the fast feedback tokens and drops that motion when reduced", () => {
    const css = readFileSync(path.join(process.cwd(), "src/styles.css"), "utf8");
    expect(css).toMatch(
      /\.switch-thumb\s*\{[^}]*transition:\s*transform var\(--motion-duration-fast\) var\(--motion-ease-standard\)/,
    );
    expect(css).toMatch(
      /prefers-reduced-motion:\s*reduce[\s\S]*\.switch-thumb\s*\{[^}]*transition:\s*none/,
    );
  });
});
