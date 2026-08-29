# Neovim port, installed

Type: task
Status: resolved
Blocked by: 06

## Question

Emit the Neovim colorscheme from the palette, load it from `~/.config/nvim/lua/plugins.lua` in place of `rose-pine`, and live in it.

Scope the highlight groups before writing them: core editor groups, treesitter captures, LSP semantic tokens, diagnostics, and the plugins jass actually has installed (read `nvim-pack-lock.json` — gitsigns, fzf-lua, fidget and whatever else is there). tokyonight's `lua/tokyonight/groups/` is the reference for how to organise groups per plugin. The syntax mapping is the table in [Syntax legibility](14-syntax-legibility.md) (functions = accent, types = bright, keywords = subtle, strings on an overlay highlight, punctuation muted). Emission is mechanical (`codex-implement` with the group list as spec); judging whether it reads on real files is not — jass looks at his own TypeScript, Lua and Swift.

Record the plugin spec line and any groups that needed hand-tuning beyond the palette.

## Answer

Installed 2026-08-29: `~/.config/nvim/lua/plugins.lua` now has `{ src = 'https://github.com/jassuwu/lichen' }` in `vim.pack.add` and `vim.cmd.colorscheme('lichen')`; the rose-pine spec and its setup block are gone. The port is four generated files at the repo root (`colors/lichen.lua`, `lua/lichen/{palette,groups,init}.lua`) — ~330 groups: editor, legacy syntax, treesitter, LSP semantic, diagnostics, gitsigns, fzf-lua, oil, mini. `require('lichen').setup({ transparent = true })` is the one option. Headless check: `@function` = accent, `Normal` bg = base.
