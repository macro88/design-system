# Scheduler brand book

The visual and verbal identity for the local Nostr composer and scheduler. Keep this document at `docs/brand/nostr`.

The shared design system stays neutral. This brand lives only in `packages/themes/nostr`. Do not borrow colour, type, or decoration from other product themes.

British English in the product and in this book. Times use the 24-hour clock in the `en-GB` form: `Thu 12 Nov, 09:00`.

The page is cool layout-pad stock. Light is the default. Dark is a first-class green-black desk. The accent is a temporary placeholder, pending a choice.

---

## Principles

1. **The writing is the product.** Chrome stays out of the way. The composer is a generous page, not a form in a box. Notes are set in a text face with optical sizes; the rest of the interface is a quieter gothic.
2. **One pigment, one mark.** The accent is a temporary placeholder, pending a choice, and is reserved for the primary act, the caret, the focus ring, the now line, and the sign-off rule. Each now line and sign-off rule begins with a 6px square ink chop — the mark a nib makes when it first touches the page. Do not tint badges, chips, nav, or selected rows with the accent.
3. **Status is a word.** Draft, queued, approved, signed, and sent are sentence-case text in the column’s type. Only Failed and Missed may wear a capsule, because they are exceptions the writer must not miss.
4. **States are designed.** Empty, loading, and error are first-class layouts. Loading never reuses empty copy. Errors are plain language, never raw field or API names.
5. **Motion confirms the work.** It is playful and noticeable, then it stops. Typing, focus, and section keys stay instant. Reduced motion is honoured. Motion answers something the person did; it does not decorate a page load.
6. **Accessible by default.** Text meets AA (AAA wherever the tokens allow). Focus is visible. The full keyboard path works. Hit targets are generous.
7. **Density is purposeful.** A working inbox, log, or queue looks like work is present. Lists may fill the column and clip, rather than sit on leftover paper. Empty days in a week grid stay empty grid cells, not tall blank towers.

---

## Voice and microcopy

Short, plain, and specific. Address the work, not the reader’s emotions. No celebration copy, no exclamation marks in system text.

Buttons use verbs: Schedule, Approve, Sign, Discard, Publish due. Kind names are title case: Note, Thread, Reply. Status names are sentence case: Draft, Queued, Approved, Signed, Sent, Failed, Missed.

The in-app title reflects the section (Inbox, Compose, Queue, Log, Sign), never a frozen “Today”.

### Approved copy

| Situation                 | Copy                                                                                         |
| ------------------------- | -------------------------------------------------------------------------------------------- |
| Empty inbox               | Nothing is waiting.                                                                          |
| Empty inbox action        | Write a note                                                                                 |
| Empty queue (week)        | Nothing is scheduled this week.                                                              |
| Empty queue (day)         | Nothing is scheduled this day.                                                               |
| Empty log                 | Nothing has been sent yet.                                                                   |
| Empty sign                | Nothing is waiting to be signed.                                                             |
| Loading (accessible name) | Loading suggestions / Loading the queue / Loading the log                                    |
| Time too far ahead        | This time is further ahead than you can sign. Choose a time within the next seven days.      |
| Time in the past          | This time is in the past. Choose a time from now on.                                         |
| Save failed               | The note could not be saved. Try again.                                                      |
| Approve or reject failed  | That change could not be saved. Try again.                                                   |
| Signer missing            | No browser signer is available. Pair a bunker, or install a signer for this page.            |
| Signer did not respond    | The signer did not respond. Try again, or use a bunker.                                      |
| Invalid bunker link       | This bunker link is not valid.                                                               |
| Publish failed            | Publishing failed on every relay.                                                            |
| Signed time frozen        | This event is signed, so the time is frozen. Discard it and sign again to choose a new time. |
| Sign work waiting         | {n} waiting to be signed                                                                     |
| Sign pending              | Waiting for the signer                                                                       |
| Sign success              | Queued {n}                                                                                   |
| Bunker state              | Paired / Not paired                                                                          |
| Keyboard, inbox           | J and K to move, A to approve, E to edit, R to reject                                        |
| Character count           | {n} / 280                                                                                    |
| Publish control           | Publish due                                                                                  |

If a new error appears, write it in this voice. Never show `proposedFireAt`, `InputError`, status codes, or schema names to the reader.

---

## Colour

Light is the default. Dark is first-class and uses the same semantic tokens.

The page is a cool layout pad, slightly green-cast, not fashion cream and not a grey civic stock. Body ink is a green-black. The accent is a temporary placeholder, pending a choice, and is spent only on the primary fill, the caret, the focus ring, the now line, and the sign-off rule. The 6px ink chop at the start of those two rules uses the same accent, never a second colour.

Muted meets AAA on `bg` and `surface` in both themes, except `muted` on `selected` in light, which meets AA. Do not introduce a weaker “hint” colour.

### Token table

Semantic names are the design-system contract. The theme only supplies values.

| Semantic token     | CSS custom property        | Light (default) | Dark      | Role                                                               |
| ------------------ | -------------------------- | --------------- | --------- | ------------------------------------------------------------------ |
| `bg`               | `--color-bg`               | `#E4E9E6`       | `#121816` | Page paper / layout pad                                            |
| `surface`          | `--color-surface`          | `#F2F5F3`       | `#1A211F` | A fresh sheet: fields, raised event blocks, selected rows          |
| `text`             | `--color-text`             | `#141A18`       | `#E4EDE8` | Body and titles                                                    |
| `muted`            | `--color-muted`            | `#3C4C46`       | `#A8B8B2` | Secondary text, times, hints, ordinary status words                |
| `accent`           | `--color-accent`           | pending         | pending   | Primary fill, caret, focus ring, now line, sign-off rule, ink chop |
| `accent-fg`        | `--color-accent-fg`        | pending         | pending   | Accent as small text, if a link must be accented                   |
| `accent-on`        | `--color-accent-on`        | `#FFFFFF`       | `#121816` | Label on an accent fill                                            |
| `selected`         | `--color-selected`         | `#D8E0DC`       | `#242C29` | “This row” wash; never an accent tint                              |
| `today`            | `--color-today`            | `#EAF0EC`       | `#1E2623` | Today’s column in the week grid                                    |
| `border`           | `--color-border`           | `#C5CDC8`       | `#2A322F` | Decorative hairlines, always paired with spacing                   |
| `border-strong`    | `--color-border-strong`    | `#68716A`       | `#7E807A` | Inputs and outlined controls (3:1 against `bg` and `surface`)      |
| `focus`            | `--color-focus`            | pending         | pending   | Focus ring                                                         |
| `status.failed.fg` | `--color-status-failed-fg` | `#7A2428`       | `#E8A8A4` | Failed label and error text                                        |
| `status.failed.bg` | `--color-status-failed-bg` | `#F0D9D8`       | `#3A2424` | Failed capsule wash                                                |
| `status.missed.fg` | `--color-status-missed-fg` | `#5C4010`       | `#E0C98A` | Missed label                                                       |
| `status.missed.bg` | `--color-status-missed-bg` | `#EDE3C8`       | `#3A3320` | Missed capsule wash                                                |

Draft, queued, approved, signed, sent, rejected, and discarded use `muted` (or `text`) for the word. They have no background token and no capsule. Missed is separate from failed (a relay refusal) and from queued (still waiting).

`border` is decorative and sits below 3:1. It is never the only cue that a control exists. Inputs, outlined buttons, and other operable edges use `border-strong`.

Do not add an `accent-subtle` wash. Selection uses `selected`. Today uses `today`.

The dark accent is the same temporary placeholder, pending a choice. It is not a mint glow and not neon.

### Contrast results

Ratios use WCAG 2 relative luminance. **AAA** is 7:1 for normal text. **AA** is 4.5:1 for normal text and 3:1 for large text or UI components (including `focus` and `border-strong`).

#### Light

| Pair                       | Foreground | Background |   Ratio | Result  |
| -------------------------- | ---------- | ---------- | ------: | ------- |
| text / bg                  | `#141A18`  | `#E4E9E6`  | 14.36:1 | AAA     |
| text / surface             | `#141A18`  | `#F2F5F3`  | 16.07:1 | AAA     |
| text / selected            | `#141A18`  | `#D8E0DC`  | 13.11:1 | AAA     |
| text / today               | `#141A18`  | `#EAF0EC`  | 15.26:1 | AAA     |
| muted / bg                 | `#3C4C46`  | `#E4E9E6`  |  7.39:1 | AAA     |
| muted / surface            | `#3C4C46`  | `#F2F5F3`  |  8.27:1 | AAA     |
| muted / selected           | `#3C4C46`  | `#D8E0DC`  |  6.75:1 | AA      |
| muted / today              | `#3C4C46`  | `#EAF0EC`  |  7.85:1 | AAA     |
| accent / bg                | pending    | `#E4E9E6`  | pending | pending |
| accent / surface           | pending    | `#F2F5F3`  | pending | pending |
| accent-fg / bg             | pending    | `#E4E9E6`  | pending | pending |
| accent-fg / surface        | pending    | `#F2F5F3`  | pending | pending |
| accent-on / accent         | `#FFFFFF`  | pending    | pending | pending |
| focus / bg                 | pending    | `#E4E9E6`  | pending | pending |
| focus / surface            | pending    | `#F2F5F3`  | pending | pending |
| border-strong / bg         | `#68716A`  | `#E4E9E6`  |  4.11:1 | AA (UI) |
| border-strong / surface    | `#68716A`  | `#F2F5F3`  |  4.60:1 | AA (UI) |
| status.failed fg / badge   | `#7A2428`  | `#F0D9D8`  |  7.40:1 | AAA     |
| status.failed fg / bg      | `#7A2428`  | `#E4E9E6`  |  8.10:1 | AAA     |
| status.failed fg / surface | `#7A2428`  | `#F2F5F3`  |  9.06:1 | AAA     |
| text / status.failed bg    | `#141A18`  | `#F0D9D8`  | 13.12:1 | AAA     |
| muted / status.failed bg   | `#3C4C46`  | `#F0D9D8`  |  6.75:1 | AA      |
| status.missed fg / badge   | `#5C4010`  | `#EDE3C8`  |  7.48:1 | AAA     |
| status.missed fg / bg      | `#5C4010`  | `#E4E9E6`  |  7.79:1 | AAA     |
| status.missed fg / surface | `#5C4010`  | `#F2F5F3`  |  8.71:1 | AAA     |
| text / status.missed bg    | `#141A18`  | `#EDE3C8`  | 13.79:1 | AAA     |
| muted / status.missed bg   | `#3C4C46`  | `#EDE3C8`  |  7.10:1 | AAA     |

#### Dark

| Pair                       | Foreground | Background |   Ratio | Result  |
| -------------------------- | ---------- | ---------- | ------: | ------- |
| text / bg                  | `#E4EDE8`  | `#121816`  | 15.05:1 | AAA     |
| text / surface             | `#E4EDE8`  | `#1A211F`  | 13.72:1 | AAA     |
| text / selected            | `#E4EDE8`  | `#242C29`  | 11.98:1 | AAA     |
| text / today               | `#E4EDE8`  | `#1E2623`  | 12.96:1 | AAA     |
| muted / bg                 | `#A8B8B2`  | `#121816`  |  8.70:1 | AAA     |
| muted / surface            | `#A8B8B2`  | `#1A211F`  |  7.93:1 | AAA     |
| muted / selected           | `#A8B8B2`  | `#242C29`  |  6.93:1 | AA      |
| muted / today              | `#A8B8B2`  | `#1E2623`  |  7.49:1 | AAA     |
| accent / bg                | pending    | `#121816`  | pending | pending |
| accent / surface           | pending    | `#1A211F`  | pending | pending |
| accent-fg / bg             | pending    | `#121816`  | pending | pending |
| accent-fg / surface        | pending    | `#1A211F`  | pending | pending |
| accent-on / accent         | `#121816`  | pending    | pending | pending |
| focus / bg                 | pending    | `#121816`  | pending | pending |
| focus / surface            | pending    | `#1A211F`  | pending | pending |
| border-strong / bg         | `#7E807A`  | `#121816`  |  4.50:1 | AA (UI) |
| border-strong / surface    | `#7E807A`  | `#1A211F`  |  4.10:1 | AA (UI) |
| status.failed fg / badge   | `#E8A8A4`  | `#3A2424`  |  7.25:1 | AAA     |
| status.failed fg / bg      | `#E8A8A4`  | `#121816`  |  9.05:1 | AAA     |
| status.failed fg / surface | `#E8A8A4`  | `#1A211F`  |  8.25:1 | AAA     |
| text / status.failed bg    | `#E4EDE8`  | `#3A2424`  | 12.06:1 | AAA     |
| muted / status.failed bg   | `#A8B8B2`  | `#3A2424`  |  6.97:1 | AA      |
| status.missed fg / badge   | `#E0C98A`  | `#3A3320`  |  7.70:1 | AAA     |
| status.missed fg / bg      | `#E0C98A`  | `#121816`  | 11.04:1 | AAA     |
| status.missed fg / surface | `#E0C98A`  | `#1A211F`  | 10.06:1 | AAA     |
| text / status.missed bg    | `#E4EDE8`  | `#3A3320`  | 10.50:1 | AAA     |
| muted / status.missed bg   | `#A8B8B2`  | `#3A3320`  |  6.07:1 | AA      |

Use `accent` or `accent-fg` for any small accent text on `bg` and `surface`. Error text uses `status.failed.fg`, which meets AAA on `bg` and `surface` in both themes.

---

## Type

Load the faces through the theme. Do not rely on system UI fonts in production.

| Role                                     | Face           | Licence                                                                                                                        | Why                                                                                                                                                                                            |
| ---------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| UI, titles, wordmark, controls, metadata | Be Vietnam Pro | SIL Open Font License 1.1. Designed by Lam Bao, Tony Le and VietAnh Nguyen.                                                    | A sharp contemporary humanist, drawn so Vietnamese diacritics stay legible at small sizes. That care makes it trustworthy in dense chrome, times, and key caps.                                |
| The note itself                          | Literata       | SIL Open Font License 1.1. Designed by TypeTogether (Veronika Burian, José Scaglione and collaborators) for Google Play Books. | A screen-tuned text face with an optical-size axis (`opsz` 7–72). The composer, inbox reading pane, sign work, live excerpts, and calendar previews use it because the writing is the product. |
| Copyable values                          | IBM Plex Mono  | SIL Open Font License 1.1. Designed by Bold Monday for IBM.                                                                    | Only for values the person might copy: a bunker URI, an event id, a truncated npub. Never for section labels or atmosphere.                                                                    |

Be Vietnam Pro is for everything that is not the note. Do not introduce a third display face.

Apps load these faces. This repository does not ship a font package. Host Be Vietnam Pro, the Literata variable family (roman and italic, with the `opsz` and `wght` axes), and IBM Plex Mono in the app. The theme only names the stacks, each with a system fallback:

- `--font-display`: Be Vietnam Pro, then `ui-sans-serif, system-ui, sans-serif`
- `--font-body`: Literata, then `Iowan Old Style, Palatino, Palatino Linotype, serif`
- `--font-mono`: IBM Plex Mono, then `ui-monospace, monospace`

Long text sets `font-optical-sizing: auto` and `font-variation-settings` so `opsz` matches the size in the scale below. The theme classes are `literata-reading` (`opsz` 22), `literata-excerpt` (`opsz` 16), and `literata-preview` (`opsz` 12).

### Literata, optical size, and figures

Load the variable family with both the `opsz` (7–72) and `wght` (200–900) axes, in roman and italic. Set `font-optical-sizing: auto`, and also set `font-variation-settings` so the optical size matches the intended pixel size. Do not leave the axis at its default of 12 when the text is 20px or 22px — that is what makes the writing look blotchy and uneven.

| Use                                                | Size        | `opsz` |                                                     `wght` |
| -------------------------------------------------- | ----------- | -----: | ---------------------------------------------------------: |
| Composer and inbox or sign reading                 | 22px / 36px |     22 |                                                        400 |
| Sign work list (same as reading)                   | 22px / 36px |     22 |                                                        400 |
| List excerpts, log, day-view notes, quoted parents | 16px / 24px |     16 | 400 (600 only for the current draft in the composer queue) |
| Week-grid event previews                           | 12px / 16px |     12 |                                                        400 |

Literata uses lining figures (`lnum`) in this product, not old-style figures. Notes contain URLs, NIP numbers, and counts; mixed figure heights read as uneven. Times and numeric counts still belong on Be Vietnam Pro, with `font-variant-numeric: tabular-nums lining-nums`. Literata is not used for times.

### Scale

A major-third (1.25) ramp from a 16px body, with a slightly more open reading size for the writing itself. Tracking tightens as size grows and opens slightly at caption size. Display tracking never goes below −0.02em.

| Token       | Face           | Size | Line height | Weight     | Tracking | Use                                                              |
| ----------- | -------------- | ---- | ----------- | ---------- | -------- | ---------------------------------------------------------------- |
| `title-md`  | Be Vietnam Pro | 24px | 28px (1.17) | 600        | −0.02em  | Surface titles (“Write a note”, “Queue”)                         |
| `title-sm`  | Be Vietnam Pro | 18px | 24px (1.33) | 600        | −0.02em  | Panel titles (“Bunker”)                                          |
| `body-lg`   | Literata       | 22px | 36px (1.64) | 400        | −0.005em | Composer, inbox reading, sign work                               |
| `body-md`   | Be Vietnam Pro | 16px | 24px (1.50) | 400        | 0        | Default UI, button labels                                        |
| `body-note` | Literata       | 16px | 24px (1.50) | 400        | 0        | Note excerpts in lists and the log                               |
| `body-sm`   | Be Vietnam Pro | 14px | 20px (1.43) | 400 or 500 | 0        | Secondary actions, helpers, date controls                        |
| `caption`   | Be Vietnam Pro | 13px | 18px (1.38) | 500        | 0.01em   | Times, counts, keyboard hints, kickers that add a fact           |
| `micro`     | Be Vietnam Pro | 12px | 16px (1.33) | 500 or 600 | 0.01em   | Times inside the week grid, Failed and Missed capsules, key caps |

There is no `eyebrow` token. If a line adds a fact the title does not carry (for example “5 waiting” or “9–15 Nov”), set it in sentence case at `caption`, with normal tracking, beside or under the title. Otherwise the title stands alone.

### Writing measure

The composer text block is 60–66 characters, `max-width: 38rem`, at `body-lg`. The editor fills the remaining height of the write pane — a generous sheet, not a short boxed field. Schedule controls (date, count, actions, and any error) sit in a foot under a hairline at the bottom of that pane. Inbox and sign reading use the same size. List excerpts may clamp to two lines.

Do not set composer copy in a tight, heavily bordered textarea. Do not duplicate the editor text as a preview underneath it. The writing is the preview. The adjacent queue already shows the current draft in place.

---

## The ink chop and the sign-off rule

This is the one confident signature detail. It belongs to scheduling and signing, and nowhere else.

A 2px rule in `accent`, beginning with a 6px square of the same colour, flush to the start of the line, with no rounding. It is not a pill, not a badge, and not a left-edge stripe on a row.

Use it in two places only:

1. **The now line** on the week board and the day timetable. The line already marks the current time; the chop sits at its leading edge, like a nib first touching the page. The time in the gutter stays typographic (“15:05”) and has an accessible name, for example “Now, 15:05”.
2. **The sign-off rule** on the Sign surface, at the foot of the work list, on the measure of the notes. The primary “Sign {n} notes” button sits just under it, as if signing the page. “Sign with bunker” remains a quieter outline, enabled only when paired.

Do not put a chop next to the word Signed, on nav, on the composer date, or on every row. Rarity is what makes it mean something. There is no motion on the chop or the rule.

The nostr-only class is `ink-rule`: a 2px accent rule that starts with a 6px square chop, with square corners and no motion. Nothing in `packages/ui` references it.

---

## Spacing, radius, elevation, density

### Spacing scale

A 4px base. Use only these values: 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80.

Typical rhythm: page padding 28px at the 1280×800 reference frame (32px at a wider frame), header height 56px at that frame (64px at a wider frame), stacks 12–16px inside a group and 24–32px between groups, control height 44px for primary actions (36px is allowed for compact toolbar buttons; labels stay at 16px).

### Radius

| Token            | Role    | Value | Use                                                                                                                            |
| ---------------- | ------- | ----- | ------------------------------------------------------------------------------------------------------------------------------ |
| `radius-control` | control | 4px   | Buttons, inputs, date controls, checkboxes, tight calendar event blocks                                                        |
| `radius-panel`   | panel   | 8px   | The week board and the day timetable only. The composer, inbox, log, and sign work sit on the page paper with no outer radius. |
| `radius-badge`   | badge   | 999px | Capsule shape, and only for Failed and Missed. Ordinary status has no container.                                               |
| `radius-overlay` | menu    | 8px   | Menus, sheets, and toasts                                                                                                      |
| `radius-full`    | avatar  | 999px | Avatars and true toggles (switches, radios). Not checkboxes, not nav, not buttons, not tags, not the ink chop.                 |

Inner radius equals outer radius minus the padding between them, when a rounded child sits inside a rounded parent.

The ink chop is a square. It does not use `radius-badge` or `radius-control`.

### Elevation

Shadow and elevation tokens are owned by the design system, not by this book. Components consume `rest`, `hover`, and `lift`.

Resting surfaces are flat on the page, or separated by a single hairline. Do not put a soft shadow under every panel. Use lift for overlays, toasts, and a dragged queue item only.

### Density

Purposeful, not vacant. Related things sit close; unrelated things sit apart. A week of posts should look like a week of posts. Empty days stay short and quiet; they are not tall blank towers. A working inbox, log, or composer queue should fill its column — it may clip the last row — rather than leave a empty lower half of paper. The composer’s open writing area is not leftover space: it is the page being written on, anchored by the schedule foot. On Sign, space between the last note and the sign-off rule is the foot of the letter, not padding for its own sake.

---

## Iconography

A single open stroke set, rounded caps and joins, 1.5px stroke, sizes 16, 20, and 24. Icons sit beside type and never replace a label on a primary action. No container unless the container is the hit area. No emoji in product chrome. The specific library is an implementation detail, not a brand decision.

In the header, the profile control is the truncated `npub`, not a circular initial.

---

## Focus ring

A 2px solid `focus` ring, offset 2px, with no delay. It must appear on keyboard focus for every operable control, including navigation, calendar items, kind tabs, and the profile control — not only the button primitive.

The ring colour is the accent, which meets AA against `bg` and `surface` in both themes. `:focus-visible` is enough.

---

## Motion

Personality: playful, noticeable confirmation on a calm surface. Navigation, typing, and saving stay fast and never wait.

Timings, springs, reduced-motion rules, and the interaction tables live in the theme motion spec, shipped with `packages/themes/nostr`. Do not invent a second set of durations or springs here. Colour for checks and other chrome still comes from the tokens in this book (`accent`, not a one-off hex).

Two rules this theme adds on top of that spec:

- Do not scale cards or list rows on hover. Press feedback on buttons (a small scale or lift) is allowed.
- Loading skeletons are a static wash, or a single non-looping fade. They must not use a looping shimmer, pulse, or angled sweep. They appear after 200ms and stay at least 400ms. Reduced motion uses an instant swap or opacity only, with no transform.

The ink chop and the sign-off rule do not move.

---

## Empty, loading, and error

**Empty.** One honest sentence from the microcopy table, plus a single next step where one exists (for example “Write a note”). No illustration for its own sake. Never show keyboard hints as the only content on an empty surface. An empty inbox keeps the two-pane structure so the layout does not jump when the first suggestion arrives; the message and action stay at the top, and the button hugs its label.

**Loading.** A skeleton that follows the shape of the surface (list rows, day columns, or a work list). Show it only after 200ms, and keep it visible for at least 400ms so it does not flash. The region is `aria-busy="true"` and has an accessible name from the table. Do not paint empty copy while a request is in flight.

**Error.** Plain language from the table, set in `status.failed.fg`, next to the control that failed. Offer a next step when one exists. Pending buttons disable and keep their label.

---

## Wordmark and shell

The working wordmark is **Scheduler**, in Be Vietnam Pro, weight 600, with no mark, disc, or glyph beside it. Do not use a nostrich, a lightning bolt, or a borrowed social-network glyph.

Section navigation sits with the wordmark on the left. The selected section is weight 600 with a 2px ink underline. It is not a pill, and it does not use the accent. The profile control is a truncated npub on the right, with no circular initial.

Reference mocks are drawn at 1280×800.

---

## Surfaces

**Inbox.** A two-pane desk, split by a hairline. The list fills the left column. The reading pane sets the note at `body-lg`. Approve, Edit, and Reject sit at the foot of that pane.

**Composer.** A writing column and this week’s queue, split by a hairline. Kind tabs are typographic. The editor is a bare Literata sheet that fills the pane. There is no second copy of the text underneath it. Date, count, errors, and actions sit in the foot.

**Queue.** Week and day share the same chrome. The now line uses the ink chop. Today is marked. Times are visible and tabular.

**Sign.** This is the hero moment. The work list leads, set at `body-lg`, with the time in the status line, not stranded at the far edge of the column. The sign-off rule and the primary Sign button sit at the foot of the letter. Bunker is a quiet secondary column. The QR stays hidden until asked for.

**Log.** A typographic list of sent and failed notes, with plain-language relay outcomes. The list fills the column.

---

## Forbidden in this theme

These are defaults this product does not use. A later change needs a one-sentence reason, specific to Scheduler, written back into this book.

- Any gradient in a fill or in type.
- Fashion cream near `#F6F1E8` / `#F4F1EA` paired with terracotta, clay, sage, or olive as the accent.
- An `eyebrow` token, or uppercase labels with tracked-out letter-spacing.
- Inter, Geist, Roboto, Instrument Sans, Instrument Serif, Fraunces, Space Grotesk, Bricolage, Sora, Syne, Young Serif, DM Sans, Public Sans, or Source Serif. This theme’s faces are Be Vietnam Pro, Literata, and IBM Plex Mono.
- Lists built as a stack of nested cards. Inbox, queue, log, and sign lists are type, a gap or a hairline, and a selected wash.
- One generous radius on everything, or pill-shaped buttons, nav, chips, and ordinary tags. Full-round is for avatars and true toggles only. Failed and Missed are the only capsules. The ink chop is a square.
- A tinted badge on every row. Status colour alone is never the only cue.
- A centred hero, three equal feature cards, or luxury performed as leftover paper.
- Glass, aurora, neon glows, or mesh backgrounds. Dark is a green-black desk, not a halo.
- Glyphs in tinted circles or rounded squares, and emoji as UI icons.
- Lyrical interchangeable sample copy. Notes in mocks and tests should be mixed, slightly awkward, and about the work (links, replies, threads, mentions, a long line, a short one).
- A soft shadow under every surface, or a 1px border around every child of a panel.
- The starter shell: a disc logo, centred pill nav, and a circular initial avatar.
- Hover-scale on cards, fade-and-slide on every section, or a looping shimmer or pulse.
- Middle dots in meta strings (`Thu 12 Nov · 09:00`), announcement pills, numbered 01 / 02 / 03 markers, em-dash labels, a trailing “→” on links, and monospace used for atmosphere.
- Accenting a single word in a heading with italic, bold, or a second colour.
- Filler marketing words: seamless, unlock, supercharge, robust, magic.
- A muted colour weaker than the tokens above.
- A duplicate “how it will look” preview that repeats the editor text. The writing is the preview.
- Leaving Literata at a single optical size, or letting old-style figures into notes that contain URLs and NIP numbers.

---

## Do and don’t

Do: keep values in `packages/themes/nostr`; use semantic token names in components; write British English, including in public docs; spend the accent only on the act, the caret, the focus ring, the now line, and the sign-off rule; set Literata’s optical size to match the type size.

Don’t: hard-code hex in app UI; introduce a second accent; use a muted colour weaker than the tokens above; show raw API names; attribute this work to a tool or vendor in the product or the public repository.
