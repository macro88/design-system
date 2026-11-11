import { describe, expect, it } from "vitest";
import { parseToken } from "./read-token";

describe("parseToken", () => {
  it("keeps milliseconds and does not treat them as pixels", () => {
    expect(parseToken("4000ms")).toBe(4000);
    expect(parseToken("6000ms")).toBe(6000);
    expect(parseToken("200ms")).toBe(200);
  });

  it("converts seconds to milliseconds and lengths to pixels", () => {
    expect(parseToken("1.4s")).toBe(1400);
    expect(parseToken("8px")).toBe(8);
    expect(parseToken("0.5rem")).toBe(8);
    expect(parseToken("1.75rem")).toBe(28);
    expect(parseToken("1rem")).toBe(16);
  });
});
