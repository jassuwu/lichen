# The role vocabulary: how many colours, and what each one means

Type: grilling
Status: resolved
Blocked by: 01

## Question

What are the named roles of this palette, and how many hues does "monochrome + lime" actually permit?

This is the central design decision. The thesis is one colour; the constraint is that errors, warnings, diffs, strings and keywords must still read as different things without One Dark's rainbow. Decide, with jass:

1. **The grey ramp** — how many steps (rosé pine has base/surface/overlay + muted/subtle/text; catppuccin has crust→base→mantle + surface0–2 + overlay0–2 + subtext + text), and the exact roles: page/editor bg, panels, floating windows, borders, comments, secondary text, primary text.
2. **The lime's jobs** — which surfaces get it: cursor? selection? current line number? active statusline segment? prompt char? matching bracket? search? Fewer is stronger; jass.gg limits it to exactly four things. Decide the list and forbid the rest.
3. **Syntax without hue** — how the greys alone separate keywords, identifiers, strings, comments, types (weight? lightness steps? italics?). Look at what vesper/oscura/vague do (ticket 01).
4. **The semantic hues** — red/yellow/blue(/magenta) for errors, warnings, info, diff add/remove/change, git status. Muted-and-desaturated (vesper style) or full-strength? Does *diff added* use the lime, or does that dilute it? Is *green* ever a separate colour from the lime?
5. **The 16 ANSI colours** — a terminal needs all sixteen; a monochrome theme fills most of them with greys. Decide the mapping so `ls`, `git`, tests and TUIs still work.

Output: a role list with a one-line meaning per role, ready for ticket 04 to assign values to. Record it in `CONTEXT.md` (glossary of roles; no hex values there).

## Answer

The vocabulary is recorded in [`CONTEXT.md`](../../../CONTEXT.md) — that file is the canonical role list; this answer is the reasoning and the decisions jass made (2026-08-29, two grilling rounds; the lime's jobs were delegated to the agent).

**Three families, nothing else.** A neutral ramp of **seven chroma-0 greys** — four surfaces (`base`, `surface`, `overlay`, `border`) and three texts (`text`, `subtle`, `muted`) — one **accent** in two strengths (`accent`, `accent-quiet`, plus `on-accent`), and **two muted semantic hues** (`error` red, `warning` amber).

**Syntax is lightness, not hue.** jass rejected both vague-style faint tints and lime-for-strings. Keywords, functions, types, strings and comments separate by text step; comments alone are italic. One knob left open for the palette ticket: `text` may split into two lightness steps if three can't tell functions from keywords — a fourth text step, never a hue.

**The lime's jobs (agent's pick, tight on purpose):** cursor (editor + terminal), prompt character, active indicator (statusline mode, active tab marker, focused split border), search / current-match fill with `on-accent` text, matching bracket. *A point, never an area.* Selection is `overlay` grey. Diff-added, links and git-new state are **accent-quiet** — the lime desaturated, jass.gg's `accent-quiet` carried over — which also answers the fog item "does the lime need a quiet strength": yes, and this is it.

**Semantic hues, muted:** error = red (errors, diff deleted, failed tests; loudest thing allowed), warning = amber (warnings, diff changed, git modified). Info is `subtle`, hint is `muted`; no blue.

**ANSI 16 — the one chroma exception.** Blue, magenta and cyan slots are *tinted greys*: neutral lightness with chroma capped ~0.03, leaning their hue so `ls`/`git`/TUIs keep distinct categories. Green = accent-quiet, bright green = accent; red/yellow = error/warning; black/bright-black = surface/muted; white/bright-white = text/brightest. Full table in CONTEXT.md.

**Rejected:** catppuccin-depth ramp (10+), 6-step ramp, full-strength alarms, a third (blue) hue, lime selection, bold keywords, lime diff-add.

Consequence for [The palette](04-the-palette.md): the contrast gate now also has to prove that lightness alone separates function / keyword / string / type on real code, and that three chroma-capped tints are distinguishable side by side in a terminal.
