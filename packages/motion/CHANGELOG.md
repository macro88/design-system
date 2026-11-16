# @macro88/motion

## 0.2.0

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
