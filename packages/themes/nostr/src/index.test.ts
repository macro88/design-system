import { describe, expect, it } from "vitest";
import { packageName, palette, themeId } from "./index";

describe("@macro88/theme-nostr", () => {
  it("exports the package name and a temporary palette id", () => {
    expect(packageName).toBe("@macro88/theme-nostr");
    expect(themeId).toBe("nostr");
    expect(palette).toBe("temporary");
  });
});
