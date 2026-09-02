import { join } from "node:path";
import type { Lichen, Role } from "../palette";
import type { Emitter } from "./types";
import { FLAVORS } from "./wallpaper";

/**
 * the pictures in the readme, generated from the palette like every port:
 * a banner, the swatches, a syntax sample, and a thumbnail per wallpaper.
 * rendered at 2x and shown at half width so they stay crisp on retina.
 */

const FONT = `"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace`;

function shell(p: Lichen, w: number, h: number, css: string, body: string): string {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
html,body{margin:0;width:${w}px;height:${h}px;background:${p.hex("base")};overflow:hidden;font-family:${FONT};-webkit-font-smoothing:antialiased}
${css}
</style></head><body>${body}</body></html>`;
}

/** the name with the tittle of the i painted back in lime, plus the one-line pitch */
export function bannerHtml(p: Lichen, w: number, h: number): string {
  return shell(
    p,
    w,
    h,
    `
.wrap{height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:28px}
.word{font-size:168px;font-weight:500;color:${p.hex("subtle")};line-height:1;letter-spacing:-0.01em}
.i{position:relative}
.i::after{content:"";position:absolute;left:50%;top:0.17em;width:0.11em;height:0.11em;border-radius:50%;background:${p.hex("accent")};transform:translateX(-50%)}
.tag{font-size:30px;color:${p.hex("muted")}}
`,
    `<div class="wrap"><div class="word">l<span class="i">ı</span>chen</div><div class="tag">a monochrome theme with one colour</div></div>`,
  );
}

/** two rows of eight: the grey ramp, then every role that has a hue */
export function paletteHtml(p: Lichen, w: number, h: number): string {
  const rows: Role[][] = [
    ["base", "surface", "overlay", "border", "muted", "subtle", "text", "bright"],
    ["accent", "accent-quiet", "error", "warning", "blue-tint", "magenta-tint", "cyan-tint", "on-accent"],
  ];
  const tile = (role: Role) => {
    const hex = p.hex(role);
    const dark = p.roles[role].oklch[0] < 0.5;
    const ink = dark ? p.hex("subtle") : p.hex("on-accent");
    return `<div class="tile" style="background:${hex};color:${ink}"><span class="role">${role}</span><span class="hex">${hex}</span></div>`;
  };
  return shell(
    p,
    w,
    h,
    `
.rows{display:flex;flex-direction:column;height:100%}
.row{display:flex;flex:1}
.tile{flex:1;display:flex;flex-direction:column;justify-content:flex-end;padding:18px 20px;gap:6px;font-size:21px;white-space:nowrap}
.role{font-weight:500}
.hex{opacity:0.8}
`,
    `<div class="rows">${rows.map((r) => `<div class="row">${r.map(tile).join("")}</div>`).join("")}</div>`,
  );
}

/** a small editor: a typescript file, the syntax roles, cursor line, statusline */
export function codeHtml(p: Lichen, w: number, h: number): string {
  type T = [cls: string, text: string];
  const kw = (s: string): T => ["kw", s];
  const fn = (s: string): T => ["fn", s];
  const ty = (s: string): T => ["ty", s];
  const id = (s: string): T => ["id", s];
  const st = (s: string): T => ["st", s];
  const pu = (s: string): T => ["pu", s];
  const cm = (s: string): T => ["cm", s];
  const sp = (n = 1): T => ["id", " ".repeat(n)];
  const lines: T[][] = [
    [cm("// one palette, every port")],
    [kw("import"), sp(), pu("{"), sp(), id("loadPalette"), pu(","), sp(), kw("type"), sp(), ty("Lichen"), sp(), pu("}"), sp(), kw("from"), sp(), st('"./palette"'), pu(";")],
    [],
    [kw("type"), sp(), ty("Port"), sp(), pu("="), sp(), pu("{"), sp(), id("path"), pu(":"), sp(), ty("string"), pu(";"), sp(), fn("render"), pu("("), id("p"), pu(":"), sp(), ty("Lichen"), pu(")"), pu(":"), sp(), ty("string"), sp(), pu("}"), pu(";")],
    [],
    [kw("export"), sp(), kw("async"), sp(), kw("function"), sp(), fn("emit"), pu("("), id("ports"), pu(":"), sp(), ty("Port"), pu("[]"), pu(")"), pu(":"), sp(), ty("Promise"), pu("<"), ty("number"), pu(">"), sp(), pu("{")],
    [sp(2), kw("const"), sp(), id("lichen"), sp(), pu("="), sp(), fn("loadPalette"), pu("()"), pu(";")],
    [sp(2), kw("let"), sp(), id("written"), sp(), pu("="), sp(), id("0"), pu(";")],
    [sp(2), kw("for"), sp(), pu("("), kw("const"), sp(), id("port"), sp(), kw("of"), sp(), id("ports"), pu(")"), sp(), pu("{")],
    [sp(4), kw("const"), sp(), id("out"), sp(), pu("="), sp(), id("port"), pu("."), fn("render"), pu("("), id("lichen"), pu(")"), pu(";")],
    [sp(4), kw("await"), sp(), kw("Bun"), pu("."), fn("write"), pu("("), id("port"), pu("."), id("path"), pu(","), sp(), ["cur", "o"], id("ut"), pu(")"), pu(";")],
    [sp(4), id("written"), sp(), pu("+="), sp(), id("1"), pu(";")],
    [sp(2), pu("}")],
    [sp(2), kw("return"), sp(), id("written"), pu(";")],
    [pu("}")],
  ];
  const cursorLine = 10;
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const html = lines
    .map(
      (toks, i) =>
        `<div class="ln${i === cursorLine ? " cur-line" : ""}"><span class="num">${String(i + 1).padStart(2)}</span>${toks
          .map(([c, t]) => `<span class="${c}">${esc(t)}</span>`)
          .join("")}</div>`,
    )
    .join("");
  return shell(
    p,
    w,
    h,
    `
.ed{display:flex;flex-direction:column;height:100%}
.buf{flex:1;padding:40px 0 0;font-size:30px;line-height:1.7;color:${p.hex("text")}}
.ln{display:flex;white-space:pre;padding:0 48px}
.num{width:2ch;margin-right:3ch;text-align:right;color:${p.hex("muted")};user-select:none}
.cur-line{background:${p.hex("surface")}}
.cur-line .num{color:${p.hex("subtle")}}
.kw{color:${p.hex("subtle")}}
.fn{color:${p.hex("accent")}}
.ty{color:${p.hex("bright")}}
.id{color:${p.hex("text")}}
.pu{color:${p.hex("muted")}}
.cm{color:${p.hex("muted")};font-style:italic}
.st{color:${p.hex("text")};background:${p.hex("overlay")};border-radius:4px;padding:0 3px}
.cur{background:${p.hex("accent")};color:${p.hex("on-accent")}}
.status{display:flex;align-items:center;height:64px;background:${p.hex("surface")};font-size:24px;color:${p.hex("subtle")}}
.mode{height:100%;display:flex;align-items:center;padding:0 22px;background:${p.hex("accent")};color:${p.hex("on-accent")};font-weight:500}
.file{padding:0 24px;color:${p.hex("text")}}
.right{margin-left:auto;padding:0 32px;color:${p.hex("muted")}}
`,
    `<div class="ed"><div class="buf">${html}</div><div class="status"><span class="mode">normal</span><span class="file">src/build.ts</span><span class="right">ts&nbsp;&nbsp;11:38</span></div></div>`,
  );
}

async function shot(html: string, w: number, h: number): Promise<Uint8Array> {
  await using view = new Bun.WebView({ width: w, height: h });
  await view.navigate("data:text/html;charset=utf-8," + encodeURIComponent(html));
  await Bun.sleep(400);
  return new Uint8Array(await view.screenshot({ encoding: "buffer", format: "png" }));
}

/** downscale the committed 3440x1440 wallpaper — the real file, not a re-render */
async function thumb(flavor: string): Promise<Uint8Array> {
  const src = join(process.cwd(), `ports/wallpaper/lichen-${flavor}-3440x1440.png`);
  const bytes = await Bun.file(src).bytes();
  return new Bun.Image(bytes).resize(800, 335, { fit: "inside" }).png().bytes();
}

export const readmeAssets: Emitter[] = [
  { path: "docs/assets/banner.png", render: (p) => shot(bannerHtml(p, 1600, 480), 1600, 480), check: false },
  { path: "docs/assets/palette.png", render: (p) => shot(paletteHtml(p, 1600, 440), 1600, 440), check: false },
  { path: "docs/assets/code.png", render: (p) => shot(codeHtml(p, 1600, 860), 1600, 860), check: false },
  ...FLAVORS.map((flavor) => ({
    path: `docs/assets/wallpapers/${flavor}.png`,
    render: () => thumb(flavor),
    check: false,
  })),
];
