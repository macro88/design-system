# @macro88/motion

## 0.4.0

### Minor Changes

- 33d8fe5: Nostr motion v7. Navigation is instant. Surface, press, and release use the strong ease-out. The celebrate spring is tighter. Hover lift and hover scale are gone. Toasts enter with the surface tween.

  `@macro88/motion` adds `--motion-release-duration` and `--motion-release-ease` in `tokens.css`. Its JavaScript exports are unchanged. Themes may override the release role.

  Failed status colours on `@macro88/theme-nostr` use `--color-status-danger-fg` and `--color-status-danger-bg` (`colour.statusDangerFg` / `colour.statusDangerBg`, also `colour.failedFg` / `colour.failedBg`). Missed uses `--color-status-warning-fg` and `--color-status-warning-bg` (`colour.missedFg` / `colour.missedBg`). `--color-danger-fg` and `--color-danger-bg` stay for fields and destructive actions.

  `@macro88/theme-nostr` adds `inkChop`, `nowLine`, `radius`, `inboxRowExit`, and `inboxRowExitReduced`, and the transition keys `listExitInstant`, `layoutInstant`, `reasonReveal`, `qrReveal`, and `skeleton`.

  New classes: `.motion-skeleton`, `.motion-check`, and `.motion-hover-elevation`. `.ink-rule` reads `--motion-ink-chop-size` and `--motion-ink-chop-thickness` and does not animate.

  `chipArc` now returns a `bow` of `"up"` or `"right"`. Horizontal flights lift the midpoint; vertical flights bow it to the right. The arc eases with `ease.inOut` from `@macro88/motion`.

  ## Migration

  These names were on `@macro88/theme-nostr`, not `@macro88/motion`.

  Removed `feel` keys, with no replacement: `hoverLift`, `cardHoverLift`, `rowHoverLift`, `labelEnterY`, `hoverScale`, `cardHoverScale`.

  ```ts
  // 0.3.0
  transitions.buttonHover; // { scale: feel.hoverScale, y: feel.hoverLift, ... }

  // 0.4.0
  transitions.buttonHover; // { boxShadow: elevation.hover, transition: motion.feedback }
  ```

  `colour.check` is removed. Paint the check with `var(--motion-check-colour)`, which `.motion-check` already uses.

  ```ts
  // 0.3.0
  colour.check; // "var(--color-accent)"

  // 0.4.0
  // colour.check is not exported. Use the custom property.
  ```

  Removed custom properties, with no replacement: `--motion-hover-lift`, `--motion-card-hover-lift`, `--motion-row-hover-lift`, `--motion-label-enter-y`, `--motion-hover-scale`, `--motion-card-hover-scale`.

  Removed Tailwind utilities, with no replacement: `--scale-hover`, `--scale-card-hover`.

  `transitions.buttonRest` used `motion.reorder` (`spring.lively`). It now uses `motion.release`, a 120ms tween on `ease.out`. The toast enter used `motion.reorder`. It now uses `motion.surface`.

  ```ts
  // 0.3.0
  transitions.buttonRest.transition; // motion.reorder
  transitions.toast.animate.transition; // motion.reorder

  // 0.4.0
  transitions.buttonRest.transition; // motion.release
  transitions.toast.animate.transition; // motion.surface
  ```

  A section change no longer fades. `transitions.section` stays at full opacity and `feel.sectionEnterY` is `0`. `motion.navigate` is a 0ms tween on `ease.out`.

### Patch Changes

- 8057b84: A solid danger button is available for a confirming action. ConfirmSheet's destructive confirm changes appearance from the soft danger button to the solid danger button. Runifly and exosquare dark use a temporary solid danger until their brand direction is set.
- d808592: The sheet scrim is a dark wash. Light schemes use 40% opacity and dark schemes use 60%. A light scheme keeps 40% even inside a dark page. The nostr theme uses a neutral near-black, at 40% in light and 64% in dark.

  While a sheet is open, a toast sits at the top of a narrow viewport and above the sheet on a wider one, clear of the sheet actions.

- aafbc79: The switch is fully round. Its off thumb uses the strong border colour. Field hints and errors use the display face. An invalid field uses a danger focus ring. A switch can carry a hint, and its row is at least the control height.

  Apps that styled hints expecting the body face should add font-body.

## 0.3.0

### Minor Changes

- 1c75170: The confirm sheet takes its distance, duration, and ease from the active theme. Enter uses the sheet role. Exit uses the exit role. The backdrop uses the surface role on the way in and the exit role on the way out.

  `@macro88/motion` adds role timings for surface, sheet, and exit. Themes may override them.

- 0b00320: Nostr motion adds move and sheet roles. Feedback uses the hover ease. The sheet enters with a drawer tween instead of a spring.

  The sheet enter used to be `spring.lively`. It is now a 280ms tween on the drawer ease. The nostr exit is a 160ms strong ease-out, over 16px. `@macro88/motion` adds `ease.out` for that curve. `ease.exit` is unchanged.

## 0.1.0

### Minor Changes

- 938277e: Add skeleton, toast, and shimmer timing tokens.
- 2fb30db: Add the nostr theme, selected, today, and skeleton colours, and a switch for the skeleton animation.

  The skeleton shimmer is off by default for every theme, including runifly and exosquare. A theme opts in by setting `--skeleton-animation`.

  Out-of-tree themes must now define the colour roles `selected`, `today`, and `skeleton`, and `--font-mono`.

- b99b030: Add the neutral semantic token contract, shared motion primitives, and temporary theme palettes for the catalogue switcher.
