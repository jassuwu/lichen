# The wallpaper

Type: task
Status: resolved
Blocked by: 04, 06

## Question

Generate a wallpaper from the palette: minimal, the darkest grey as the field, one lime mark. Decide the mark (the `j` tile from jass.gg's favicon? a wordmark? a single geometric shape?), the resolutions to emit (this Mac's displays; check `system_profiler SPDisplaysDataType`), and the renderer — decided in the layout ticket: `src/emit/wallpaper.ts` renders an HTML/SVG page with `Bun.WebView` (Bun 1.4, headless WebKit, `screenshot()`) and writes PNGs to `ports/wallpaper/`, so it regenerates with the other ports; `Bun.Image` can resize per display. Set it as the desktop wallpaper.

Record the mark chosen and the output paths.

## Answer

Done 2026-08-29: `src/emit/wallpaper.ts` renders an HTML page with `Bun.WebView` and writes `ports/wallpaper/lichen-3440x1440.png` and `lichen-3024x1964.png` (the ultrawide and the built-in display). First cut was one lime rounded tile on the base field; jass called it bland. Replaced 2026-08-29 with a generative rock face: crustose lichen colonies drawn on a canvas — lobed discs tiled with voronoi areoles (finer toward the margin) split by base-coloured cracks, the look of map lichen (*Rhizocarpon geographicum*, which really is this lime). Grey colonies cluster in overlay/border/surface; one colony a little right of centre is the accent, with a few small satellites. Seeded prng keyed on the size, so each display renders the same picture every build. PNGs are committed but excluded from `bun run check` (screenshot bytes aren't guaranteed stable). Set on every desktop via System Events.

Extended 2026-08-31 into a flavored set, rosé-pine-style: `ports/wallpaper/lichen-<flavor>-<w>x<h>.png`, five flavors × both sizes. `src/emit/wallpaper.ts` now has a shared page (base field, palette as `C`, prng seeded on flavor + size, `grit`/`lobes`/`outline` helpers) and one script body per flavor:

- **rock** — the crustose colony face, unchanged (keeps its original seed so the picture survived the rename from `lichen-<w>x<h>.png`).
- **spore** — bare stone, one lime dot where the rock colony sits, a faint accent-quiet ring around it. The "accent is a point, never an area" rule as a picture.
- **grid** — a survey lattice of border/muted dots; one cell is the lime.
- **rings** — lobed growth margins from one origin, read like contours; greys fade outward, ring three is accent-quiet, the origin is a lime dot.
- **wordmark** — "lichen" small in the middle, `subtle`, monospace (JetBrains Mono → ui-monospace fallback; the machine has SF Mono). The i is set dotless and its tittle painted back in lime.

Desktops re-pointed to the rock files after the rename.

Grown again same day on jass's review ("not good enough, more creative, more duotones, really abstract, go crazy"): eleven more flavors from the generative-art canon, sixteen total. The prelude gained stateless value noise + fbm (integer hash, no tables, so defining it consumes no rnd and old flavors keep their pictures) and per-flavor screenshot waits for the slow ones.

- **flow** — a noise flow field; thousands of short grey trails, lime where they pass the golden point.
- **ridge** — unknown pleasures: stacked occluding ridgelines with a central massif, one contour lime.
- **dither** — two glows printed in 8×8 bayer ordered dither, lime and grey. the duotone-print one.
- **attractor** — a de jong attractor (fixed params 1.4/−2.3/2.4/−2.1 — perturbing them dropped the orbit into a periodic window and collapsed the cloud to ~400 pixels; also had to render via density histogram + putImageData because 2M fillRects outran the screenshot wait).
- **maze** — 10 PRINT diagonals, a lobed blob of it overgrown in lime.
- **phyllo** — golden-angle phyllotaxis halftone field with two log-spiral lime arms (mod-fibonacci arms scattered at the rim; replaced with real golden spirals).
- **moire** — two ring fields beating, grey vs quiet lime, one lime source dot.
- **turing** — gray-scott reaction-diffusion (karl sims weights, F=0.0545 k=0.062), grey coral with a lime blob.
- **branch** — fruticose bushes up from the bottom edge, one fruiting in lime tips.
- **tty** — dim hex buffer with a `❯ lichen ▮` prompt, prompt char and cursor lime.
- **bands** — diagonal duotone print bands of the grey ramp, one lime strike and one quiet echo.

Every flavor was rendered and eyeballed at 3440×1440; grid/wordmark/moire/attractor/phyllo/branch/turing each went through one or two taste passes. `build.test.ts` now scopes its write tests to the ghostty emitter — a full write build renders 32 webview screenshots and blew the test timeout.
