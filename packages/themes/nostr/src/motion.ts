import { duration, ease, spring } from "@macro88/motion";

/**
 * Playful, noticeable confirmation on a calm surface. Navigation, typing,
 * and saving stay fast. Cards and rows do not scale. The skeleton does not shimmer.
 * Elevation tokens are owned by the design system.
 */
export const motion = {
  navigate: { type: "tween", duration: duration.base, ease: ease.standard },
  feedback: { type: "tween", duration: duration.fast, ease: ease.standard },
  surface: { type: "tween", duration: duration.base, ease: ease.standard },
  exit: { type: "tween", duration: 0.16, ease: ease.exit },
  press: { type: "tween", duration: 0.08, ease: ease.standard },
  reorder: spring.lively,
  celebrate: spring.bouncy,
} as const;

export const feel = {
  sectionEnterY: 12,
  panelEnterY: 12,
  sheetEnterY: 28,
  sheetExitY: 16,
  toastEnterY: 12,
  toastExitY: 8,
  toastDropY: -8,
  toastGap: 8,
  toastInsetBottom: 24,
  toastMax: 3,
  hoverLift: -1,
  cardHoverLift: -2,
  rowHoverLift: -1,
  dragLiftY: -2,
  labelEnterY: 8,
  errorNudge: 6,
  errorNudgeDecay: 4,
  errorNudgeDuration: 0.36,
  errorNudgeCount: 2,
  hoverScale: 1.02,
  pressScale: 0.97,
  cardHoverScale: 1,
  dragLiftScale: 1.04,
  calendarLiftScale: 1.05,
  originSlotOpacity: 0.4,
  chipEndScale: 0.7,
  checkFromScale: 0.5,
  checkFromRotate: -12,
  toastDismissSuccessMs: 4000,
  toastDismissUndoMs: 6000,
  chipDuration: 0.24,
  checkDelay: 0.16,
  checkHold: 1.2,
  checkFade: 0.2,
  confirmStill: 0.7,
  slotHighlightDuration: 0.08,
  skeletonDelay: 0.2,
  skeletonMin: 0.4,
  arcSagittaRatio: 0.24,
  arcSagittaMin: 32,
  arcSagittaMax: 56,
} as const;

/** Elevation tokens from @macro88/tokens. */
export const elevation = {
  rest: "var(--elevation-rest)",
  hover: "var(--elevation-hover)",
  lift: "var(--elevation-lift)",
} as const;

export const colour = {
  check: "var(--color-accent)",
  skeleton: "var(--color-skeleton)",
} as const;

const tweenNav = motion.navigate;
const tweenFeedback = motion.feedback;
const tweenSurface = motion.surface;
const tweenExit = motion.exit;
const tweenPress = motion.press;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export type ChipArc = {
  x: number[];
  y: number[];
  times: number[];
  sagitta: number;
  control: { x: number; y: number };
};

/**
 * Quadratic Bézier from (0, 0) to (dx, dy), in pixels.
 * Sagitta (peak offset from the chord) is 24% of chord length, clamped 32–56px.
 * The control point sits on the upward screen perpendicular from the midpoint,
 * at 2 × sagitta, so the curve's peak at t = 0.5 equals the sagitta.
 * Five samples (t = 0, 0.25, 0.5, 0.75, 1) approximate the curve in Framer.
 * Prefer easing a single t 0→1 with `ease.emphasis` and evaluating the Bézier
 * if an exact curve is needed: B(t) = (1−t)² P0 + 2(1−t)t C + t² P2.
 */
export function chipArc(dx: number, dy: number): ChipArc {
  const len = Math.hypot(dx, dy) || 1;
  const sagitta = clamp(len * feel.arcSagittaRatio, feel.arcSagittaMin, feel.arcSagittaMax);
  let nx = -dy / len;
  let ny = dx / len;
  if (ny > 0) {
    nx = -nx;
    ny = -ny;
  }
  const times = [0, 0.25, 0.5, 0.75, 1];
  const control = { x: dx / 2 + nx * sagitta * 2, y: dy / 2 + ny * sagitta * 2 };
  const x: number[] = [];
  const y: number[] = [];
  for (const t of times) {
    const u = 1 - t;
    x.push(u * u * 0 + 2 * u * t * control.x + t * t * dx);
    y.push(u * u * 0 + 2 * u * t * control.y + t * t * dy);
  }
  return { x, y, times, sagitta, control };
}

const arcTween = {
  type: "tween" as const,
  duration: feel.chipDuration,
  ease: ease.emphasis,
  times: [0, 0.25, 0.5, 0.75, 1],
};

/** Path A: queue is on screen. Chip flies to the new slot and crossfades into the card. */
export function scheduleChipToSlot(dx: number, dy: number) {
  const arc = chipArc(dx, dy);
  return {
    initial: { opacity: 1, scale: 1, x: 0, y: 0 },
    animate: {
      x: arc.x,
      y: arc.y,
      scale: 1,
      opacity: [1, 1, 0],
      transition: {
        x: arcTween,
        y: arcTween,
        scale: { type: "tween", duration: feel.chipDuration, ease: ease.emphasis },
        opacity: {
          type: "tween",
          duration: feel.chipDuration,
          ease: ease.standard,
          times: [0, 0.67, 1],
        },
      },
    },
  };
}

/** Path B: queue is off screen. Chip flies to the Queue nav item and fades out. */
export function scheduleChipToNav(dx: number, dy: number) {
  const arc = chipArc(dx, dy);
  return {
    initial: { opacity: 1, scale: 1, x: 0, y: 0 },
    animate: {
      x: arc.x,
      y: arc.y,
      scale: feel.chipEndScale,
      opacity: [1, 1, 0],
      transition: {
        x: arcTween,
        y: arcTween,
        scale: { type: "tween", duration: feel.chipDuration, ease: ease.emphasis },
        opacity: {
          type: "tween",
          duration: feel.chipDuration,
          ease: ease.standard,
          times: [0, 0.67, 1],
        },
      },
    },
  };
}

export function scheduleChipReduced() {
  return {
    initial: { opacity: 0, scale: 1, x: 0, y: 0 },
    animate: {
      opacity: 0,
      scale: 1,
      x: 0,
      y: 0,
      transition: { type: "tween", duration: 0, ease: ease.linear },
    },
  };
}

/** Exact Framer Motion variants and transitions. Use with `mode="sync"`, never `mode="wait"`. */
export const transitions = {
  section: {
    initial: { opacity: 0, y: feel.sectionEnterY },
    animate: { opacity: 1, y: 0, transition: tweenNav },
    exit: {
      opacity: 0,
      y: 0,
      transition: { type: "tween", duration: duration.fast, ease: ease.exit },
    },
  },
  panel: {
    initial: { opacity: 0, y: feel.panelEnterY },
    animate: { opacity: 1, y: 0, transition: tweenSurface },
    exit: { opacity: 0, y: 0, transition: tweenExit },
  },
  sheet: {
    initial: { opacity: 0, y: feel.sheetEnterY },
    animate: { opacity: 1, y: 0, transition: motion.reorder },
    exit: {
      opacity: 0,
      y: feel.sheetExitY,
      transition: tweenExit,
    },
  },
  backdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: tweenSurface },
    exit: { opacity: 0, transition: tweenExit },
  },
  listExit: {
    exit: { opacity: 0, x: 12, transition: tweenExit },
  },
  listEnter: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: tweenFeedback },
  },
  buttonHover: {
    scale: feel.hoverScale,
    y: feel.hoverLift,
    boxShadow: elevation.hover,
    transition: tweenFeedback,
  },
  buttonPress: {
    scale: feel.pressScale,
    y: 0,
    boxShadow: elevation.rest,
    transition: tweenPress,
  },
  buttonRest: {
    scale: 1,
    y: 0,
    boxShadow: elevation.rest,
    transition: motion.reorder,
  },
  cardHover: {
    scale: feel.cardHoverScale,
    y: feel.cardHoverLift,
    boxShadow: elevation.hover,
    transition: tweenFeedback,
  },
  rowHover: {
    y: feel.rowHoverLift,
    transition: tweenFeedback,
  },
  queueLift: {
    scale: feel.dragLiftScale,
    y: feel.dragLiftY,
    boxShadow: elevation.lift,
    transition: tweenFeedback,
    zIndex: 2,
  },
  queueDrop: {
    scale: 1,
    y: 0,
    boxShadow: elevation.rest,
    transition: motion.reorder,
    zIndex: 0,
  },
  calendarLift: {
    scale: feel.calendarLiftScale,
    y: feel.dragLiftY,
    boxShadow: elevation.lift,
    transition: tweenFeedback,
    zIndex: 2,
  },
  calendarDrop: {
    scale: 1,
    y: 0,
    boxShadow: elevation.rest,
    transition: motion.reorder,
    zIndex: 0,
  },
  calendarReturn: {
    scale: 1,
    y: 0,
    boxShadow: elevation.rest,
    transition: motion.reorder,
  },
  slotHighlight: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { type: "tween", duration: feel.slotHighlightDuration, ease: ease.standard },
    },
    exit: {
      opacity: 0,
      transition: { type: "tween", duration: feel.slotHighlightDuration, ease: ease.exit },
    },
  },
  scheduleCheck: {
    initial: { opacity: 0, scale: feel.checkFromScale, rotate: feel.checkFromRotate },
    animate: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { ...motion.celebrate, delay: feel.checkDelay },
    },
  },
  scheduleCheckExit: {
    opacity: 0,
    transition: { type: "tween", duration: feel.checkFade, ease: ease.standard },
  },
  queueCard: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: tweenFeedback },
  },
  navHighlight: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { type: "tween", duration: feel.slotHighlightDuration, ease: ease.standard },
    },
    exit: { opacity: 0, transition: tweenSurface },
  },
  signCheck: {
    initial: { opacity: 0, scale: feel.checkFromScale, rotate: feel.checkFromRotate },
    animate: { opacity: 1, scale: 1, rotate: 0, transition: motion.celebrate },
  },
  progressFill: {
    transition: tweenSurface,
  },
  toast: {
    initial: { opacity: 0, y: feel.toastEnterY },
    animate: { opacity: 1, y: 0, transition: motion.reorder },
    exit: { opacity: 0, y: feel.toastExitY, transition: tweenExit },
  },
  toastDropOff: {
    opacity: 0,
    y: feel.toastDropY,
    transition: tweenExit,
  },
  /** Also used for inbox suggestion reject. */
  draftDiscard: {
    exit: { opacity: 0, x: 12, transition: tweenExit },
  },
  /** Also used to restore a rejected inbox suggestion at its old index. */
  draftRestore: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: tweenSurface },
  },
  errorNudge: {
    x: [0, feel.errorNudge, -feel.errorNudge, feel.errorNudgeDecay, -feel.errorNudgeDecay, 0],
    transition: {
      type: "tween",
      duration: feel.errorNudgeDuration,
      ease: ease.linear,
      times: [0, 0.2, 0.4, 0.6, 0.8, 1],
    },
  },
  layout: {
    layout: true,
    transition: motion.reorder,
  },
} as const;

const reducedTween = {
  type: "tween",
  duration: duration.fade,
  ease: ease.linear,
} as const;

const reducedInstant = {
  type: "tween",
  duration: duration.instant,
  ease: ease.linear,
} as const;

/** Framer Motion variants with transforms removed. Use when `useReducedMotion()` is true. */
export const transitionsReduced = {
  section: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: reducedTween },
    exit: { opacity: 0, transition: reducedTween },
  },
  panel: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: reducedTween },
    exit: { opacity: 0, transition: reducedTween },
  },
  sheet: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: reducedTween },
    exit: { opacity: 0, transition: reducedTween },
  },
  backdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: reducedTween },
    exit: { opacity: 0, transition: reducedTween },
  },
  listExit: {
    exit: { opacity: 0, transition: reducedTween },
  },
  listEnter: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: reducedTween },
  },
  buttonHover: { scale: 1, y: 0, boxShadow: elevation.rest, transition: reducedInstant },
  buttonPress: { scale: 1, y: 0, boxShadow: elevation.rest, transition: reducedInstant },
  buttonRest: { scale: 1, y: 0, boxShadow: elevation.rest, transition: reducedInstant },
  cardHover: { scale: 1, y: 0, boxShadow: elevation.rest, transition: reducedInstant },
  rowHover: { y: 0, transition: reducedInstant },
  queueLift: { scale: 1, y: 0, boxShadow: elevation.rest, transition: reducedInstant, zIndex: 2 },
  queueDrop: { scale: 1, y: 0, boxShadow: elevation.rest, transition: reducedInstant, zIndex: 0 },
  calendarLift: {
    scale: 1,
    y: 0,
    boxShadow: elevation.rest,
    transition: reducedInstant,
    zIndex: 2,
  },
  calendarDrop: {
    scale: 1,
    y: 0,
    boxShadow: elevation.rest,
    transition: reducedInstant,
    zIndex: 0,
  },
  calendarReturn: { scale: 1, y: 0, boxShadow: elevation.rest, transition: reducedInstant },
  slotHighlight: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: reducedTween },
    exit: { opacity: 0, transition: reducedTween },
  },
  scheduleCheck: {
    initial: { opacity: 0, scale: 1, rotate: 0 },
    animate: { opacity: 1, scale: 1, rotate: 0, transition: reducedTween },
  },
  scheduleCheckExit: {
    opacity: 0,
    transition: reducedTween,
  },
  queueCard: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: reducedTween },
  },
  navHighlight: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: reducedTween },
    exit: { opacity: 0, transition: reducedTween },
  },
  signCheck: {
    initial: { opacity: 0, scale: 1, rotate: 0 },
    animate: { opacity: 1, scale: 1, rotate: 0, transition: reducedTween },
  },
  progressFill: { transition: reducedInstant },
  toast: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: reducedTween },
    exit: { opacity: 0, transition: reducedTween },
  },
  toastDropOff: {
    opacity: 0,
    y: 0,
    transition: reducedTween,
  },
  draftDiscard: {
    exit: { opacity: 0, transition: reducedTween },
  },
  draftRestore: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: reducedTween },
  },
  errorNudge: { x: 0, transition: reducedInstant },
  layout: { layout: false, transition: reducedInstant },
} as const;
