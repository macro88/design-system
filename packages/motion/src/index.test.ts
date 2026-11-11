import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  componentTimingVars,
  cssVars,
  duration,
  skeletonAnimationVar,
  durationMs,
  ease,
  packageName,
  reducedMotion,
  spring,
  tween,
} from "./index";

describe("@macro88/motion", () => {
  it("exports the package name", () => {
    expect(packageName).toBe("@macro88/motion");
  });

  it("keeps millisecond and second durations in step", () => {
    for (const token of Object.keys(durationMs) as Array<keyof typeof durationMs>) {
      expect(duration[token]).toBeCloseTo(durationMs[token] / 1000);
    }
  });

  it("builds a tween and omits a zero delay", () => {
    expect(tween("base")).toEqual({
      type: "tween",
      duration: 0.2,
      ease: ease.standard,
    });
    expect(tween("fast", "exit", 0.04).delay).toBe(0.04);
  });

  it("drops transforms under reduced motion and keeps a fade for opacity", () => {
    const lively = reducedMotion(spring.lively, true, "transform");
    expect(lively).toEqual({ type: "tween", duration: 0, ease: ease.linear });

    const faded = reducedMotion(tween("base"), true, "opacity");
    expect(faded).toEqual({ type: "tween", duration: duration.fade, ease: ease.linear });

    expect(reducedMotion(spring.lively, false)).toBe(spring.lively);
  });

  it("publishes the same custom property names as tokens.css", () => {
    const css = readFileSync(new URL("./tokens.css", import.meta.url), "utf8");
    for (const name of Object.values(cssVars.duration)) {
      expect(css).toContain(`${name}:`);
    }
    for (const name of Object.values(cssVars.ease)) {
      expect(css).toContain(`${name}:`);
    }
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toContain("--motion-duration-fade: 120ms");
    for (const name of Object.values(componentTimingVars)) {
      expect(css).toContain(`${name}:`);
    }
    expect(css).toContain("--shimmer-duration: 1.4s");
    expect(css).toContain("--shimmer-duration: 0ms");
    expect(css).toContain(`${skeletonAnimationVar}: none`);
    expect(css).toMatch(/prefers-reduced-motion: reduce[\s\S]*--skeleton-animation:\s*none/);
  });
});
