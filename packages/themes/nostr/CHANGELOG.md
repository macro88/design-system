# @macro88/theme-nostr

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

- b99b030: Add the neutral semantic token contract, shared motion primitives, and temporary theme palettes for the catalogue switcher.

### Patch Changes

- Updated dependencies [938277e]
- Updated dependencies [2fb30db]
- Updated dependencies [b99b030]
  - @macro88/motion@0.1.0
