# @macro88/motion

## 0.1.0

### Minor Changes

- 938277e: Add skeleton, toast, and shimmer timing tokens.
- 2fb30db: Add the nostr theme, selected, today, and skeleton colours, and a switch for the skeleton animation.

  The skeleton shimmer is off by default for every theme, including runifly and exosquare. A theme opts in by setting `--skeleton-animation`.

  Out-of-tree themes must now define the colour roles `selected`, `today`, and `skeleton`, and `--font-mono`.

- b99b030: Add the neutral semantic token contract, shared motion primitives, and temporary theme palettes for the catalogue switcher.
