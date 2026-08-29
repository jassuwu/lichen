# p10k prompt matches

Type: task
Status: resolved
Blocked by: 07

## Question

Retarget `~/.p10k.zsh`'s colour locals (`grey/red/yellow/blue/magenta/cyan/white`, ~line 41) to the palette, and decide what the prompt char and dir segments use — the lime is the obvious prompt char, if ticket 03 gave it that job. Emit the block from the generator so it stays in sync; install via the dotfiles repo (`.p10k.zsh` is tracked there).

Record the values and the segments that changed.

## Answer

Installed 2026-08-29: the seven colour locals in `~/.p10k.zsh` (a symlink into the dotfiles repo) replaced by `ports/p10k/lichen.zsh`: grey→muted, red→error, yellow→warning, blue (dir)→text, magenta (prompt char)→accent, cyan→accent-quiet, white→bright. `zsh -n` clean. Commit in dotfiles.
