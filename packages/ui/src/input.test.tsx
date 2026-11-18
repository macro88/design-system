import { readFileSync } from "node:fs";
import path from "node:path";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { Input } from "./input";
import { Textarea } from "./textarea";

describe("Input", () => {
  it("associates the label and reports an error", async () => {
    const user = userEvent.setup();
    render(<Input label="City" error="Enter a city." />);

    const field = screen.getByRole("textbox", { name: "City" });
    expect(field).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Enter a city.")).toBeInTheDocument();
    await user.type(field, "York");
    expect(field).toHaveValue("York");
  });

  it("uses the danger focus ring on an invalid field", () => {
    const style = document.createElement("style");
    style.id = "field-fixture";
    const tokens = readFileSync(path.join(process.cwd(), "../tokens/src/theme.css"), "utf8");
    const styles = readFileSync(path.join(process.cwd(), "src/styles.css"), "utf8").replace(
      /^@import[^;]+;\s*/,
      "",
    );
    style.textContent = `${tokens}\n${styles}`;
    document.head.append(style);

    render(
      <>
        <Input label="City" error="Enter a city." />
        <Textarea label="Note" error="Write a note." />
      </>,
    );
    const input = screen.getByRole("textbox", { name: "City" });
    const textarea = screen.getByRole("textbox", { name: "Note" });
    const danger = document.createElement("span");
    danger.style.color = "var(--color-danger-fg)";
    document.body.append(danger);
    const expected = getComputedStyle(danger).color;
    input.focus();
    expect(getComputedStyle(input).outlineColor).toBe(expected);
    textarea.focus();
    expect(getComputedStyle(textarea).outlineColor).toBe(expected);
    danger.remove();
  });
});

afterEach(() => {
  document.getElementById("field-fixture")?.remove();
});
