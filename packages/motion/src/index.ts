/** Intended path: packages/motion/src/index.ts */

export const packageName = "@macro88/motion";

/** Durations in milliseconds. Matches --motion-duration-* in tokens.css. */
export const durationMs = {
  instant: 0,
  fast: 120,
  base: 200,
  slow: 320,
  slower: 480,
  fade: 120,
} as const;

export type DurationToken = keyof typeof durationMs;

/** Durations in seconds, for Framer Motion tweens. */
export const duration = {
  instant: 0,
  fast: 0.12,
  base: 0.2,
  slow: 0.32,
  slower: 0.48,
  fade: 0.12,
} as const;

export const ease = {
  standard: [0.2, 0, 0, 1],
  exit: [0.4, 0, 1, 1],
  linear: [0, 0, 1, 1],
  emphasis: [0.22, 1.35, 0.36, 1],
} as const;

export type EaseToken = keyof typeof ease;
export type CubicBezier = (typeof ease)[EaseToken];

/**
 * Framer Motion: { type: "spring", ...spring.bouncy }.
 * snap, soft, layout are critically damped (ζ ≈ 1). No overshoot.
 * lively ζ ≈ 0.72. bouncy ζ ≈ 0.57.
 */
export const spring = {
  snap: { type: "spring", stiffness: 500, damping: 46, mass: 1 },
  soft: { type: "spring", stiffness: 260, damping: 32, mass: 1 },
  layout: { type: "spring", stiffness: 400, damping: 40, mass: 1 },
  lively: { type: "spring", stiffness: 380, damping: 28, mass: 1 },
  bouncy: { type: "spring", stiffness: 520, damping: 26, mass: 1 },
} as const;

export type SpringToken = keyof typeof spring;

export const cssVars = {
  duration: {
    instant: "--motion-duration-instant",
    fast: "--motion-duration-fast",
    base: "--motion-duration-base",
    slow: "--motion-duration-slow",
    slower: "--motion-duration-slower",
    fade: "--motion-duration-fade",
  },
  ease: {
    standard: "--motion-ease-standard",
    exit: "--motion-ease-exit",
    linear: "--motion-ease-linear",
    emphasis: "--motion-ease-emphasis",
  },
  spring: {
    snap: {
      stiffness: "--motion-spring-snap-stiffness",
      damping: "--motion-spring-snap-damping",
      mass: "--motion-spring-snap-mass",
    },
    soft: {
      stiffness: "--motion-spring-soft-stiffness",
      damping: "--motion-spring-soft-damping",
      mass: "--motion-spring-soft-mass",
    },
    layout: {
      stiffness: "--motion-spring-layout-stiffness",
      damping: "--motion-spring-layout-damping",
      mass: "--motion-spring-layout-mass",
    },
    lively: {
      stiffness: "--motion-spring-lively-stiffness",
      damping: "--motion-spring-lively-damping",
      mass: "--motion-spring-lively-mass",
    },
    bouncy: {
      stiffness: "--motion-spring-bouncy-stiffness",
      damping: "--motion-spring-bouncy-damping",
      mass: "--motion-spring-bouncy-mass",
    },
  },
} as const;

export type TweenTransition = {
  type: "tween";
  duration: number;
  ease: CubicBezier;
  delay?: number;
};

export type SpringTransition = (typeof spring)[SpringToken];

/** Tween for Framer Motion. `fade` is the only duration that should animate opacity under reduced motion. */
export function tween(
  token: Exclude<DurationToken, "instant">,
  easing: EaseToken = "standard",
  delay = 0,
): TweenTransition {
  const result: TweenTransition = {
    type: "tween",
    duration: duration[token],
    ease: ease[easing],
  };
  if (delay) result.delay = delay;
  return result;
}

/**
 * Apply prefers-reduced-motion to a transition.
 * Transforms and springs become 0ms. Opacity/colour may keep `fade`.
 * State changes (text, badge, disabled, presence) must still happen.
 */
export function reducedMotion(
  transition: TweenTransition | SpringTransition,
  prefersReduced: boolean,
  kind: "transform" | "opacity" = "transform",
): TweenTransition | SpringTransition {
  if (!prefersReduced) return transition;
  if (kind === "opacity") return tween("fade", "linear");
  return { type: "tween", duration: duration.instant, ease: ease.linear };
}
