---
"@macro88/tokens": minor
"@macro88/ui": patch
---

Disabled buttons use a neutral fill and muted text on every theme, instead of a faded accent. `--color-disabled-bg` follows the neutral status wash, and `--color-disabled-fg` follows muted text. A disabled button has a quiet border, no shadow, and no hover or press change. An `aria-disabled` button stays focusable, and neither a click nor Enter or Space runs its action.
