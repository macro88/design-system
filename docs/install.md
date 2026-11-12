# Install v{{VERSION}}

These packages are not published to npm. Install the tarballs attached to the GitHub release `v0.1.0`.

## Dependencies

`package.json`:

```json
{
  "dependencies": {
    "@macro88/theme-nostr": "https://github.com/macro88/design-system/releases/download/v{{VERSION}}/macro88-theme-nostr-{{VERSION}}.tgz",
    "@macro88/ui": "https://github.com/macro88/design-system/releases/download/v{{VERSION}}/macro88-ui-{{VERSION}}.tgz",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

`@macro88/ui` depends on `@macro88/tokens@0.1.0` and `@macro88/motion@0.1.0`. `@macro88/theme-nostr` depends on `@macro88/motion@0.1.0`. Point every `@macro88/*` package at its release tarball so pnpm does not look for them on npm.

pnpm 12 reads overrides from `pnpm-workspace.yaml`. It does not read a `pnpm` field in `package.json`.

`pnpm-workspace.yaml`:

```yaml
overrides:
  "@macro88/motion": "https://github.com/macro88/design-system/releases/download/v{{VERSION}}/macro88-motion-{{VERSION}}.tgz"
  "@macro88/theme-nostr": "https://github.com/macro88/design-system/releases/download/v{{VERSION}}/macro88-theme-nostr-{{VERSION}}.tgz"
  "@macro88/tokens": "https://github.com/macro88/design-system/releases/download/v{{VERSION}}/macro88-tokens-{{VERSION}}.tgz"
  "@macro88/ui": "https://github.com/macro88/design-system/releases/download/v{{VERSION}}/macro88-ui-{{VERSION}}.tgz"
```

Then run `pnpm install`. `@macro88/ui` also needs `react` and `react-dom` at `^19.0.0`, listed above.

The same release has `macro88-theme-runifly-{{VERSION}}.tgz`, `macro88-theme-exosquare-{{VERSION}}.tgz`, and `macro88-patterns-0.0.0.tgz`. Add one the same way if you use it: a dependency URL, plus an override for that package name. Checksums for every tarball are in `SHA256SUMS`.

## Stylesheet

In the Tailwind 4 entry file (Vite: `@tailwindcss/vite`):

```css
@import "tailwindcss";
@import "@macro88/tokens/theme.css";
@import "@macro88/motion/tokens.css";
@import "@macro88/theme-nostr/theme.css";
@import "@macro88/theme-nostr/motion.css";
@import "@macro88/ui/styles.css";
@source "../node_modules/@macro88/ui/dist";
```

`@source` is required. Component class names such as `bg-accent` live in the packed JavaScript, and Tailwind does not scan that file unless this line is present. The path is relative to the stylesheet. The example above assumes the stylesheet is in `src/` and `node_modules` is one directory up. Change the relative path if yours differs.

## Theme

Set both attributes on `<html>` or `<body>`:

```html
<html lang="en" data-theme="nostr" data-scheme="light"></html>
```

`data-scheme` is `light` or `dark`. Sonner appends toasts to `document.body`, so the attributes have to be on `html` or `body` for a toast to use the nostr colours. `data-theme="nostr"` on an inner element does style the components inside it, and leaves a toast on `body` on the default tokens.

## Badge

`Badge` takes a `tone` prop instead of `status`. `tone` is optional and defaults to `neutral`.

The status tokens are six tones: `neutral`, `accent`, `success`, `warning`, `danger`, and `info`. Each tone is the pair `--color-status-{tone}-fg` and `--color-status-{tone}-bg`. `@macro88/tokens` exports them as `statusTones`. The old status names `draft`, `queued`, `approved`, `signed`, `sent`, `failed`, and `missed` are not in these packages.
