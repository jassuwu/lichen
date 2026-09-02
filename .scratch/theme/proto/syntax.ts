// prototypes for a richer syntax encoding. run: bun .scratch/theme/proto/syntax.ts
import { lichen as p, type Role } from "../../../src/palette";

const FONT = `"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace`;
const H = (r: Role) => p.hex(r);

type Style = { fg?: Role; bg?: Role; b?: true; i?: true; u?: true };
type Kind = "cm" | "kw" | "bi" | "bo" | "op" | "pu" | "id" | "pr" | "pa" | "fd" | "fc" | "cd" | "ty" | "tb" | "co" | "nu" | "st" | "te" | "re" | "de" | "ws";
type Variant = { name: string; note: string; s: Record<Kind, Style> };

const base: Record<Kind, Style> = {
  cm: { fg: "muted", i: true }, kw: { fg: "subtle" }, bi: { fg: "subtle" }, bo: { fg: "subtle" }, op: { fg: "muted" }, pu: { fg: "muted" },
  id: { fg: "text" }, pr: { fg: "text" }, pa: { fg: "text" }, fd: { fg: "accent" }, fc: { fg: "accent" }, cd: { fg: "bright" }, ty: { fg: "bright" }, tb: { fg: "bright" },
  co: { fg: "text" }, nu: { fg: "text" }, st: { fg: "text", bg: "overlay" }, te: { fg: "muted", bg: "overlay" }, re: { fg: "subtle", bg: "overlay" }, de: { fg: "subtle" }, ws: {},
};
const ext = (over: Partial<Record<Kind, Style>>, from = base): Record<Kind, Style> => ({ ...from, ...over });

const type = ext({
  kw: { fg: "subtle", i: true }, bi: { fg: "subtle", i: true }, de: { fg: "subtle", i: true },
  pa: { fg: "text", i: true }, co: { fg: "text", b: true },
  fd: { fg: "accent", b: true }, cd: { fg: "bright", b: true },
  st: { fg: "subtle", bg: "overlay" }, te: { fg: "muted", bg: "overlay" }, re: { fg: "subtle", bg: "overlay" },
});
const literal = ext({ nu: { fg: "text", bg: "overlay" }, bo: { fg: "subtle", bg: "overlay" } }, type);
const tint = ext({
  kw: { fg: "blue-tint", i: true }, bi: { fg: "blue-tint", i: true }, de: { fg: "blue-tint", i: true },
  nu: { fg: "magenta-tint-bright" }, bo: { fg: "magenta-tint" }, co: { fg: "magenta-tint-bright", b: true },
}, type);
const full = ext({ nu: { fg: "magenta-tint-bright", bg: "overlay" }, bo: { fg: "magenta-tint", bg: "overlay" } }, tint);

const f = ext({ nu: { fg: "bright" }, bo: { fg: "bright" } }, type);
const g = ext({ st: { fg: "bright", bg: "overlay" }, te: { fg: "subtle", bg: "overlay" } }, f);
const h = ext({ nu: { fg: "subtle", b: true }, bo: { fg: "subtle", b: true } }, type);
const k = ext({ st: { fg: "text", bg: "overlay" }, te: { fg: "muted", bg: "overlay" } }, f);

const ALL: Variant[] = [
  { name: "a · current", note: "four greys, lime functions, strings boxed", s: base },
  { name: "b · type", note: "+ italic grammar, bold definitions, strings dimmed", s: type },
  { name: "c · literal", note: "b + every literal sits on the overlay", s: literal },
  { name: "d · tint", note: "b + ansi tints: cool grammar, warm values", s: tint },
  { name: "e · full", note: "c + d", s: full },
  { name: "f · bright numbers", note: "b + numbers and booleans bright, strings subtle", s: f },
  { name: "g · bright literals", note: "f + strings bright too", s: g },
  { name: "h · bold numbers", note: "b + numbers and booleans subtle bold", s: h },
  { name: "k · keep strings", note: "f but strings stay text (flat without a bg)", s: k },
];
const ONLY = process.argv[2]?.split(",");
const VARIANTS = ONLY ? ALL.filter((v) => ONLY.includes(v.name[0])) : ALL;
const SHEET = ALL.filter((v) => "abfgh".includes(v.name[0]));

const SAMPLE = String.raw`
[[cm|// one palette, every port]]
[[kw|import]] { [[id|loadPalette]], [[kw|type]] [[ty|Lichen]] } [[kw|from]] [[st|"./palette"]];

[[kw|const]] [[co|MAX_RETRIES]] [[op|=]] [[nu|3]];
[[kw|const]] [[co|PATTERN]] [[op|=]] [[re|/lichen-(\w+)-(\d+)x(\d+)\.png$/]];

[[kw|type]] [[ty|Port]] [[op|=]] { [[pr|path]]: [[tb|string]]; [[fd|render]]([[pa|p]]: [[ty|Lichen]]): [[tb|string]] };

[[kw|export]] [[kw|class]] [[cd|Emitter]] [[kw|implements]] [[ty|Port]] {
  [[de|@memo]] [[kw|private]] [[pr|count]] [[op|=]] [[nu|0]];

  [[kw|constructor]]([[kw|public]] [[kw|readonly]] [[pa|path]]: [[tb|string]], [[kw|private]] [[pa|mode]] [[op|=]] [[st|"write"]]) {}

  [[kw|async]] [[fd|render]]([[pa|p]]: [[ty|Lichen]], [[pa|retries]] [[op|=]] [[co|MAX_RETRIES]]): [[tb|Promise]]<[[tb|string]]> {
    [[kw|const]] [[id|out]] [[op|=]] [[st|${"`"}${"$"}{]][[bi|this]].[[pr|path]][[st|}: ${"$"}{]][[pa|p]].[[fc|hex]]([[st|"accent"]])[[st|}${"`"}]];
    [[kw|if]] ([[op|!]][[co|PATTERN]].[[fc|test]]([[id|out]]) [[op|&&]] [[pa|retries]] [[op|>]] [[nu|0]]) [[kw|return]] [[bi|this]].[[fc|render]]([[pa|p]], [[pa|retries]] [[op|-]] [[nu|1]]);
    [[bi|this]].[[pr|count]] [[op|+=]] [[nu|1]];
    [[kw|return]] [[id|out]] [[op|??]] [[bo|null]];
  }
}

[[kw|export]] [[kw|async]] [[kw|function]] [[fd|emit]]([[pa|ports]]: [[ty|Port]][], [[pa|verbose]] [[op|=]] [[bo|false]]): [[tb|Promise]]<[[tb|number]]> {
  [[kw|const]] [[id|lichen]] [[op|=]] [[fc|loadPalette]]();
  [[kw|let]] [[id|written]] [[op|=]] [[nu|0]];
  [[kw|for]] ([[kw|const]] [[id|port]] [[kw|of]] [[pa|ports]]) {
    [[kw|await]] [[bi|Bun]].[[fc|write]]([[id|port]].[[pr|path]], [[id|port]].[[fc|render]]([[id|lichen]]));
    [[id|written]][[op|++]];
  }
  [[kw|if]] ([[pa|verbose]]) [[bi|console]].[[fc|log]]([[st|${"`"}wrote ${"$"}{]][[id|written]][[st|} files${"`"}]]);
  [[kw|return]] [[id|written]];
}
`.trim();

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function tokenize(line: string): [Kind, string][] {
  const out: [Kind, string][] = [];
  const re = /\[\[(\w+)\|(.*?)\]\]|(?:(?!\[\[).)+/g;
  for (const m of line.matchAll(re)) {
    if (m[1]) out.push([m[1] as Kind, m[2]]);
    else for (const part of m[0].match(/\s+|[^\s]+/g) ?? []) out.push([/\s/.test(part) ? "ws" : "pu", part]);
  }
  return out;
}

function css(kind: string, st: Style, withBg: boolean): string {
  const d: string[] = [];
  if (st.fg) d.push(`color:${H(st.fg)}`);
  if (st.bg && withBg) d.push(`background:${H(st.bg)}`);
  if (st.b) d.push("font-weight:700");
  if (st.i) d.push("font-style:italic");
  if (st.u) d.push("text-decoration:underline");
  return `.${kind}{${d.join(";")}}`;
}

function panel(v: Variant, withBg: boolean, fs: number): string {
  const lines = SAMPLE.split("\n");
  const body = lines
    .map((l, i) => `<div class="ln"><span class="num">${String(i + 1).padStart(2)}</span>${tokenize(l).map(([k, t]) => `<span class="${k}">${esc(t)}</span>`).join("")}</div>`)
    .join("");
  const id = `p${Math.random().toString(36).slice(2, 8)}`;
  const rules = (Object.entries(v.s) as [Kind, Style][]).map(([k, s]) => `#${id} ${css(k, s, withBg)}`).join("\n");
  // string runs: glue adjacent boxed spans so a template string reads as one box
  return `<style>${rules}
#${id} .st,#${id} .te{border-radius:${fs * 0.15}px;padding:${fs * 0.06}px 0}
#${id} .st + .st, #${id} .st + .te, #${id} .te + .st{border-top-left-radius:0;border-bottom-left-radius:0}
#${id} .st:has(+ .st), #${id} .st:has(+ .te), #${id} .te:has(+ .st){border-top-right-radius:0;border-bottom-right-radius:0}
</style>
<div id="${id}" class="panel" style="font-size:${fs}px"><div class="head"><span class="name">${v.name}</span><span class="note">${v.note}${withBg ? "" : " · no token backgrounds (vs code)"}</span></div>${body}</div>`;
}

function page(w: number, h: number, inner: string, cols: number): string {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
html,body{margin:0;width:${w}px;height:${h}px;background:${H("base")};overflow:hidden;font-family:${FONT};-webkit-font-smoothing:antialiased;color:${H("text")}}
.grid{display:grid;grid-template-columns:repeat(${cols},1fr);height:100%}
.panel{padding:1.2em 1.4em;line-height:1.6;border-right:1px solid ${H("surface")};border-bottom:1px solid ${H("surface")}}
.head{display:flex;gap:1em;align-items:baseline;margin-bottom:0.9em}
.name{color:${H("bright")};font-weight:700}
.note{color:${H("muted")};font-size:0.8em}
.ln{display:flex;white-space:pre}
.num{width:2ch;margin-right:2ch;text-align:right;color:${H("border")};user-select:none}
</style></head><body><div class="grid">${inner}</div></body></html>`;
}

async function shot(html: string, w: number, h: number, path: string, wait = 500) {
  await using view = new Bun.WebView({ width: w, height: h });
  await view.navigate("data:text/html;charset=utf-8," + encodeURIComponent(html));
  await Bun.sleep(wait);
  await Bun.write(path, new Uint8Array(await view.screenshot({ encoding: "buffer", format: "png" })));
  console.log("wrote", path);
}

const dir = import.meta.dir;
for (const v of VARIANTS) {
  const key = v.name[0];
  await shot(page(1700, 1560, panel(v, true, 26), 1), 1700, 1560, `${dir}/${key}-nvim.png`);
  await shot(page(1700, 1560, panel(v, false, 26), 1), 1700, 1560, `${dir}/${key}-vscode.png`);
}
const sheet = SHEET.map((v) => panel(v, true, 17)).join("") + SHEET.map((v) => panel(v, false, 17)).join("");
await shot(page(5600, 2100, sheet, 5), 5600, 2100, `${dir}/sheet.png`, 800);
