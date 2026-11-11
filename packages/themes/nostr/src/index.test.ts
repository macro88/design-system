import { describe, expect, it } from "vitest";
import { feel, packageName, themeId } from "./index";

describe("@macro88/theme-nostr", () => {
  it("exports the package name and theme id", () => {
    expect(packageName).toBe("@macro88/theme-nostr");
    expect(themeId).toBe("nostr");
  });

  it("does not scale cards", () => {
    expect(feel.cardHoverScale).toBe(1);
  });
});
