import type { Lichen } from "../palette";
import type { Emitter } from "./types";

/** the displays on jass's desk. add a size, run `bun run build`. */
export const SIZES: ReadonlyArray<readonly [number, number]> = [
  [3440, 1440],
  [3024, 1964],
];

/** a base-coloured field with one lime tile a little above centre — the favicon's tile, no glyph. */
export function wallpaperHtml(p: Lichen, w: number, h: number): string {
  const tile = Math.round(Math.min(w, h) / 28);
  const radius = Math.round(tile / 5);
  return `<!doctype html><html><head><meta charset="utf-8"><style>
html,body{margin:0;width:${w}px;height:${h}px;background:${p.hex("base")};overflow:hidden}
.tile{position:absolute;left:${Math.round(w / 2 - tile / 2)}px;top:${Math.round(h * 0.46 - tile / 2)}px;width:${tile}px;height:${tile}px;border-radius:${radius}px;background:${p.hex("accent")}}
</style></head><body><div class="tile"></div></body></html>`;
}

async function screenshot(p: Lichen, w: number, h: number): Promise<Uint8Array> {
  await using view = new Bun.WebView({ width: w, height: h });
  await view.navigate("data:text/html;charset=utf-8," + encodeURIComponent(wallpaperHtml(p, w, h)));
  const png = await view.screenshot({ encoding: "buffer", format: "png" });
  return new Uint8Array(png);
}

export const wallpaper: Emitter[] = SIZES.map(([w, h]) => ({
  path: `ports/wallpaper/lichen-${w}x${h}.png`,
  render: (p) => screenshot(p, w, h),
  check: false,
}));
