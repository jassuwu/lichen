# Map: lichen — a monochrome + lime theme

## Destination

jass is **running the theme every day** — in Neovim, Ghostty and Cursor, on this machine, installed from a repo of his own — and has stopped wanting to switch back. Alongside the three daily drivers: herdr's UI matches, the p10k prompt matches, a generated wallpaper matches, and the VS Code theme is **published on Open VSX** so t3code can import it.

The map carries execution, not just decisions: it ends at a lived-in v0, not a tagged v1 across every conceivable target.

## Notes

**Domain: colour-theme design and multi-target theme packaging.** Working dir is `~/repos/personal/lichen/`; the scaffold ticket turns it into `jassuwu/lichen`.

### The thesis

**Monochrome, plus one colour.** Neutral greys do all the structural work; the lime does one job — being *the* colour — and nothing else. Reference feel: vesper / oscura / kanso, not One Dark. jass's words: "monochrome plus accent colour — you know what I'm talking about."

Two corrections to the naive reading of that:

- **Not calm — contrast.** The theme should have *good* contrast, not a flat low-contrast wash. Monochrome is about hue count, not about everything being mid-grey.
- **Semantic colour still exists.** Errors, warnings, diffs, strings vs keywords must still read as different things. The line to hold: colours that *mean* something, never colours that *decorate*. One Dark was "okay but too many colours". How many hues that permits, and how muted they are, is the central design decision (ticket 03).

### Standing constraints

- **The lime is invariant:** `oklch(0.9392 0.1588 124.39)` = `#d4fd80`, the same reserved accent as jass.gg. It is light — 1.16:1 on white — which is fine on a dark theme but means it will need to be checked as *text* on every grey it sits on.
- **Greys are strictly neutral** — oklch chroma 0, matching jass.gg's zinc ramp. No warm/cool tint; the lime is the only hue on screen. One exception, decided in the role vocabulary: ANSI blue/magenta/cyan are tinted greys (chroma ≤ ~0.03), terminal only.
- **Dark only for now.** A light variant is out of scope (see below).
- **One repo, generated ports** (tokyonight-style): a single palette source and a build step that emits every port into the repo. Not an org-of-repos.
- **Account: `jassuwu`** (SSH alias `github.jass`). Not `jassucyd`.
- **License must be OSI** — t3code's Open VSX importer rejects anything outside `MIT/Apache-2.0/BSD/ISC/MPL-2.0/CC0/0BSD/Unlicense`. MIT unless the layout ticket finds a reason otherwise.
- **Lowercase copy**, product-grade tone (README, marketplace listing).

### What each target actually consumes (found aug 29)

- **Ghostty** — currently `theme = Rose Pine` in `~/.config/ghostty/config`; a theme is a flat file of `palette = N=#hex` + `background/foreground/cursor-color/selection-*`.
- **Neovim** — `~/.config/nvim/lua/plugins.lua` loads `rose-pine/neovim` via `vim.pack` and calls `vim.cmd.colorscheme('rose-pine')`. The port is a Lua colorscheme plugin.
- **Cursor** — `workbench.colorTheme: "Oscura Midnight"` (`fey.oscura` extension). A VS Code theme extension; publish to the VS Code Marketplace **and** Open VSX.
- **t3code** — does *not* load theme files from disk. `apps/web/src/openVsxThemes.ts` searches Open VSX, downloads the `.vsix`, and reads only the `USED_WORKBENCH_COLORS` set (~40 keys: `editor.*`, `sideBar.*`, `panel.*`, `terminal.*`, `list.*`, `button.*`, `badge.background`, `focusBorder`, `textLink.foreground`, …) plus `tokenColors`. Every one of those keys must be set explicitly in the VS Code theme. jass reports kanso "doesn't really work that well" there — ticket 09 finds out which keys it left unset.
- **herdr** — `~/.config/herdr/config.toml` has `[theme] name = "rose-pine"`. No external theme files: built-ins only, plus `[theme.custom]` overrides (`sidebar_bg`, `active_row_bg`, `selection_bg`, `panel_bg`, `accent`, `green`, `blue`, `red`, `yellow`, …) and `name = "terminal"` to follow the host ANSI palette.
- **p10k** — `~/.p10k.zsh` (lean style) defines `grey/red/yellow/blue/magenta/cyan/white` locals near line 41 and uses them for `DIR`, `VCS`, `PROMPT_CHAR`, etc.
- **Wallpaper** — generated from the palette, minimal; ships as a build output.

### Hazards

- **Two laptops, one dotfiles repo.** `jassuwu/dotfiles` holds `.config/`, `.p10k.zsh`, `.zshrc`. The other laptop has local, *unpushed* kanso overrides. Installing this theme should go through the dotfiles repo so both machines converge — don't hand-edit configs here and leave the other laptop behind.
- `.scratch/` is tracked and `CONTEXT.md` / `docs/adr/` are gitignored (decided in the layout ticket). Both must survive `git init` in the scaffold.

### Skills every session should consult

`/grilling` and `/domain-modeling` by default. `/prototype` for the palette ticket. `/research` for research tickets. Generation scripts and mechanical port emission → `codex-implement` (fable writes the spec, reviews the diff). Never let raw gpt output name colours or write README copy unreviewed.

## Decisions so far

- **Destination** — theme live in the daily drivers (nvim, ghostty, cursor) + herdr, p10k, wallpaper, and the VS Code theme published where t3code can import it. Execution carried in the map.
- **Variants** — dark only for now.
- **Greys** — strictly neutral, chroma 0, the lime is the only hue.
- **Repo shape** — one repo under `jassuwu`, generated ports.
- **Wallpaper** — generated and minimal, not a recoloured art piece.
- [How the reference theme repos are built and named](issues/01-how-theme-repos-are-built.md) — **mono-repo + committed generated extras (tokyonight shape) is the solo-maintainer answer and confirms the repo decision.** Names are one lowercase word, `<name>.nvim` when nvim is the flagship; variants are mood words. Every "monochrome" precedent keeps 3–5 hues — vague's trick is desaturated near-greys told apart by lightness and hue-lean, red stays loud for errors. Rosé pine's 15 / catppuccin's 26 role lists and every target's file format are in [the research file](research/how-theme-repos-are-built.md). Warning: the nvim-flagship layout doesn't naturally house a VS Code `package.json` at the root (ticket 05).
- [Name the theme](issues/02-name-the-theme.md) — **lichen**, lowercase everywhere. Repo `jassuwu/lichen`, extension id `<publisher>.lichen`, colorscheme/theme-file name `lichen`. Grey-green on grey rock; cleanest availability of the shortlist (limestone, pith, flint also free; phosphor/moss/zest/firefly/signal taken).
- [The role vocabulary: how many colours, and what each one means](issues/03-role-vocabulary.md) — **three families: seven chroma-0 greys (base/surface/overlay/border + text/subtle/muted), one accent in two strengths (accent = cursor, prompt char, active indicator, search fill, matching bracket — a point, never an area; accent-quiet = diff add, links, git-new), two muted hues (error red, warning amber).** Syntax by lightness (amended by the syntax-legibility ticket: functions are the accent), comments italic, selection is overlay grey, no blue. ANSI blue/magenta/cyan are chroma-capped tinted greys — the one exception. Canonical list in [`CONTEXT.md`](../../CONTEXT.md).
- [The palette: values for every role, contrast-checked](issues/04-the-palette.md) — **void ramp**: base `#040404`, surface `#0f0f0f`, overlay `#1d1d1d`, border `#303030`, muted `#6c6c6c`, subtle `#9b9b9b`, text `#cecece`; accent `#d4fd80`, accent-quiet `#b4c695`, error `#e47b79`, warning `#e1b767`, tints at chroma 0.03. Three text steps as decided — then `bright` returned for types in the syntax-legibility ticket. All gates pass (text 13:1, accent worst case 11.4:1). Full table and ANSI order in the ticket; prototype at `.scratch/theme/prototype/palette.html`.
- [Syntax legibility: telling functions, strings and keywords apart](issues/14-syntax-legibility.md) — **reopened on jass's review of the palette ("can't tell a function from a string; the lime is underutilized"). Answer: keywords dim to `subtle`, function names take the accent (its one job in code), types on a returning `bright` step, strings boxed on an `overlay` highlight rather than coloured, punctuation `muted`.** Amends the vocabulary and the palette; eight greys now. Prototype at `.scratch/theme/prototype/syntax.html?variant=E`.
- [Repo layout and the generation pipeline](issues/05-repo-layout-and-generation.md) — **repo root is the nvim plugin; `palette.json` is the source of truth; a bun script with string templates emits every port into committed `ports/<target>/` (nvim Lua fully generated); `bun run check` guards drift.** MIT, Bun ≥ 1.4 (`Bun.WebView` renders the wallpaper), `.scratch/` tracked, `CONTEXT.md` + `docs/adr/` ignored, map stays local. Full tree in the ticket.

## Not yet specified

- **How the theme reaches both machines.** Probably: the ports get installed via `jassuwu/dotfiles`, and the other laptop's unpushed kanso overrides get reconciled. Can't be ticketed until the ports exist and the dotfiles layout for a theme is chosen.
- **Discoverability beyond "installed on jass's machine".** A PR to Ghostty's bundled themes (via iTerm2-Color-Schemes), a listing in nvim colorscheme indexes, a small page for the theme (on jass.gg or its own subdomain?). Which of these are wanted, and whether any belong to *this* map or a follow-up, waits on the theme existing.
- **Plugin highlight coverage in Neovim.** Which plugins in jass's config need explicit highlight groups (gitsigns, fzf-lua, fidget, treesitter captures, LSP semantic tokens, diagnostics). Sharpens once ticket 08 opens the config.

## Out of scope

- **A light variant.** jass chose dark only; the lime forces a second accent value in light mode and that's a separate design problem.
- **WezTerm, tmux, bat/delta/fzf/lazygit/starship ports.** Not selected as targets. Cheap follow-ups once the terminal palette exists, but not on this route.
- **Applying the theme to jass.gg.** jass.gg already *is* the source of the lime and the neutral ramp; the site's CSS isn't a port target for this map.
- **A tagged v1 / marketplace polish across every target.** The destination is a lived-in v0.
