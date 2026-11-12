import { readFileSync } from "node:fs";
import path from "node:path";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";

const styles = readFileSync(path.join(process.cwd(), "src/styles.css"), "utf8");

describe("Button", () => {
  it("runs its action from a click and from the keyboard", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);

    await user.click(screen.getByRole("button", { name: "Save" }));
    screen.getByRole("button", { name: "Save" }).focus();
    await user.keyboard("{Enter}");

    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("uses the same neutral fill for native disabled and aria-disabled", () => {
    const rule =
      styles.match(
        /\.button:disabled,\s*\.button\[aria-disabled="true"\][\s\S]*?\{([^}]+)\}/,
      )?.[1] ?? "";
    expect(rule).toContain("background-color: var(--color-disabled-bg)");
    expect(rule).toContain("color: var(--color-disabled-fg)");
    expect(rule).toContain("border-color: var(--color-border)");
    expect(rule).toContain("border-width: var(--border-width)");
    expect(rule).toContain("box-shadow: none");
    expect(rule).toContain("cursor: not-allowed");
    expect(rule).not.toContain("opacity");

    const { rerender } = render(<Button disabled>Save</Button>);
    const native = screen.getByRole("button", { name: "Save" });
    expect(native).toBeDisabled();
    expect(native).toHaveAttribute("aria-disabled", "true");
    expect(native).toHaveClass("button");

    rerender(<Button pending>Save</Button>);
    const held = screen.getByRole("button", { name: "Save" });
    expect(held).not.toBeDisabled();
    expect(held).toHaveAttribute("aria-disabled", "true");
    expect(held).toHaveClass("button");
  });

  it("does not run its action when disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>,
    );

    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("stays focusable and ignores click, Enter, and Space while aria-disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button pending onClick={onClick}>
        Save
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Save" });
    button.focus();
    expect(button).toHaveFocus();
    await user.click(button);
    await user.keyboard("{Enter}");
    await user.keyboard(" ");
    expect(onClick).not.toHaveBeenCalled();
  });

  it("keeps its label and ignores activation while pending", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button pending onClick={onClick}>
        Save
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).not.toBeDisabled();
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("keeps focus while pending", () => {
    const view = render(<Button>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    button.focus();
    view.rerender(<Button pending>Save</Button>);
    expect(button).toHaveFocus();
    expect(button).not.toBeDisabled();
  });

  it("stops a pending link from navigating", () => {
    render(
      <Button asChild pending>
        <a href="/next">Next</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Next" });
    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    link.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it("can render as the child element", () => {
    render(
      <Button asChild>
        <a href="/next">Next</a>
      </Button>,
    );
    expect(screen.getByRole("link", { name: "Next" })).toHaveAttribute("href", "/next");
  });
});
