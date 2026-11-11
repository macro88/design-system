import { describe, expect, it } from "vitest";
import { motion, packageName, patterns, tokens, ui } from "./index";

describe("@macro88/design-system", () => {
  it("re-exports the stub packages", () => {
    expect(packageName).toBe("@macro88/design-system");
    expect(tokens.packageName).toBe("@macro88/tokens");
    expect(motion.packageName).toBe("@macro88/motion");
    expect(ui.packageName).toBe("@macro88/ui");
    expect(patterns.packageName).toBe("@macro88/patterns");
  });
});
