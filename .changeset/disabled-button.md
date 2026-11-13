---
"@macro88/tokens": minor
"@macro88/ui": patch
---

Disabled buttons use a neutral fill and muted text on every theme, instead of a faded accent. `--color-disabled-bg` follows the neutral status wash, and `--color-disabled-fg` follows muted text. Those aliases are declared again on `[data-theme]` and `[data-scheme]`, so they follow a theme set on an inner element rather than the base page. A disabled button has a quiet border, no shadow, and no hover or press change.

A pending button keeps its own fill and text colour, including an accent primary. It shows a spinner in the label colour, stays the same width, and uses a progress cursor. A click, Enter, or Space does not run its action. An `aria-disabled` button that is not busy stays focusable and likewise does not run its action.
