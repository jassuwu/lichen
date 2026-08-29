# How the reference theme repos are built and named

Type: research
Status: resolved

## Question

How do tokyonight, rosé pine, catppuccin, kanso, vesper, oscura, flexoki, vague, zenbones and kanagawa structure, name, generate and distribute their ports — and what is the minimum role vocabulary a monochrome-plus-one-accent theme needs to still cover diffs, errors, warnings, strings and keywords without becoming rainbow?

Concretely: naming patterns (`<name>.nvim`, org-per-theme, name styling), where the palette lives and in what format, whether ports are templated (tool, template language) or hand-maintained, what's committed, license, the exact role lists rosé pine and catppuccin define, and the exact file formats/paths for nvim, ghostty, vscode (marketplace + open vsx), and web css.

A research agent was fired at charting time; findings land in [`research/how-theme-repos-are-built.md`](../research/how-theme-repos-are-built.md). Resolve by reading that file, checking its claims cite primary sources, and recording the gist here.

## Answer

Findings in [`research/how-theme-repos-are-built.md`](../research/how-theme-repos-are-built.md) — 70 primary-source citations, spot-checked (tokyonight's 48 generator scripts, kanso's 14 extras, catppuccin's palette.json all verified live). The gist:

**Two shapes exist.** (1) *Mono-repo with committed generated extras* — tokyonight, kanso, kanagawa, zenbones: one Lua table per variant, one generator script per target using `${key}` string interpolation, run headlessly (`nvim -l`), outputs committed under `extras/<target>/`. (2) *Org of repos plus a templating CLI* — catppuccin (`whiskers`, Tera templates, 362 repos), rosé pine (`@rose-pine/build`, 154 repos). Shape 2 pays off socially (community-maintained ports); shape 1 is what a solo maintainer wants and is what kanso itself chose. **Confirms jass's "one repo, generated ports" decision.** Note kanso/kanagawa commit extras with *no visible generator* — hand-maintained drift risk; tokyonight's committed generator layer is the model to copy.

**Naming.** One lowercase evocative word; repo is `<name>.nvim` when nvim is the flagship (tokyonight, kanso, vague, kanagawa) or bare `<name>` when it isn't (vesper, oscura, flexoki). Variants are mood words (`storm/moon/night`, `ink/mist/pearl/zen`), not "dark/light". Prose casing is free ("Kansō", "Tokyo Night"). VS Code ids are `<publisher>.<name>`; tokyonight's VS Code port lives in a *separate* community repo — a warning that the nvim-flagship layout doesn't naturally house a VS Code `package.json` at the root (ticket 05 must resolve this).

**Role vocabularies.** Rosé pine: 15 roles — `base/surface/overlay`, `muted/subtle/text`, six hues, three highlight steps. Catppuccin: 26 — 14 accents + `crust/mantle/base/surface0-2/overlay0-2/subtext0-1/text`. **The monochrome precedents keep 3–5 hues, never zero**: vesper = greys + mint + orange + a red reserved for errors; oscura = greys + 5 hues each owning exactly one syntax category; vague = ~22 roles where only `error/warning/hint` are saturated and every syntax role is a *desaturated near-grey tinted by hue-lean and lightness*. That last technique — differentiate by lightness and a whisper of tint, not by saturation — is the one to steal for ticket 03. Minimum set: 3–4 surface steps, 3 foreground steps, one accent, red (may be loud — it must alarm), amber, and a decision on whether green/info reuse the accent. A full 16-slot ANSI table is mandatory regardless.

**Formats.** Ghostty: extensionless `key = value` file in `~/.config/ghostty/themes/`; bundling into Ghostty itself goes through `mbadolato/iTerm2-Color-Schemes`. Neovim: `colors/<name>.lua` + `lua/<name>/`. VS Code: `package.json` `contributes.themes[]` → `themes/<name>.json` (`colors` + `tokenColors` + `semanticTokenColors`). CSS: `:root { --<name>-<role> }`; tokyonight also emits a Tailwind v4 `@theme inline` block with `oklch(from #hex l c h)`. Licenses: MIT everywhere except tokyonight (Apache-2.0).
