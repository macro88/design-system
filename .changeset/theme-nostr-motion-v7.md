---
"@macro88/motion": minor
"@macro88/theme-nostr": minor
---

Nostr motion v7. Navigation is instant. Surface, press, and release use the strong ease-out. The celebrate spring is tighter. Hover lift and hover scale are gone. Toasts enter with the surface tween.

`@macro88/motion` adds a release role. Themes may override it.

Failed status colours use `--color-status-danger-fg` and `--color-status-danger-bg` (`statusDangerFg` / `statusDangerBg`, also `failedFg` / `failedBg`). Missed uses `--color-status-warning-fg` and `--color-status-warning-bg`. The old missed status names are gone. `--color-danger-fg` and `--color-danger-bg` stay for fields and destructive actions. The log's failed explanation uses `--color-status-danger-fg`.

New exports: `inkChop`, `nowLine`, `radius`, `inboxRowExit`, `inboxRowExitReduced`, and the transition keys `listExitInstant`, `layoutInstant`, `reasonReveal`, `qrReveal`, and `skeleton`.

New classes: `.motion-skeleton`, `.motion-check`, and `.motion-hover-elevation`. `.ink-rule` reads the ink-chop size and thickness tokens and does not animate.

`chipArc` now returns a `bow` of `"up"` or `"right"`. Horizontal flights lift the midpoint; vertical flights bow it to the right. The arc eases with `ease.inOut`.

## Migration

Removed feel keys, with no replacement: `hoverLift`, `cardHoverLift`, `rowHoverLift`, `labelEnterY`, `hoverScale`, `cardHoverScale`.

`colour.check` is removed. The check colour is `var(--motion-check-colour)`.

Removed custom properties, with no replacement: `--motion-hover-lift`, `--motion-card-hover-lift`, `--motion-row-hover-lift`, `--motion-label-enter-y`, `--motion-hover-scale`, `--motion-card-hover-scale`.

Removed Tailwind utilities, with no replacement: `--scale-hover`, `--scale-card-hover`.

`buttonRest` and the toast enter used springs. They are tweens now (`release` and `surface`). A section change no longer fades. It swaps in place.
