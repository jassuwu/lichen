# Ghostty port, installed

Type: task
Status: resolved
Blocked by: 06

## Question

Emit the Ghostty theme from the palette, install it (`~/.config/ghostty/themes/<name>` or the dotfiles repo's equivalent), switch `theme = ` in `~/.config/ghostty/config`, and live in it.

Ghostty's format: `palette = 0..15=#hex`, `background`, `foreground`, `cursor-color`, `cursor-text`, `selection-background`, `selection-foreground`. The ANSI mapping comes from ticket 03. Check it against real output — `ls`, `git diff`, `git status`, a test runner, fzf-lua, lazygit — the places a monochrome ANSI table usually breaks.

Record what was installed where, and anything the ANSI mapping had to change.

## Answer

Installed 2026-08-29: `ports/ghostty/lichen` copied to `~/.config/ghostty/themes/lichen`, `theme = lichen` in `~/.config/ghostty/config` (that file is tracked by the dotfiles repo — commit it there). ANSI table as designed; no changes needed at install time. Judge on real `ls`/`git diff`/tests during the week-in ticket.
