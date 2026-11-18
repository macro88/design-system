import { duration, ease, spring } from "@macro88/motion";

/**
 * Motion personality. Playful, noticeable motion only on feedback and
 * confirmation that earns it (schedule-confirm, drag lift, error nudge, undo).
 * Navigation, typing, hover, and saving stay fast and never wait.
 * Role names are the override API for other themes.
 *
 * Colour, elevation, and radius tokens are owned by the theme.
 * See docs/brand/nostr. Elevation names are rest, hover, and lift
 * (`--elevation-rest`, `--elevation-hover`, `--elevation-lift`).
 * The skeleton wash uses `--color-skeleton`.
 */
export const motion = {
  navigate: { type: "tween", duration: duration.instant, ease: ease.out },
  feedback: { type: "tween", duration: duration.fast, ease: ease.hover },
  surface: { type: "tween", duration: duration.base, ease: ease.out },
  exit: { type: "tween", duration: 0.16, ease: ease.out },
  press: { type: "tween", duration: 0.16, ease: ease.out },
  release: { type: "tween", duration: 0.12, ease: ease.out },
  move: { type: "tween", duration: 0.24, ease: ease.inOut },
  sheet: { type: "tween", duration: 0.28, ease: ease.drawer },
  reorder: spring.lively,
  celebrate: { type: "spring", stiffness: 560, damping: 32, mass: 1 },
} as const;

export const feel = {
  sectionEnterY: 0,
  panelEnterY: 0,
  sheetEnterY: 28,
  sheetExitY: 16,
  detailX: 28,
  toastEnterY: 12,
  toastExitY: 8,
  toastDropY: -8,
  toastGap: 8,
  toastInsetBottom: 24,
  toastMax: 3,
  dragLiftY: -2,
  errorNudge: 6,
  errorNudgeDecay: 4,
  errorNudgeDuration: 0.28,
  errorNudgeCount: 2,
  pressScale: 0.97,
  dragLiftScale: 1.04,
  calendarLiftScale: 1.05,
  originSlotOpacity: 0.4,
  chipEndScale: 0.7,
  checkFromScale: 0.92,
  checkFromRotate: 0,
  /** Offset of the check from the Schedule or Sign button, in px. */
  checkOffset: 8,
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
  skeletonEnter: 0.2,
  arcSagittaRatio: 0.24,
  arcSagittaMin: 32,
  arcSagittaMax: 56,
} as const;

/** Ink chop and sign-off rule. Static. No motion on the 2px rule or 6px square. */
export const inkChop = {
  thicknessPx: 2,
  squarePx: 6,
  radiusPx: 0,
  motion: "none",
} as const;

/**
 * Now line position. The line, the 6px square, and the 2px rule do not tween.
 * Position and the gutter time jump at most once a minute, with no animation.
 * On first paint the line is already at the correct time. No entrance motion.
 */
export const nowLine = {
  intervalMs: 60_000,
  position: "instant",
  entrance: "none",
  chop: "static",
} as const;

/** Elevation tokens from @macro88/tokens. */
export const elevation = {
  rest: "var(--elevation-rest)",
  hover: "var(--elevation-hover)",
  lift: "var(--elevation-lift)",
} as const;

/**
 * Colour tokens. See docs/brand/nostr.
 * `danger*` (`--color-danger-*`) is for fields and destructive actions.
 * `status*` (`--color-status-*`) is for status badges and status words.
 * Failed uses status danger. Missed uses status warning.
 */
export const colour = {
  bg: "var(--color-bg)",
  surface: "var(--color-surface)",
  text: "var(--color-text)",
  muted: "var(--color-muted)",
  accent: "var(--color-accent)",
  accentFg: "var(--color-accent-fg)",
  accentOn: "var(--color-accent-on)",
  selected: "var(--color-selected)",
  today: "var(--color-today)",
  border: "var(--color-border)",
  borderStrong: "var(--color-border-strong)",
  focus: "var(--color-focus)",
  dangerFg: "var(--color-danger-fg)",
  dangerBg: "var(--color-danger-bg)",
  statusDangerFg: "var(--color-status-danger-fg)",
  statusDangerBg: "var(--color-status-danger-bg)",
  warningFg: "var(--color-status-warning-fg)",
  warningBg: "var(--color-status-warning-bg)",
  /** Failed capsule. */
  failedFg: "var(--color-status-danger-fg)",
  failedBg: "var(--color-status-danger-bg)",
  /** Missed capsule: nostr maps missed to warning. */
  missedFg: "var(--color-status-warning-fg)",
  missedBg: "var(--color-status-warning-bg)",
  skeleton: "var(--color-skeleton)",
} as const;

/**
 * Radius token names. See docs/brand/nostr.
 * The ink chop is a square and uses no radius token.
 */
export const radius = {
  control: "var(--radius-control)",
  panel: "var(--radius-panel)",
  full: "var(--radius-full)",
  overlay: "var(--radius-overlay)",
} as const;

const tweenNav = motion.navigate;
const tweenFeedback = motion.feedback;
const tweenSurface = motion.surface;
const tweenExit = motion.exit;
const tweenPress = motion.press;
const tweenRelease = motion.release;
const tweenMove = motion.move;
const tweenSheet = motion.sheet;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export type ChipArc = {
  x: number[];
  y: number[];
  times: number[];
  sagitta: number;
  control: { x: number; y: number };
  bow: "up" | "right";
};

/**
 * Quadratic Bézier from (0, 0) to (dx, dy), in pixels.
 * Sagitta (peak offset from the chord) is 24% of chord length, clamped 32–56px.
 *
 * Bow rule, fitted to the Compose foot and the adjacent queue:
 * - Mostly horizontal (|dx| > |dy|): lift the midpoint straight up on screen,
 *   C = (M.x, M.y − 2S). Classic toss; does not bow back over the writing.
 * - Mostly vertical (|dy| ≥ |dx|): offset the midpoint to the right, toward
 *   the queue column, C = (M.x + 2S, M.y). Used when flying up to Queue nav.
 *
 * Five samples (t = 0, 0.25, 0.5, 0.75, 1) approximate the curve in Framer.
 * `t` is eased with `ease.inOut` (on-screen movement).
 * For an exact curve, animate t 0→1 and evaluate
 * B(t) = (1−t)² P0 + 2(1−t)t C + t² P2.
 */
export function chipArc(dx: number, dy: number): ChipArc {
  const len = Math.hypot(dx, dy) || 1;
  const sagitta = clamp(len * feel.arcSagittaRatio, feel.arcSagittaMin, feel.arcSagittaMax);
  const midX = dx / 2;
  const midY = dy / 2;
  const mostlyVertical = Math.abs(dy) >= Math.abs(dx);
  const bow: "up" | "right" = mostlyVertical ? "right" : "up";
  const control = mostlyVertical
    ? { x: midX + sagitta * 2, y: midY }
    : { x: midX, y: midY - sagitta * 2 };
  const times = [0, 0.25, 0.5, 0.75, 1];
  const x: number[] = [];
  const y: number[] = [];
  for (const t of times) {
    const u = 1 - t;
    x.push(u * u * 0 + 2 * u * t * control.x + t * t * dx);
    y.push(u * u * 0 + 2 * u * t * control.y + t * t * dy);
  }
  return { x, y, times, sagitta, control, bow };
}

const arcTween = {
  type: "tween" as const,
  duration: feel.chipDuration,
  ease: ease.inOut,
  times: [0, 0.25, 0.5, 0.75, 1],
};

/**
 * Path A: the adjacent Compose queue pane is on screen and the destination
 * row is in view. Chip flies to that typographic row and crossfades into it.
 */
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
        scale: tweenMove,
        opacity: {
          type: "tween",
          duration: feel.chipDuration,
          ease: ease.out,
          times: [0, 0.67, 1],
        },
      },
    },
  };
}

/**
 * Path B: the queue pane is off screen, or the destination row is scrolled
 * out of the pane. Chip flies to the Queue nav item in the header and fades.
 * Do not auto-scroll the pane mid-flight.
 */
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
        scale: tweenMove,
        opacity: {
          type: "tween",
          duration: feel.chipDuration,
          ease: ease.out,
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

/** Collapse a field to height 0. The arriving content uses feedback. Anything leaving uses the exit role. */
export const fieldCollapse = {
  outgoing: { opacity: 0, transition: tweenExit },
  incoming: { opacity: 1, transition: tweenFeedback },
  container: { height: 0, transition: tweenSurface },
} as const;

/** Expand a field to auto height. Incoming uses the feedback entrance. Outgoing uses the exit role. */
export const fieldExpand = {
  outgoing: { opacity: 0, transition: tweenExit },
  incoming: { opacity: 1, transition: tweenFeedback },
  container: { height: "auto", transition: tweenSurface },
} as const;

/** Push from a list into a detail. Detail enters from the right; the list leaves left. */
export const detailPush = {
  detail: {
    initial: { x: feel.detailX, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: tweenMove },
  },
  list: {
    exit: { x: -feel.detailX, opacity: 0, transition: tweenExit },
  },
} as const;

/** Pop from a detail back to the list. The mirror of detailPush. */
export const detailPop = {
  detail: {
    exit: { x: feel.detailX, opacity: 0, transition: tweenExit },
  },
  list: {
    initial: { x: -feel.detailX, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: tweenMove },
  },
} as const;

/** Exact Framer Motion variants. Section changes are instant. Never `mode="wait"`. */
export const transitions = {
  section: {
    initial: { opacity: 1, y: 0 },
    animate: { opacity: 1, y: 0, transition: tweenNav },
    exit: { opacity: 1, y: 0, transition: tweenNav },
  },
  panel: {
    initial: { opacity: 0, y: 0 },
    animate: { opacity: 1, y: 0, transition: tweenSurface },
    exit: { opacity: 0, y: 0, transition: tweenExit },
  },
  sheet: {
    initial: { opacity: 0, y: feel.sheetEnterY },
    animate: { opacity: 1, y: 0, transition: tweenSheet },
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
  /** Click / pointer list exit only. Keyboard approve and reject use listExitInstant. */
  listExit: {
    exit: { opacity: 0, x: 12, transition: tweenExit },
  },
  /** Keyboard `a` and `r`: unmount at once, no x, no layout spring. */
  listExitInstant: {
    exit: { opacity: 0, x: 0, transition: tweenNav },
  },
  listEnter: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: tweenFeedback },
  },
  buttonHover: {
    boxShadow: elevation.hover,
    transition: tweenFeedback,
  },
  buttonPress: {
    scale: feel.pressScale,
    boxShadow: elevation.rest,
    transition: tweenPress,
  },
  buttonRest: {
    scale: 1,
    boxShadow: elevation.rest,
    transition: tweenRelease,
  },
  cardHover: {
    boxShadow: elevation.hover,
    transition: tweenFeedback,
  },
  rowHover: {
    transition: tweenFeedback,
  },
  queueLift: {
    scale: feel.dragLiftScale,
    y: feel.dragLiftY,
    boxShadow: elevation.lift,
    transition: tweenSurface,
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
    transition: tweenSurface,
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
      transition: { type: "tween", duration: feel.slotHighlightDuration, ease: ease.out },
    },
    exit: {
      opacity: 0,
      transition: { type: "tween", duration: feel.slotHighlightDuration, ease: ease.out },
    },
  },
  scheduleCheck: {
    initial: { opacity: 0, scale: feel.checkFromScale, rotate: 0 },
    animate: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { ...motion.celebrate, delay: feel.checkDelay },
    },
  },
  scheduleCheckExit: {
    opacity: 0,
    transition: { type: "tween", duration: feel.checkFade, ease: ease.out },
  },
  queueCard: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: tweenSurface },
  },
  navHighlight: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { type: "tween", duration: feel.slotHighlightDuration, ease: ease.out },
    },
    exit: { opacity: 0, transition: tweenSurface },
  },
  signCheck: {
    initial: { opacity: 0, scale: feel.checkFromScale, rotate: 0 },
    animate: { opacity: 1, scale: 1, rotate: 0, transition: motion.celebrate },
  },
  progressFill: {
    // Use scaleX with transform-origin left, not width. Never the sign-off rule.
    transition: tweenSurface,
  },
  skeleton: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { type: "tween", duration: feel.skeletonEnter, ease: ease.out },
    },
  },
  toast: {
    initial: { opacity: 0, y: feel.toastEnterY },
    animate: { opacity: 1, y: 0, transition: tweenSurface },
    exit: { opacity: 0, y: feel.toastExitY, transition: tweenExit },
  },
  toastDropOff: {
    opacity: 0,
    y: feel.toastDropY,
    transition: tweenExit,
  },
  /** Also used for inbox suggestion reject on click. Keyboard reject uses listExitInstant. */
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
  reasonReveal: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: tweenFeedback },
    exit: { opacity: 0, transition: tweenExit },
  },
  qrReveal: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: tweenFeedback },
    exit: { opacity: 0, transition: tweenFeedback },
  },
  layout: {
    layout: true,
    transition: motion.reorder,
  },
  layoutInstant: {
    layout: false,
    transition: tweenNav,
  },
  fieldCollapse,
  fieldExpand,
  detailPush,
  detailPop,
} as const;

/** Pointer exits use listExit; keyboard `a` / `r` use listExitInstant. */
export function inboxRowExit(source: "keyboard" | "pointer") {
  return source === "keyboard" ? transitions.listExitInstant : transitions.listExit;
}

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
    initial: { opacity: 1 },
    animate: { opacity: 1, transition: reducedInstant },
    exit: { opacity: 1, transition: reducedInstant },
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
  listExitInstant: {
    exit: { opacity: 0, transition: reducedInstant },
  },
  listEnter: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: reducedTween },
  },
  buttonHover: { boxShadow: elevation.rest, transition: reducedInstant },
  buttonPress: { scale: 1, boxShadow: elevation.rest, transition: reducedInstant },
  buttonRest: { scale: 1, boxShadow: elevation.rest, transition: reducedInstant },
  cardHover: { boxShadow: elevation.rest, transition: reducedInstant },
  rowHover: { transition: reducedInstant },
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
  skeleton: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: reducedTween },
  },
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
  reasonReveal: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: reducedTween },
    exit: { opacity: 0, transition: reducedTween },
  },
  qrReveal: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: reducedTween },
    exit: { opacity: 0, transition: reducedTween },
  },
  layout: { layout: false, transition: reducedInstant },
  layoutInstant: { layout: false, transition: reducedInstant },
  fieldCollapse: {
    outgoing: { opacity: 0, transition: reducedTween },
    incoming: { opacity: 1, transition: reducedTween },
    container: { transition: reducedInstant },
  },
  fieldExpand: {
    outgoing: { opacity: 0, transition: reducedTween },
    incoming: { opacity: 1, transition: reducedTween },
    container: { transition: reducedInstant },
  },
  detailPush: {
    detail: {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: reducedTween },
    },
    list: {
      exit: { opacity: 0, transition: reducedTween },
    },
  },
  detailPop: {
    detail: {
      exit: { opacity: 0, transition: reducedTween },
    },
    list: {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: reducedTween },
    },
  },
} as const;

export function inboxRowExitReduced(source: "keyboard" | "pointer") {
  return source === "keyboard" ? transitionsReduced.listExitInstant : transitionsReduced.listExit;
}
