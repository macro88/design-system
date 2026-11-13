---
"@macro88/motion": minor
"@macro88/theme-nostr": minor
---

Nostr motion adds move and sheet roles. Feedback uses the hover ease. The sheet enters with a drawer tween instead of a spring.

The sheet enter used to be `spring.lively`. It is now a 280ms tween on the drawer ease. The nostr exit is a 160ms strong ease-out, over 16px. `@macro88/motion` adds `ease.out` for that curve. `ease.exit` is unchanged.
