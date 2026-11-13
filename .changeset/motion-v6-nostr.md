---
"@macro88/motion": minor
"@macro88/theme-nostr": minor
---

Nostr motion adds move and sheet roles. Feedback uses the hover ease. The sheet enters with a drawer tween instead of a spring.

The sheet enter used to be `spring.lively`. It is now a 280ms tween on the drawer ease. The exit stays a 160ms ease-in, over 16px.
