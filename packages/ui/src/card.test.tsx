import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card, Panel } from "./card";

describe("Card and Panel", () => {
  it("renders their contents", () => {
    render(
      <>
        <Card>Card body</Card>
        <Panel>Panel body</Panel>
      </>,
    );
    expect(screen.getByText("Card body")).toBeInTheDocument();
    expect(screen.getByText("Panel body")).toBeInTheDocument();
  });
});
