# herdr matches

Type: task
Status: resolved
Blocked by: 07

## Question

Make herdr's UI match. It has no external theme files: the choice is `name = "terminal"` (follow Ghostty's ANSI palette) with `[theme.custom]` overrides for `sidebar_bg`, `active_row_bg`, `selection_bg`, `panel_bg`, `accent` and the four semantic hues, versus building on a built-in. Emit the `[theme]` block from the palette so it regenerates with everything else, and install it via the dotfiles repo.

Record the block, and whether an upstream PR adding the theme as a built-in is worth it (fog: discoverability).

## Answer

Installed 2026-08-29: the `[theme]` + `[theme.custom]` block from `ports/herdr/lichen.toml` replaced the rose-pine section in `~/.config/herdr/config.toml` (`name = "terminal"`, so it follows Ghostty's ANSI table; sidebar/active-row/selection/accent/green/blue/red/yellow overridden). `herdr config check` ok, `herdr server reload-config` applied. An upstream built-in is not worth it while the theme is a week old.
