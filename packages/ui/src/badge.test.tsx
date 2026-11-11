import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./badge";

describe("Badge", () => {
  it("shows the status name", () => {
    render(<Badge status="failed">Failed</Badge>);
    expect(screen.getByText("Failed")).toBeInTheDocument();
  });
});
