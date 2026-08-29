# The wallpaper

Type: task
Status: resolved
Blocked by: 04, 06

## Question

Generate a wallpaper from the palette: minimal, the darkest grey as the field, one lime mark. Decide the mark (the `j` tile from jass.gg's favicon? a wordmark? a single geometric shape?), the resolutions to emit (this Mac's displays; check `system_profiler SPDisplaysDataType`), and the renderer — decided in the layout ticket: `src/emit/wallpaper.ts` renders an HTML/SVG page with `Bun.WebView` (Bun 1.4, headless WebKit, `screenshot()`) and writes PNGs to `ports/wallpaper/`, so it regenerates with the other ports; `Bun.Image` can resize per display. Set it as the desktop wallpaper.

Record the mark chosen and the output paths.

## Answer

Done 2026-08-29: `src/emit/wallpaper.ts` renders an HTML page with `Bun.WebView` and writes `ports/wallpaper/lichen-3440x1440.png` and `lichen-3024x1964.png` (the ultrawide and the built-in display). The mark: one lime rounded tile, 1/28 of the short edge, a little above centre — the favicon's tile without the glyph. PNGs are committed but excluded from `bun run check` (screenshot bytes aren't guaranteed stable). Set on every desktop via System Events.
