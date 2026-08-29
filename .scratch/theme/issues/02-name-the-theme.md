# Name the theme

Type: grilling
Status: resolved
Blocked by: 01

## Question

What is the theme called?

jass wants a shortlist, not a preset. Using ticket 01's findings on how themes are named (single evocative lowercase word; the repo is `<name>` or `<name>.nvim`; the VS Code extension id is `<publisher>.<name>`), propose 5–8 candidates that fit a *neutral greys + one lime* identity and jass's existing naming voice (quilt, savemefrom, mojify, onandemo, andrew-dictate — short, lowercase, a little wry, never cringey).

For each candidate, check availability **before** putting it to jass: `github.com/jassuwu/<name>` and a `<name>` org, a `<name>.nvim` collision on GitHub, the VS Code Marketplace and Open VSX, and whether an established theme already owns the word (e.g. "vesper", "kanso" are taken).

Resolving this ticket also renames `~/repos/personal/lichen/` to the chosen name. Record the name, the GitHub repo slug, the VS Code extension id, and the display-name casing.

## Answer

**lichen.** Lowercase everywhere — including marketplace and Open VSX listings; "Lichen" only where a UI forces sentence case and it can't be helped.

- GitHub repo: `jassuwu/lichen` (not `lichen.nvim` — the repo is the theme, nvim is one port; ticket 05 decides how the nvim plugin root is exposed).
- VS Code / Open VSX extension id: `<publisher>.lichen` — publisher/namespace chosen in ticket 09; display name `lichen`.
- Neovim colorscheme name: `lichen`. Ghostty theme file: `lichen`. herdr/p10k blocks: `lichen`.
- Working directory renamed: `~/repos/personal/lichen/`.

Why: a grey-green organism living on grey rock is the theme's whole idea in one word, and it reads quiet rather than cute. Availability (checked 2026-08-29): no `lichen.nvim`, no `lichen` theme on the VS Code Marketplace or Open VSX (only an unrelated `BrandevDevdev.eyes-on-lichen`), no established theme repo (one 0★ `DavidWise01/lichen`). A GitHub *user* `lichen` exists, so a `lichen` org isn't available — irrelevant under the one-repo decision.

Shortlist put to jass: lichen, limestone, pith, flint. Dropped on availability: phosphor (`phosphor-icons.phosphor-theme` + several green-CRT phosphor themes), moss (`AntonLilleby.moss-theme`, `SeedThemes/moss`), zest (`zest.nvim` 89★), firefly (`firefly.nvim` + 3 marketplace themes), signal (`signal.nvim`; the messenger owns the word), sprig (clean, but a well-known Go template library).
