# design-system

Neutral, unbranded foundation for macro88 apps. The catalogue, tokens, and themes are not filled in yet.

An app installs the shared library and one project theme:

```bash
pnpm add @macro88/design-system @macro88/theme-runifly
```

The other themes in this workspace are `@macro88/theme-nostr` and `@macro88/theme-exosquare`.

Released under the MIT licence.

## Prerequisites

- Node.js 26.13.0 (see `.nvmrc`)
- pnpm 12.18.0

## Install

```bash
pnpm install
```

## Scripts

```bash
pnpm lint
pnpm lint:visuals
pnpm typecheck
pnpm test
pnpm build
pnpm --filter @macro88/storybook dev
pnpm --filter @macro88/storybook build
```

`pnpm lint` runs ESLint, a Prettier check, and `lint:visuals`. `pnpm build` builds the library packages. Build the Storybook catalogue separately with the filter above.
