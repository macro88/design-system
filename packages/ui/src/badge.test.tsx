import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./badge";

describe("Badge", () => {
  it("shows the tone", () => {
    render(<Badge tone="danger">Danger</Badge>);
    expect(screen.getByText("Danger")).toHaveAttribute("data-tone", "danger");
  });

  it("defaults to neutral", () => {
    render(<Badge>Note</Badge>);
    expect(screen.getByText("Note")).toHaveAttribute("data-tone", "neutral");
  });
});
