# Component inventory

A census of every UI piece the five consuming extensions render in their popups and options pages, where each piece comes from, and where they disagree. It exists to decide what `@kud/webext-ui` grows next.

Ground rule for reading it: migrating an extension onto the system swaps imports and changes no pixels. Everything under [Convergence](#convergence-visual-changes) is a deliberate visual change, made afterwards, one decision at a time.

Content scripts are out of scope. Notionish restyles Google's DOM and has to win the cascade; Email Address Plus injects an inline-styled tooltip and floating icon into third-party pages. Neither is a popup or options surface, and neither should adopt the system.

Snapshot taken against `@kud/webext-ui` 0.3.0.

## What the system provides

Two CSS files, no JS. "Components" here are classes, modifiers and `data-` attributes over an HTML contract.

**Tokens** (`tokens.css`)

| Group    | Tokens                                                                                                           |
| -------- | ---------------------------------------------------------------------------------------------------------------- |
| Colour   | `--bg` `--fg` `--muted` `--faint` (non-text only) `--hover` `--border` `--border-control` `--success` `--danger` |
| Identity | `--accent` `--accent-fg` (overridden per extension in `theme.css`)                                               |
| Focus    | `--focus-ring` `--focus-ring-width` `--focus-ring-offset`                                                        |
| Spacing  | `--space-1` 4 · `-2` 8 · `-3` 12 · `-4` 16 · `-6` 24 · `-8` 32                                                   |
| Type     | `--font-sans` `--font-mono` · `--text-xs` 11 · `-sm` 12 · `-base` 14 · `-lg` 15 · line 1.2 / 1.4 / 1.6           |
| Radius   | `--radius-sm` 4 · `-md` 6 · `-lg` 8 · `-xl` 12 · `-pill`                                                         |
| Sizing   | `--control-height` 38 · `--popup-narrow` 260 · `--popup-wide` 360                                                |
| Motion   | `--dur-fast` 150ms · `--dur-slow` 300ms · `--ease`                                                               |

Dark mode flips colour and identity tokens under `prefers-color-scheme`.

**Classes** (`webext-ui.css`)

| Area       | Provides                                                                                                                                              |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Base       | reset, `[hidden]` made authoritative, global `:focus-visible` ring, reduced-motion kill switch                                                        |
| Layout     | `.popup` (narrow, padded) · `.popup-wide` (full-bleed) · `.page` · `.card` · `.stack` · `.cluster`                                                    |
| Type       | `h1`/`.title` · `.page h1`/`h2` · `.status` · `.hint` · `.section-title` · `.state` · `kbd` · `code`                                                  |
| Status dot | `.dot[data-tone="off\|idle\|ready\|on\|success"]`, distinguished by shape (thin ring, thick ring, solid)                                              |
| Rows       | `.row` · `.rows-divided` · `.row-bleed` · `.row-main` · `.row-text` · `.row-name` · `.row-match` · `.list` · `.reveal-on-hover`                       |
| Buttons    | `.btn` · `.btn-primary` · `.btn-block` · `.btn-icon`                                                                                                  |
| Forms      | text-like inputs, `select`, `textarea` · `:user-invalid` / `.is-invalid` · `.field-error` · `.field` · `.field-row` · `.field-inline` · `.field-note` |
| Toggle     | `.switch > input + .track > .thumb`                                                                                                                   |
| Badge      | `.badge` · `.badge-accent` · `.badge-success`                                                                                                         |

## Consumers at a glance

| Extension          | Surfaces       | How it gets the system | Archetype    | Accent (light / dark) | Local CSS                          |
| ------------------ | -------------- | ---------------------- | ------------ | --------------------- | ---------------------------------- |
| Email Address Plus | popup, options | npm import 0.3.0 (WXT) | narrow, page | `#0060df` / `#4f8cff` | `tooltip.css`, `options/index.css` |
| Gmeet Unmirror     | popup          | npm import 0.3.0 (WXT) | narrow       | `#1a73e8` / `#8ab4f8` | `popup.css` (one rule)             |
| Notionish          | popup, options | npm import 0.3.0 (WXT) | narrow, page | `#37352f` / `#e3e1dc` | `popup.css` (one rule)             |
| SmoothGPT          | popup          | vendored 0.2.0         | narrow       | default orange        | `popup.css` (three rules)          |
| Fox Hop            | popup          | vendored 0.2.0         | wide         | default orange        | `popup.css` (the bulk)             |

The two vendored copies are stamped 0.2.0 but their bodies are byte-identical to 0.3.0; only the header comment differs. A re-sync is a no-op visually.

## Inventory by piece

`S` = from the system · `L` = local · `—` = not rendered.

| Piece                      | Email Address Plus                                   | Gmeet Unmirror             | Notionish                              | SmoothGPT                         | Fox Hop                                                                   |
| -------------------------- | ---------------------------------------------------- | -------------------------- | -------------------------------------- | --------------------------------- | ------------------------------------------------------------------------- |
| Popup header               | S `.row`: emoji + `h1.title`, gear `.btn-icon`       | S `.cluster`: `.dot` + h1  | S `.cluster`: `.dot` + h1              | S `.row`: `.title` + `.badge`     | L `.header`: centred title at 15px, bottom rule, absolutely placed ⓘ link |
| Status line                | S `.status`, L `.status.error`                       | S `.status`                | S `.status`                            | —                                 | —                                                                         |
| Status dot                 | —                                                    | S `.dot` ready / on        | S `.dot` off / on                      | —                                 | L `.open-dot` (6px, `--fg`, present or absent)                            |
| Badge                      | S `.badge-success` "Saved" (options)                 | —                          | —                                      | S `.badge` / `.badge-accent`      | —                                                                         |
| Toggle row                 | —                                                    | S `label.row` + `.switch`  | S `label.row` + `.switch`              | S + L `.toggle-row` (rule above)  | —                                                                         |
| Checkbox                   | S `.field-inline`                                    | —                          | S `.field-inline`                      | —                                 | S `.field-inline`                                                         |
| Primary button             | —                                                    | S `.btn-primary.btn-block` | S `.btn-primary.btn-block`             | —                                 | S `.btn-primary` (Save)                                                   |
| Secondary button           | S `.btn` "Copy" (per history row)                    | —                          | S `.btn.btn-block`                     | —                                 | S `.btn` (Cancel)                                                         |
| Icon button                | S `.btn-icon` (SVG gear)                             | —                          | —                                      | —                                 | S `.btn-icon.reveal-on-hover` (★ ☆ ✎ ×), L `.info` link                   |
| Button group               | —                                                    | —                          | stacked full-width                     | —                                 | L `.editor-actions` (right-aligned, 8px gap)                              |
| Text input / select        | S (email, select)                                    | —                          | S (select)                             | —                                 | S (search, text ×3)                                                       |
| Field + label              | S `.field`                                           | —                          | S `.field`                             | —                                 | S `.field`                                                                |
| Field note / footnote      | L `.spoiler` (centred, italic, muted)                | —                          | S `.field-note`                        | —                                 | S `.field-note`                                                           |
| Invalid state              | L `input.invalid` (border colour only)               | —                          | —                                      | —                                 | — (relies on `:user-invalid`)                                             |
| Required marker            | L `.required` (red `*`)                              | —                          | —                                      | —                                 | —                                                                         |
| Hint / footer              | —                                                    | S `.hint` + L centred      | S `.hint` + L centred                  | S `.hint`                         | —                                                                         |
| Section heading            | S `.section-title`                                   | —                          | S `.page h2`                           | —                                 | S `.section-title` in L `.section` padding                                |
| Key / value list           | —                                                    | —                          | —                                      | S `dl.rows-divided` + L `dt`/`dd` | —                                                                         |
| List of rows               | S `.rows-divided > .row` (history)                   | —                          | —                                      | —                                 | S `.list > .row-bleed > .row-main`                                        |
| Row leading visual         | —                                                    | —                          | —                                      | —                                 | L `.monogram`, `.favicon`, `.action-icon` (all 24px)                      |
| Monospace value            | L `.history-email`, `.email-preview` block           | —                          | —                                      | —                                 | S `code` (inline)                                                         |
| Empty / error state        | via status line                                      | via status line            | via status line                        | via hint                          | S `.state`                                                                |
| Inset padding (wide popup) | —                                                    | —                          | —                                      | —                                 | L `.section`, `.search`, `.editor` (three paddings)                       |
| Separator between blocks   | —                                                    | —                          | —                                      | L `.toggle-row` border-top        | L `.header`, `.action` border-bottom                                      |
| Options page shell         | S `.page > .card.stack`, no `h1`                     | —                          | S `.page.stack`, `h1` + `h2`s, no card | —                                 | —                                                                         |
| Save feedback              | L slide-in `.save-indicator` around `.badge-success` | —                          | none (silent autosave)                 | —                                 | —                                                                         |
| Copy feedback              | L label swap "Copy" → "Copied", `aria-live`          | —                          | —                                      | —                                 | —                                                                         |
| Icons                      | emoji in titles (📧 ✅ ❌ ⚠️), one inline SVG        | —                          | —                                      | —                                 | Unicode glyphs (ⓘ + ★ ☆ ✎ ×)                                              |
| `kbd`                      | —                                                    | —                          | S                                      | —                                 | —                                                                         |

## Where they diverge

**Headers.** Five popups, four header shapes. Three are compositions of `.row` or `.cluster` and agree on 14px left-aligned titles. Fox Hop alone centres a 15px title, draws a bottom rule and pins its info link with `position: absolute`, which will collide with a longer title.

**Type scale.** Fox Hop uses `--text-lg` (15px) for its header and editor name; every other popup title is `--text-base` (14px). Options `h1` is 20px where present.

**Spacing in the wide archetype.** `.popup-wide` has no padding by design, so Fox Hop re-adds horizontal inset three times with three different vertical values (`.section` 12/16/4, `.search` 0/16/8, `.editor` 12/16/16). The horizontal 16px is consistent; the vertical rhythm is improvised.

**Separators.** Hairlines between blocks are hand-drawn in two extensions (`.toggle-row` border-top, `.header` and `.action` border-bottom) instead of coming from `.rows-divided` or a shared rule.

**Icons.** Three languages in one fleet: colour emoji (rendered differently per OS), Unicode glyphs at mixed sizes, and a single 16px stroke SVG. The SVG is the only one that inherits `currentColor` and therefore the hover and theme states.

**Hit targets.** Fox Hop's ⓘ link is a bare 16px glyph with no padding. Every other trailing control is a `.btn-icon` with 4px padding and a hover fill.

**Invalid state.** Email Address Plus toggles `.invalid`, which changes only the border colour at 1px: a colour-only signal. The system's `.is-invalid` doubles the edge weight so the state survives without colour. Same state, two treatments.

**Footnotes.** Email Address Plus' `.spoiler` (centred, italic) and Notionish's `.field-note` (left, regular) do the same job.

**Options page anatomy.** One options page is a titled document with sections; the other is a bare card with no heading at all.

**Two kinds of dot.** `.dot` (10px, shape-coded tones) and Fox Hop's `.open-dot` (6px, `--fg`, presence-coded). Both are legible without colour, but they are two vocabularies for "this is live".

**Colour-only meaning, checked.** Nothing in the popups relies on colour alone except the `.invalid` border above. `.dot` tones differ by shape, the favourite star swaps ★/☆, badges differ by fill and border, error status lines carry a ❌ or ⚠️ glyph, and the required `*` is a character.

**System-level note.** Placeholder text uses `--faint` (3.19:1 on `--bg`), and placeholder text answers to the 4.5:1 text bar. Worth a decision upstream: `--muted` passes, at the cost of looking closer to a typed value.

## Recommendation

Promote a piece when two extensions already build it, or when it is the missing slot of a component the system already ships. Everything else stays local until a second consumer appears.

### Promote to `@kud/webext-ui`

| Order | Name                          | Contract (the "props")                                                                                                                                                                                                              | Replaces                                                          | Visual change on adoption             |
| ----- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------- |
| 1     | `.hint-center`                | Modifier on `.hint`. `text-align: center`.                                                                                                                                                                                          | identical local overrides in Gmeet Unmirror and Notionish         | none                                  |
| 2     | `.inset`                      | Horizontal padding `0 var(--space-4)` for non-row content inside `.popup-wide`. Vertical spacing stays with the caller.                                                                                                             | the horizontal half of Fox Hop's `.section`, `.search`, `.editor` | none                                  |
| 3     | `.row-icon`                   | 24px square leading slot inside `.row-bleed` / `.row-main`, `--radius-md`. Modifiers: `.row-icon-monogram` (centred initial, 12px/600, background set by caller, caller owns contrast), and `img.row-icon` (`object-fit: contain`). | Fox Hop `.monogram`, `.favicon`, `.action-icon`                   | none                                  |
| 4     | `.actions`                    | Flex row of buttons, `gap: var(--space-2)`, `justify-content: flex-end`. Modifier `.actions-stretch` gives each child `flex: 1`.                                                                                                    | Fox Hop `.editor-actions`; ready for any confirm/cancel pair      | none                                  |
| 5     | `.status[data-tone="danger"]` | `color: var(--danger)`. Mirrors `.dot[data-tone]`. Text must still say what went wrong; the tone only reinforces it.                                                                                                                | Email Address Plus `.status.error`                                | none                                  |
| 6     | `hr` / `.rule`                | `border: 0; border-top: 1px solid var(--border); margin: 0`. A separator between blocks, placed between them rather than on either.                                                                                                 | SmoothGPT `.toggle-row` border, Fox Hop `.action` border          | none if spacing is kept by the caller |
| 7     | `.bar`                        | Header for `.popup-wide`: `.row` layout, `padding: var(--space-3) var(--space-4)`, bottom rule, title slot left, trailing slot for `.btn-icon` / `.badge`.                                                                          | Fox Hop `.header` + `.info`                                       | yes: see convergence                  |

Order rationale: 1 to 5 are pure class swaps that delete local CSS with zero pixel change, so each can land with a migration. 6 needs care with margins. 7 only makes sense alongside the header decision below.

### Keep local

- SmoothGPT's `dt` muted / `dd` tabular-figure styling. One consumer; if a second stat list appears, promote it as `.row-value`.
- Email Address Plus' monospace preview block and history email. One consumer, and `code` already covers the inline case.
- The success-checkmark bounce, the save-indicator slide-in, and the "Copy → Copied" label swap. Behaviour more than appearance, and single-use.
- The required `*`. One form, one field.
- Fox Hop's `.fav.is-on` accent and `.remove:hover` danger tint. Both are reinforcement on top of a glyph change or an aria label.
- Per-extension `theme.css`. That is the identity layer and belongs to each extension.

### Convergence (visual changes)

Each of these changes pixels, so each wants its own yes. In rough order of value:

1. **Email Address Plus: `.invalid` → `.is-invalid`.** Fixes the one colour-only signal in the fleet. Add a `.field-error` line with words while there.
2. **Fox Hop: ⓘ link → `a.btn-icon`.** Real hit target and hover state.
3. **Fox Hop: centred 15px header → `.bar`, left-aligned, 14px.** Matches the other four and removes the absolute positioning.
4. **Email Address Plus options: adopt the Notionish anatomy.** An `h1`, then sections; `.spoiler` becomes `.field-note`. Keep the card if it earns it; one of the two pages should not be the odd one out.
5. **Icon language.** Settle on inline SVG, 16px, `stroke="currentColor"`, 2px stroke, `aria-hidden="true"`, inside `.btn-icon` for controls. Retire emoji in titles; status glyphs (✓, ✕, !) as SVG keep their shape distinction without depending on OS emoji colour. Document this in the README as a convention, not a component: the system stays CSS-only.
6. **Fox Hop `.open-dot` → `.dot` with a small-size modifier.** One dot vocabulary. Needs a decision on whether "open" reads as `on` (accent) or stays `--fg`.
7. **Placeholder token** `--faint` → `--muted`, upstream.

Re-syncing SmoothGPT and Fox Hop to 0.3.0 can happen at any point; it is a header-comment change only.
