# @macro88/ui

## 0.2.0

### Minor Changes

- 990c388: Buttons, fields, and other controls use the display face. Body type classes still set the size, and prose keeps the body face. Toasts are a raised surface with padding, a border, and a lifted shadow, set in the display face.

  If app prose used `type-body-lg`, `type-body-md` or `type-body-sm` to get the body face, add `font-body` to it.

### Patch Changes

- 5ee4ae9: Disabled buttons use a neutral fill and muted text on every theme, instead of a faded accent. `--color-disabled-bg` follows the neutral status wash, and `--color-disabled-fg` follows muted text. Those aliases are declared again on `[data-theme]` and `[data-scheme]`, so they follow a theme set on an inner element rather than the base page. A disabled button has a quiet border, no shadow, and no hover or press change.

  A pending button keeps its own fill and text colour, including an accent primary. It shows a spinner in the label colour, stays the same width, and uses a progress cursor. A click, Enter, or Space does not run its action. An `aria-disabled` button that is not busy stays focusable and likewise does not run its action.

- Updated dependencies [5ee4ae9]
  - @macro88/tokens@0.2.0

## 0.1.0

### Minor Changes

- Replace app-specific status colours with six general tones: neutral, accent, success, warning, danger, and info. Each tone is a foreground and background pair, `--color-status-{tone}-fg` and `--color-status-{tone}-bg`. The old names are removed, with no aliases.

  `Badge` takes a `tone` prop, defaulting to `neutral`, instead of `status`. The capsule uses `--radius-full`.

  Apps map their own status words onto these tones. For example, nostr maps failed to danger and missed to warning.

  | Old token                    | New token                   |
  | ---------------------------- | --------------------------- |
  | `--color-status-failed-fg`   | `--color-status-danger-fg`  |
  | `--color-status-failed-bg`   | `--color-status-danger-bg`  |
  | `--color-status-missed-fg`   | `--color-status-warning-fg` |
  | `--color-status-missed-bg`   | `--color-status-warning-bg` |
  | `--color-status-draft-fg`    | removed                     |
  | `--color-status-draft-bg`    | removed                     |
  | `--color-status-queued-fg`   | removed                     |
  | `--color-status-queued-bg`   | removed                     |
  | `--color-status-approved-fg` | removed                     |
  | `--color-status-approved-bg` | removed                     |
  | `--color-status-signed-fg`   | removed                     |
  | `--color-status-signed-bg`   | removed                     |
  | `--color-status-sent-fg`     | removed                     |
  | `--color-status-sent-bg`     | removed                     |

  Tokens with no previous name: `--color-status-neutral-fg`, `--color-status-neutral-bg`, `--color-status-accent-fg`, `--color-status-accent-bg`, `--color-status-success-fg`, `--color-status-success-bg`, `--color-status-info-fg`, and `--color-status-info-bg`.

  ### Exports
  - `@macro88/tokens` renames `statusRoles` to `statusTones` and `StatusRole` to `StatusTone`, with no aliases.
  - `statusColorVar` now takes a tone.
  - `tone` on `Badge` is optional and defaults to `neutral`.

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
