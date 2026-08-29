# Repo layout and the generation pipeline

Type: grilling
Status: resolved
Blocked by: 01, 02

## Question

How is the repo laid out, and how do ports get generated?

Settled: one repo under `jassuwu`, ports generated from one source. Decide the rest:

- **Palette source format** — a TypeScript/JSON/TOML file? Where do the role→value table and the per-target mappings live? (tokyonight: Lua tables + extras generators; catppuccin: JSON palette + `whiskers` tera templates — see ticket 01.)
- **The generator** — own bun script with string templates vs adopting `whiskers`. Bun is jass's default runtime; prefer the smaller thing.
- **What's committed** — generated ports in-repo (tokyonight's `extras/`) so each target is a stable path people can point at, vs build-on-release.
- **Directory shape** — `ports/<target>/…` or per-target top-level dirs; where the VS Code extension's `package.json` lives; where the nvim plugin root is (a nvim plugin needs `colors/` and `lua/` at the repo root *or* a separate repo — this is the one target that fights the monorepo; tokyonight solves it by being the nvim plugin itself).
- **License** — MIT unless something argues otherwise (t3code needs OSI).
- **Tracker** — does `.scratch/` get gitignored, and does the map stay local or move to GitHub issues once the repo exists?

Output: a short layout tree and a decision on the generator, enough for ticket 06 to scaffold from.

## Answer

Decided with jass 2026-08-29 (five questions; the rest are stated assumptions a scaffold can overturn cheaply).

**Repo root is the Neovim plugin.** `jassuwu/lichen` carries `colors/lichen.lua` and `lua/lichen/` at its root so `vim.pack.add({ src = "https://github.com/jassuwu/lichen" })` just works. Every other port lives under `ports/<target>/`. Rejected: a separate `lichen.nvim` (two repos, subtree machinery) and nvim-under-ports (vim.pack can't install a subdirectory).

**Source of truth is JSON.** `palette.json`: the roles from `CONTEXT.md`, each with its oklch triple and a one-line `meaning` (CONTEXT.md is untracked, so the public source must describe itself), plus the ANSI order and the syntax → role mapping. jass: "let the source of truth be a json" — and "maybe I should just use bun here" rather than a language he's never used.

**Own bun script, string templates.** `bun run build` runs one emitter per target; `${role}` interpolation, no template engine. Outputs are **committed** (tokyonight shape — consumers grab a file, `git diff` shows drift). `bun run check` regenerates into a temp dir and diffs, so a stale port fails loudly without CI. Rejected: whiskers.

**The nvim Lua is fully generated** — jass chose "generate everything" over hand-written groups. Highlight-group → role mappings are *data* in `src/emit/nvim.ts`; the emitter writes `lua/lichen/palette.lua` and every group file. The generated Lua is output, not something to edit.

**Tracking:** `.gitignore` carries `CONTEXT.md` and `docs/adr/` (jass's habit, cf. andrew-dictate); `.scratch/` is **tracked** as in jass.gg — the map, tickets, research and prototypes are history worth keeping. The map stays on the local tracker; no move to GitHub issues.

### Tree

```
lichen/
├── colors/lichen.lua          generated · nvim entry
├── lua/lichen/                generated · palette.lua + highlight group files
├── palette.json               SOURCE OF TRUTH · roles → oklch, meaning, ansi order, syntax map
├── src/
│   ├── palette.ts             loads palette.json; derives hex, ansi table, diff mixes; typed Role
│   ├── build.ts               `bun run build` — runs every emitter; `--check` diffs instead of writing
│   └── emit/
│       ├── nvim.ts            → colors/, lua/lichen/
│       ├── ghostty.ts         → ports/ghostty/lichen
│       ├── vscode.ts          → ports/vscode/themes/lichen-color-theme.json
│       ├── herdr.ts           → ports/herdr/lichen.toml   ([theme] + [theme.custom] block)
│       ├── p10k.ts            → ports/p10k/lichen.zsh     (the colour locals)
│       └── wallpaper.ts       → ports/wallpaper/*.png     (Bun.WebView screenshot of an HTML/SVG page)
├── ports/
│   ├── ghostty/lichen
│   ├── vscode/                package.json (publisher.lichen), themes/, README, LICENSE — vsce/ovsx run here
│   ├── herdr/lichen.toml
│   ├── p10k/lichen.zsh
│   └── wallpaper/lichen-<w>x<h>.png
├── package.json               bun tooling only — scripts: build, check
├── README.md · LICENSE (MIT)
├── .gitignore                 CONTEXT.md, docs/adr/
└── .scratch/theme/            tracked · map, issues, research, prototype
```

### Assumptions stated, not asked

- **MIT.** t3code's Open VSX gate needs OSI; MIT is what every reference except tokyonight uses.
- **No tags** until v0 has been lived in (jass's release cadence: batch, don't tag small fixes).
- **Bun 1.4 is the floor** — `Bun.Image` / `Bun.WebView` are used by the wallpaper emitter; note it in `package.json` `engines`.
- The VS Code extension's `package.json` lives in `ports/vscode/`, not the root — the root `package.json` is build tooling and must not carry `contributes`.
