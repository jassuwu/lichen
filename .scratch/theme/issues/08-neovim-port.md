# Neovim port, installed

Type: task
Status: open
Blocked by: 06

## Question

Emit the Neovim colorscheme from the palette, load it from `~/.config/nvim/lua/plugins.lua` in place of `rose-pine`, and live in it.

Scope the highlight groups before writing them: core editor groups, treesitter captures, LSP semantic tokens, diagnostics, and the plugins jass actually has installed (read `nvim-pack-lock.json` — gitsigns, fzf-lua, fidget and whatever else is there). tokyonight's `lua/tokyonight/groups/` is the reference for how to organise groups per plugin. The syntax mapping is the table in [Syntax legibility](14-syntax-legibility.md) (functions = accent, types = bright, keywords = subtle, strings on an overlay highlight, punctuation muted). Emission is mechanical (`codex-implement` with the group list as spec); judging whether it reads on real files is not — jass looks at his own TypeScript, Lua and Swift.

Record the plugin spec line and any groups that needed hand-tuning beyond the palette.
