import defaultPaletteJson from "../palette.json" with { type: "json" };

export const ROLES = [
  "base",
  "surface",
  "overlay",
  "border",
  "muted",
  "subtle",
  "text",
  "bright",
  "accent",
  "accent-quiet",
  "on-accent",
  "error",
  "error-bright",
  "warning",
  "warning-bright",
  "blue-tint",
  "blue-tint-bright",
  "magenta-tint",
  "magenta-tint-bright",
  "cyan-tint",
  "cyan-tint-bright",
] as const;

export type Role = (typeof ROLES)[number];
export type Oklch = readonly [l: number, c: number, h: number];

const ROLE_SET: ReadonlySet<string> = new Set(ROLES);

function isRole(value: unknown): value is Role {
  return typeof value === "string" && ROLE_SET.has(value);
}

// --- colour math (Björn Ottosson's oklab/oklch <-> sRGB) ---

function clamp01(x: number): number {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}

function srgbGamma(x: number): number {
  const c = clamp01(x);
  return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

function srgbLinearize(x: number): number {
  return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
}

/** oklab -> linear sRGB, returned as [r, g, b] each un-clamped. */
function oklabToLinearSrgb(L: number, a: number, b: number): [number, number, number] {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;

  const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bl = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  return [r, g, bl];
}

function linearSrgbToOklab(r: number, g: number, b: number): [number, number, number] {
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  return [
    0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
  ];
}

function toHex(r: number, g: number, b: number): string {
  const round = (x: number) => Math.round(srgbGamma(x) * 255);
  const hex = (x: number) => x.toString(16).padStart(2, "0");
  return `#${hex(round(r))}${hex(round(g))}${hex(round(b))}`;
}

export function oklchToHex(l: number, c: number, h: number): string {
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);
  const [r, g, bl] = oklabToLinearSrgb(l, a, b);
  return toHex(r, g, bl);
}

function hexToLinearSrgb(hex: string): [number, number, number] {
  const n = hex.replace("#", "");
  const r = parseInt(n.slice(0, 2), 16) / 255;
  const g = parseInt(n.slice(2, 4), 16) / 255;
  const b = parseInt(n.slice(4, 6), 16) / 255;
  return [srgbLinearize(r), srgbLinearize(g), srgbLinearize(b)];
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToLinearSrgb(hex);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(hexA: string, hexB: string): number {
  const lA = relativeLuminance(hexA);
  const lB = relativeLuminance(hexB);
  const lighter = Math.max(lA, lB);
  const darker = Math.min(lA, lB);
  return (lighter + 0.05) / (darker + 0.05);
}

export function mixOklab(fgHex: string, bgHex: string, amount: number): string {
  const [fr, fg, fb] = hexToLinearSrgb(fgHex);
  const [br, bg, bb] = hexToLinearSrgb(bgHex);

  const fgLab = linearSrgbToOklab(fr, fg, fb);
  const bgLab = linearSrgbToOklab(br, bg, bb);

  const lerp = (x: number, y: number) => x * amount + y * (1 - amount);
  const L = lerp(fgLab[0], bgLab[0]);
  const a = lerp(fgLab[1], bgLab[1]);
  const b = lerp(fgLab[2], bgLab[2]);

  const [r, g, bl] = oklabToLinearSrgb(L, a, b);
  return toHex(r, g, bl);
}

/** how one syntax token is drawn: a role for the ink, and the channels a monochrome theme has left */
export interface SyntaxStyle {
  role: Role;
  background?: Role;
  bold?: boolean;
  italic?: boolean;
}

export interface Lichen {
  name: "lichen";
  roles: Record<Role, { oklch: Oklch; hex: string; meaning: string }>;
  hex(role: Role): string;
  ansi: readonly string[];
  syntax: Record<string, SyntaxStyle>;
  diff: { added: string; deleted: string; changed: string };
}

function fail(message: string): never {
  throw new Error(`lichen: invalid palette.json — ${message}`);
}

export function loadPalette(json?: unknown): Lichen {
  const data = (json ?? defaultPaletteJson) as {
    name: string;
    roles: Record<string, { oklch: Oklch; meaning: string }>;
    ansi: string[];
    syntax: Record<string, string | { role: string; background?: string; bold?: boolean; italic?: boolean }>;
    diff: Record<string, { role: string; mix: number }>;
  };

  const roleEntries = Object.keys(data.roles);
  for (const role of roleEntries) {
    if (!isRole(role)) fail(`unknown role "${role}" in roles`);
  }
  for (const role of ROLES) {
    if (!(role in data.roles)) fail(`missing role "${role}" in roles`);
  }

  const roles = {} as Record<Role, { oklch: Oklch; hex: string; meaning: string }>;
  for (const role of ROLES) {
    const entry = data.roles[role];
    const [l, c, h] = entry.oklch;
    roles[role] = { oklch: entry.oklch, hex: oklchToHex(l, c, h), meaning: entry.meaning };
  }

  const hex = (role: Role): string => roles[role].hex;

  if (!Array.isArray(data.ansi) || data.ansi.length !== 16) {
    fail(`ansi must list exactly 16 roles, got ${Array.isArray(data.ansi) ? data.ansi.length : typeof data.ansi}`);
  }
  const ansi = data.ansi.map((role, i) => {
    if (!isRole(role)) fail(`ansi[${i}] references unknown role "${role}"`);
    return hex(role);
  });

  const syntax: Record<string, SyntaxStyle> = {};
  for (const [token, entry] of Object.entries(data.syntax)) {
    const style = typeof entry === "string" ? { role: entry } : entry;
    if (!isRole(style.role)) fail(`syntax.${token} references unknown role "${style.role}"`);
    if (style.background !== undefined && !isRole(style.background)) {
      fail(`syntax.${token}.background references unknown role "${style.background}"`);
    }
    syntax[token] = {
      role: style.role,
      ...(style.background ? { background: style.background } : {}),
      ...(style.bold ? { bold: true } : {}),
      ...(style.italic ? { italic: true } : {}),
    };
  }

  const diff = {} as { added: string; deleted: string; changed: string };
  for (const key of ["added", "deleted", "changed"] as const) {
    const entry = data.diff?.[key];
    if (!entry) fail(`diff.${key} is missing`);
    if (!isRole(entry.role)) fail(`diff.${key} references unknown role "${entry.role}"`);
    if (typeof entry.mix !== "number" || entry.mix < 0 || entry.mix > 1) fail(`diff.${key}.mix must be a number in [0, 1]`);
    diff[key] = mixOklab(hex(entry.role), hex("base"), entry.mix);
  }

  return {
    name: "lichen",
    roles,
    hex,
    ansi,
    syntax,
    diff,
  };
}

export const lichen: Lichen = loadPalette();
