import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { duration, ease, spring } from "@macro88/motion";
import {
  colour,
  detailPop,
  detailPush,
  feel,
  fieldCollapse,
  fieldExpand,
  inkChop,
  motion,
  nowLine,
  transitions,
  transitionsReduced,
} from "./motion";

const css = readFileSync(new URL("./motion.css", import.meta.url), "utf8");

function declarations(selector: string): Map<string, string> {
  const pattern = new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{([^}]*)\\}`);
  const body = css.match(pattern)?.[1] ?? "";
  const values = new Map<string, string>();
  for (const chunk of body.split(";")) {
    const colon = chunk.indexOf(":");
    if (colon === -1) continue;
    const name = chunk.slice(0, colon).trim();
    const value = chunk.slice(colon + 1).trim();
    if (name.startsWith("--")) values.set(name, value);
  }
  return values;
}

const theme = declarations('[data-theme="nostr"]');

function milliseconds(seconds: number): string {
  return `${Math.round(seconds * 1000)}ms`;
}

const feelCss = {
  sectionEnterY: ["--motion-section-enter-y", "px"],
  panelEnterY: ["--motion-panel-enter-y", "px"],
  sheetEnterY: ["--motion-sheet-enter-y", "px"],
  sheetExitY: ["--motion-sheet-exit-y", "px"],
  detailX: ["--motion-detail-x", "px"],
  toastEnterY: ["--motion-toast-enter-y", "px"],
  toastExitY: ["--motion-toast-exit-y", "px"],
  toastDropY: ["--motion-toast-drop-y", "px"],
  toastGap: ["--motion-toast-gap", "px"],
  toastInsetBottom: ["--motion-toast-inset-bottom", "px"],
  toastMax: ["--motion-toast-max", ""],
  dragLiftY: ["--motion-drag-lift-y", "px"],
  errorNudge: ["--motion-error-nudge", "px"],
  errorNudgeDecay: ["--motion-error-nudge-decay", "px"],
  errorNudgeDuration: ["--motion-error-nudge-duration", "s"],
  pressScale: ["--motion-press-scale", ""],
  dragLiftScale: ["--motion-drag-lift-scale", ""],
  calendarLiftScale: ["--motion-calendar-lift-scale", ""],
  originSlotOpacity: ["--motion-origin-slot-opacity", ""],
  chipEndScale: ["--motion-chip-end-scale", ""],
  checkFromScale: ["--motion-check-from-scale", ""],
  checkFromRotate: ["--motion-check-from-rotate", "deg"],
  checkOffset: ["--motion-check-offset", "px"],
  toastDismissSuccessMs: ["--motion-toast-dismiss-success", "ms"],
  toastDismissUndoMs: ["--motion-toast-dismiss-undo", "ms"],
  chipDuration: ["--motion-chip-duration", "s"],
  checkDelay: ["--motion-check-delay", "s"],
  checkHold: ["--motion-check-hold", "s"],
  checkFade: ["--motion-check-fade", "s"],
  confirmStill: ["--motion-confirm-still", "s"],
  slotHighlightDuration: ["--motion-slot-highlight-duration", "s"],
  skeletonDelay: ["--motion-skeleton-delay", "s"],
  skeletonMin: ["--motion-skeleton-min", "s"],
  skeletonEnter: ["--motion-skeleton-enter", "s"],
  arcSagittaRatio: ["--motion-arc-sagitta-ratio", ""],
  arcSagittaMin: ["--motion-arc-sagitta-min", "px"],
  arcSagittaMax: ["--motion-arc-sagitta-max", "px"],
} as const satisfies Record<
  Exclude<keyof typeof feel, "errorNudgeCount">,
  readonly [string, string]
>;

describe("nostr motion parity", () => {
  it("matches motion durations and springs to the custom properties", () => {
    expect(theme.get("--motion-navigate-duration")).toBe("0ms");
    expect(theme.get("--motion-navigate-ease")).toBe("var(--motion-ease-out)");
    expect(motion.navigate).toEqual({
      type: "tween",
      duration: duration.instant,
      ease: ease.out,
    });

    expect(theme.get("--motion-feedback-duration")).toBe("var(--motion-duration-fast)");
    expect(theme.get("--motion-feedback-ease")).toBe("var(--motion-ease-hover)");
    expect(motion.feedback).toEqual({
      type: "tween",
      duration: duration.fast,
      ease: ease.hover,
    });

    expect(theme.get("--motion-move-duration")).toBe(milliseconds(motion.move.duration));
    expect(theme.get("--motion-move-ease")).toBe("var(--motion-ease-in-out)");
    expect(motion.move).toEqual({ type: "tween", duration: 0.24, ease: ease.inOut });

    expect(theme.get("--motion-sheet-duration")).toBe(milliseconds(motion.sheet.duration));
    expect(theme.get("--motion-sheet-ease")).toBe("var(--motion-ease-drawer)");
    expect(motion.sheet).toEqual({ type: "tween", duration: 0.28, ease: ease.drawer });

    expect(theme.get("--motion-surface-duration")).toBe("var(--motion-duration-base)");
    expect(theme.get("--motion-surface-ease")).toBe("var(--motion-ease-out)");
    expect(motion.surface).toEqual({ type: "tween", duration: duration.base, ease: ease.out });

    expect(theme.get("--motion-exit-duration")).toBe(milliseconds(motion.exit.duration));
    expect(theme.get("--motion-exit-ease")).toBe("var(--motion-ease-out)");
    expect(motion.exit.ease).toEqual(ease.out);

    expect(theme.get("--motion-press-duration")).toBe(milliseconds(motion.press.duration));
    expect(theme.get("--motion-press-ease")).toBe("var(--motion-ease-out)");
    expect(motion.press).toEqual({ type: "tween", duration: 0.16, ease: ease.out });

    expect(theme.get("--motion-release-duration")).toBe(milliseconds(motion.release.duration));
    expect(theme.get("--motion-release-ease")).toBe("var(--motion-ease-out)");
    expect(motion.release).toEqual({ type: "tween", duration: duration.fast, ease: ease.out });

    expect(theme.get("--motion-reorder-stiffness")).toBe("var(--motion-spring-lively-stiffness)");
    expect(theme.get("--motion-reorder-damping")).toBe("var(--motion-spring-lively-damping)");
    expect(theme.get("--motion-reorder-mass")).toBe("var(--motion-spring-lively-mass)");
    expect(motion.reorder).toBe(spring.lively);

    expect(theme.get("--motion-celebrate-stiffness")).toBe("560");
    expect(theme.get("--motion-celebrate-damping")).toBe("32");
    expect(theme.get("--motion-celebrate-mass")).toBe("1");
    expect(motion.celebrate).toEqual({ type: "spring", stiffness: 560, damping: 32, mass: 1 });
  });

  it("matches every feel value to motion.css", () => {
    const mapped = new Set<keyof typeof feel>(Object.keys(feelCss) as Array<keyof typeof feelCss>);
    mapped.add("errorNudgeCount");
    expect(Object.keys(feel).sort()).toEqual([...mapped].sort());

    for (const key of Object.keys(feelCss) as Array<keyof typeof feelCss>) {
      const [name, unit] = feelCss[key];
      const value = feel[key];
      const expected =
        unit === "s" ? milliseconds(value) : unit === "ms" ? `${value}ms` : `${value}${unit}`;
      expect(theme.get(name), name).toBe(expected);
    }
  });

  it("enters the sheet with the drawer tween", () => {
    expect(transitions.sheet.animate.transition).toBe(motion.sheet);
    expect(transitions.sheet.exit.transition).toBe(motion.exit);
    expect(transitions.sheet.animate.transition).not.toHaveProperty("stiffness");
  });

  it("keeps reduced profile moves free of travel", () => {
    const reduced = {
      fieldCollapse: transitionsReduced.fieldCollapse,
      fieldExpand: transitionsReduced.fieldExpand,
      detailPush: transitionsReduced.detailPush,
      detailPop: transitionsReduced.detailPop,
    };
    const hits: string[] = [];
    const walk = (value: unknown, path: string) => {
      if (value === null || typeof value !== "object") return;
      if (Array.isArray(value)) {
        value.forEach((item, index) => walk(item, `${path}[${index}]`));
        return;
      }
      for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
        if (key === "x" || key === "y" || key === "scale" || key === "height")
          hits.push(`${path}.${key}`);
        walk(child, `${path}.${key}`);
      }
    };
    walk(reduced, "reduced");
    expect(hits).toEqual([]);
    expect(fieldCollapse.outgoing.transition).toBe(motion.exit);
    expect(fieldCollapse.incoming.transition).toBe(motion.feedback);
    expect(fieldExpand.incoming.transition).toBe(motion.feedback);
    expect(fieldExpand.outgoing.transition).toBe(motion.exit);
    expect(detailPush.detail.animate.transition).toBe(motion.move);
    expect(detailPop.list.animate.transition).toBe(motion.move);
  });

  it("collapses a field to height 0 and expands it to auto", () => {
    expect(fieldCollapse.container.height).toBe(0);
    expect(fieldCollapse.container.transition).toBe(motion.surface);
    expect(fieldExpand.container.height).toBe("auto");
    expect(fieldExpand.container.transition).toBe(motion.surface);
  });

  it("drops hover travel and keeps the toast enter on the surface tween", () => {
    for (const key of [
      "hoverLift",
      "cardHoverLift",
      "rowHoverLift",
      "labelEnterY",
      "hoverScale",
      "cardHoverScale",
    ]) {
      expect(feel).not.toHaveProperty(key);
    }
    expect(motion.navigate.duration).toBe(0);
    expect(motion.surface.ease).toBe(ease.out);
    expect(motion.release).toEqual({ type: "tween", duration: 0.12, ease: ease.out });
    expect(transitions.toast.animate.transition).toBe(motion.surface);
    expect(transitions.toast.animate.transition.type).toBe("tween");
    expect(transitions.section.exit.opacity).toBe(1);
    expect(transitions.section.exit.transition.duration).toBe(0);
    expect(transitions.slotHighlight.exit.transition.ease).toEqual(ease.out);
    expect(transitions.listExitInstant.exit.transition.duration).toBe(0);
  });

  it("maps status colours to the status family and danger to fields", () => {
    expect(colour.statusDangerFg).toBe("var(--color-status-danger-fg)");
    expect(colour.statusDangerBg).toBe("var(--color-status-danger-bg)");
    expect(colour.failedFg).toBe(colour.statusDangerFg);
    expect(colour.failedBg).toBe(colour.statusDangerBg);
    expect(colour.missedFg).toBe("var(--color-status-warning-fg)");
    expect(colour.missedBg).toBe("var(--color-status-warning-bg)");
    expect(colour.warningFg).toBe("var(--color-status-warning-fg)");
    expect(colour.warningBg).toBe("var(--color-status-warning-bg)");
    expect(colour.dangerFg).toBe("var(--color-danger-fg)");
    expect(colour.dangerBg).toBe("var(--color-danger-bg)");
    expect(colour.skeleton).toBe("var(--color-skeleton)");
    expect(Object.values(colour).join(" ")).not.toContain("status-missed");
  });

  it("matches the ink chop and the now line to their custom properties", () => {
    expect(theme.get("--motion-ink-chop-size")).toBe(`${inkChop.squarePx}px`);
    expect(theme.get("--motion-ink-chop-thickness")).toBe(`${inkChop.thicknessPx}px`);
    expect(theme.get("--motion-now-line-interval")).toBe(`${nowLine.intervalMs}ms`);
  });

  it("enters the skeleton with the skeleton-enter tween", () => {
    expect(transitions.skeleton.animate.transition).toEqual({
      type: "tween",
      duration: feel.skeletonEnter,
      ease: ease.out,
    });
    expect(theme.get("--motion-skeleton-enter")).toBe(milliseconds(feel.skeletonEnter));
  });

  it("keeps the skeleton wash static", () => {
    expect(theme.get("--skeleton-animation")).toBe("none");
    expect(theme.get("--motion-check-colour")).toBe("var(--color-accent)");
  });
});
