# @macro88/ui

## 0.1.0

### Minor Changes

- 2fb30db: Add the nostr theme, selected, today, and skeleton colours, and a switch for the skeleton animation.

  The skeleton shimmer is off by default for every theme, including runifly and exosquare. A theme opts in by setting `--skeleton-animation`.

  Out-of-tree themes must now define the colour roles `selected`, `today`, and `skeleton`, and `--font-mono`.

- dd8d51e: Add unbranded controls, fields, status badges, surfaces, and type utilities.
- ce3d98a: Add skeleton, empty state, form messages, toasts, and the confirm sheet.

### Patch Changes

- Updated dependencies [119da6e]
- Updated dependencies [938277e]
- Updated dependencies [ce3d98a]
- Updated dependencies [2fb30db]
- Updated dependencies [b99b030]
  - @macro88/tokens@0.1.0
  - @macro88/motion@0.1.0
