# Syntax legibility: telling functions, strings and keywords apart

Type: prototype
Status: resolved

## Question

jass reviewed the void palette on the mocked editor (2026-08-29): contrast is pleasant, the ramp is right, but "I can't immediately make out what is a function, what is a string and what is what — I should be able to do that very easily," and the lime "is underutilized as far as the colours go."

That reopens two things [The role vocabulary](03-role-vocabulary.md) locked: *syntax is lightness only* and *the accent never colours syntax*. Reopened, not overruled — the question now is which single move buys instant recognition of function / string / keyword / type while staying monochrome + one accent:

1. The lime takes **one** syntax category (functions? strings?), the rest separates by dimming keywords and lifting identifiers.
2. No lime in syntax; instead use the full lightness range plus weight (keywords dimmed to `subtle`, functions `bright` + bold, strings distinguished by a treatment such as a faint surface highlight).
3. Faint hue tints on syntax roles (vague-style) — rejected in ticket 03, re-offered only because the requirement changed.

Prototype: [`prototype/syntax.html`](../prototype/syntax.html), `?variant=`. Decide, then amend `CONTEXT.md`'s syntax paragraph and the accent's job list.

## Answer

**E — "A + C".** Prototype: [`prototype/syntax.html?variant=E`](../prototype/syntax.html) (six variants kept for the record; jass leaned A+C over D, B "also looked good", C and F rejected).

The mapping, on the void palette:

| syntax role | value | style |
|---|---|---|
| function name / call / method | **accent** `#d4fd80` | — |
| type, class, JSX tag | **bright** `#f5f5f5` | — |
| identifier, variable, property, number | text `#cecece` | — |
| keyword, decorator, builtin literal (`null`, `true`, `self`) | subtle `#9b9b9b` | — |
| string, template literal | text `#cecece` on an **overlay `#1d1d1d` highlight** | — |
| operator, punctuation, bracket | muted `#6c6c6c` | — |
| comment | muted `#6c6c6c` | italic |

Three moves do the work, in order of effect: **keywords dim** to subtle so names come forward (jass confirmed "dimmed"); **functions take the lime** — the accent's one job in code, and the thing you scan for; **strings are boxed, not coloured** — a faint overlay behind them says "data" without a hue.

Two earlier decisions are amended, not silently overridden:

- [The role vocabulary](03-role-vocabulary.md): *"the accent never colours syntax"* → the accent has exactly one syntax job, function names. Strings are still never lime. The accent's job list in `CONTEXT.md` gains that entry. "A point, never an area" still holds — a function name is a point.
- [The palette](04-the-palette.md): *"three text steps, no `bright`"* → `bright` (`oklch(0.97 0 0)` / `#f5f5f5`) returns as a fourth text step, used for types only. The neutral ramp is eight greys. Contrast: 19.5:1 on base.

Rejected: B (lime strings — long strings put too much lime on screen), C (no lime — legible but the accent stayed idle, which was the complaint), D (two lime strengths in code — the accent stops being a point), F (strings at subtle — data faded too far).

## Second round (2026-09-02)

jass, after the readme shipped: "it looks nice, but it's not very utilitarian — less colours, less options of what it can do. Fix that aspect while staying true to the theme." Two findings under it:

1. The table used four greys and the lime, and nothing else. Identifiers, properties, parameters, numbers and strings were all `text`; keywords sat one step below. Flat by construction.
2. **VS Code ignores token backgrounds**, so in vs code / cursor / t3code strings were the same grey as identifiers with no box. The boxed string only ever existed in neovim.

Prototypes at [`proto/syntax.ts`](../proto/syntax.ts) (`bun .scratch/theme/proto/syntax.ts`, writes one png per variant, with and without token backgrounds, and `sheet.png`). Tried:

- **b · type** — italic grammar (keywords, `this`, builtins, decorators), bold definitions (function/method/class names where declared), italic parameters, bold constants. Every channel a monochrome theme still owns. Kept.
- **c · literal** — numbers and booleans boxed like strings. Single digits turned into little blocks that read as artifacts. Rejected.
- **d · tint / e · full** — ansi blue/magenta tints on keywords and values. At chroma 0.03 they are invisible beside the greys, and pushing chroma would break the premise. Rejected.
- **f · bright numbers** — b + literals on `bright`, strings dimmed to `subtle`. Dimmed strings were already rejected in round one ("data faded too far"), so not this.
- **g · bright literals** — f + strings on `bright`. The one taken: literals are the brightest grey, strings included, boxed where a port can box. Survives vs code's missing backgrounds because the string carries its own lightness.
- **h · bold numbers** — digits in bold shout. Rejected.

The rule now: *lightness, weight, slant and a box, plus one lime job.* `bright` is amended from "text that names a shape" to "text that is exactly what it says" — types, and literals. `palette.json`'s `syntax` table is the single source: `{ role, background?, bold?, italic? }` per token, read by the neovim groups (`{ syntax: "keyword" }` specs) and the vs code rules (ink + fontStyle). `function-definition`, `type-definition`, `parameter`, `constant`, `boolean`, `builtin`, `string-escape`, `regexp` are new tokens.
