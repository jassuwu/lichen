# The palette: values for every role, contrast-checked

Type: prototype
Status: resolved
Blocked by: 03

## Question

What are the actual colour values?

Given the roles in `CONTEXT.md`, pick oklch values (chroma 0 for the seven greys; the lime is fixed at `oklch(0.9392 0.1588 124.39)` / `#d4fd80`; accent-quiet is the lime at reduced chroma; error/warning muted; the three ANSI tints at chroma ≤ ~0.03) and prove they work: build a throwaway swatch sheet plus a mocked-up code buffer and terminal screen, and iterate with jass until it reads right.

Contrast is a hard gate: primary text ≥ 7:1 on the editor background, secondary text ≥ 4.5:1, comments still legible, the lime as text on every grey it lands on ≥ 4.5:1. Check the semantic hues at the same time — they must be visible but must not out-shout the lime. Two more things to prove on real code and a real terminal: that lightness alone separates function / keyword / string / type (decide here whether `text` splits into a fourth step), and that the blue/magenta/cyan tints are distinguishable side by side.

Output: a single data table of role → value (oklch and hex) that ticket 05's palette source is transcribed from. Link the prototype; don't paste it.

## Answer

Prototype: [`prototype/palette.html`](../prototype/palette.html) — three ramps (`?variant=A|B|C`: ink `#0d0d0d`, graphite `#1b1b1b`, void `#040404`) over the same accent, hues and tints, each rendering swatches, live WCAG ratios, a mocked editor with diagnostics/diff/search/cursor, a terminal with prompt/`ls`/`git`/tests, and the ANSI 16. jass reviewed 2026-08-29 and chose **C — void**, with three text steps (no `bright`), hues and accent-quiet as shown.

One adjustment made after the choice, stated rather than asked: C's surfaces as prototyped barely separated from base (surface/base 1.04:1 — panels vanished). The final ramp keeps the chosen `#040404` base and widens the three surface steps (L .17/.23/.31 instead of .15/.21/.29), giving surface/base 1.07, overlay/base 1.22, border/base 1.55. Text values are untouched.

### Role → value

| role | oklch | hex |
|---|---|---|
| base | oklch(0.11 0 0) | `#040404` |
| surface | oklch(0.17 0 0) | `#0f0f0f` |
| overlay | oklch(0.23 0 0) | `#1d1d1d` |
| border | oklch(0.31 0 0) | `#303030` |
| muted | oklch(0.53 0 0) | `#6c6c6c` |
| subtle | oklch(0.69 0 0) | `#9b9b9b` |
| text | oklch(0.85 0 0) | `#cecece` |
| accent | oklch(0.9392 0.1588 124.39) | `#d4fd80` |
| accent-quiet | oklch(0.80 0.07 124.39) | `#b4c695` |
| on-accent | oklch(0.145 0 0) | `#0a0a0a` |
| error | oklch(0.70 0.13 22) | `#e47b79` |
| error, lighter (ansi 9) | oklch(0.78 0.13 22) | `#ff9492` |
| warning | oklch(0.80 0.11 82) | `#e1b767` |
| warning, lighter (ansi 11) | oklch(0.86 0.11 82) | `#f5ca7a` |
| blue-tint / lighter (ansi 4 / 12) | oklch(0.69 0.03 260) / oklch(0.85 0.03 260) | `#919cae` / `#c3cfe2` |
| magenta-tint / lighter (ansi 5 / 13) | oklch(0.69 0.03 330) / oklch(0.85 0.03 330) | `#a795a4` / `#dac7d7` |
| cyan-tint / lighter (ansi 6 / 14) | oklch(0.69 0.03 200) / oklch(0.85 0.03 200) | `#86a1a3` / `#b8d4d5` |

ANSI 16, in order: surface, error, accent-quiet, warning, blue-tint, magenta-tint, cyan-tint, text, muted, error-lighter, accent, warning-lighter, blue-tint-lighter, magenta-tint-lighter, cyan-tint-lighter, text. Diff backgrounds: 12% accent-quiet / 14% error / 12% warning mixed into base (oklab).

### Gates

text 13.0:1, subtle 7.4:1, muted 3.9:1 on base (gate 7 / 4.5 / 3); text 10.7:1 on overlay. Accent as text: 17.7:1 on base, 11.4:1 on border (worst case); accent-quiet 11.2:1; on-accent on accent 17.1:1. Error 7.2:1, warning 10.9:1 — visible, under the lime. Tints sit at subtle's lightness, so they are separated by hue only; they read as distinct side by side in the terminal mock, which is the whole job.

### Syntax mapping (three steps, decided — no `bright`)

keyword, function, type, identifier, number, property → **text**; string, operator, punctuation → **subtle**; comment → **muted italic**. jass ruled out the fourth step; if real code in the nvim port proves this too flat, that is a reopened decision, not a silent tweak.

Rejected: A ink and B graphite ramps; the `bright` split; louder or quieter hues; greener or greyer accent-quiet.

> **Amended by [Syntax legibility](14-syntax-legibility.md) (2026-08-29):** `bright` `oklch(0.97 0 0)` / `#f5f5f5` is back as a fourth text step (types only), and the syntax mapping above is superseded by that ticket's table. ANSI 15 (bright white) becomes `bright`.
