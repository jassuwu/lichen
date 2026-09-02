import type { Lichen, Role } from "../palette";
import type { Emitter } from "./types";

/**
 * a highlight spec: roles for fg/bg/sp, plus styles. "NONE" clears; a bare string links;
 * `syntax` takes ink, box, weight and slant from the palette's syntax table, then applies the rest on top.
 */
type Spec =
  | string
  | {
      syntax?: string;
      fg?: Role | "NONE";
      bg?: Role | "NONE" | "diff.added" | "diff.deleted" | "diff.changed";
      sp?: Role;
      bold?: true;
      italic?: true;
      underline?: true;
      undercurl?: true;
      strikethrough?: true;
      reverse?: true;
    };

/** highlight groups → roles. this table is the whole nvim port; the lua is output. */
export const groups: Record<string, Spec> = {
  // editor
  Normal: { fg: "text", bg: "base" },
  NormalNC: { fg: "text", bg: "base" },
  NormalFloat: { fg: "text", bg: "overlay" },
  FloatBorder: { fg: "border", bg: "overlay" },
  FloatTitle: { fg: "bright", bg: "overlay" },
  Cursor: { fg: "on-accent", bg: "accent" },
  lCursor: "Cursor",
  CursorIM: "Cursor",
  TermCursor: "Cursor",
  CursorLine: { bg: "surface" },
  CursorColumn: { bg: "surface" },
  ColorColumn: { bg: "surface" },
  CursorLineNr: { fg: "subtle", bg: "surface" },
  LineNr: { fg: "muted" },
  LineNrAbove: { fg: "muted" },
  LineNrBelow: { fg: "muted" },
  SignColumn: { fg: "muted", bg: "NONE" },
  FoldColumn: { fg: "muted" },
  Folded: { fg: "muted", bg: "surface" },
  WinSeparator: { fg: "border" },
  VertSplit: { fg: "border" },
  StatusLine: { fg: "subtle", bg: "surface" },
  StatusLineNC: { fg: "muted", bg: "surface" },
  TabLine: { fg: "muted", bg: "surface" },
  TabLineSel: { fg: "text", bg: "base" },
  TabLineFill: { bg: "surface" },
  WinBar: { fg: "subtle", bg: "NONE" },
  WinBarNC: { fg: "muted", bg: "NONE" },
  Pmenu: { fg: "text", bg: "overlay" },
  PmenuSel: { fg: "bright", bg: "border" },
  PmenuKind: { fg: "subtle", bg: "overlay" },
  PmenuExtra: { fg: "muted", bg: "overlay" },
  PmenuSbar: { bg: "overlay" },
  PmenuThumb: { bg: "border" },
  Visual: { bg: "overlay" },
  VisualNOS: { bg: "overlay" },
  Search: { fg: "on-accent", bg: "accent" },
  IncSearch: { fg: "on-accent", bg: "accent" },
  CurSearch: { fg: "on-accent", bg: "accent" },
  Substitute: { fg: "on-accent", bg: "accent" },
  MatchParen: { fg: "accent", bold: true },
  NonText: { fg: "border" },
  Whitespace: { fg: "border" },
  SpecialKey: { fg: "muted" },
  EndOfBuffer: { fg: "base" },
  Conceal: { fg: "muted" },
  Directory: { fg: "text" },
  Title: { fg: "bright" },
  Question: { fg: "subtle" },
  MoreMsg: { fg: "subtle" },
  ModeMsg: { fg: "subtle" },
  MsgArea: { fg: "text" },
  ErrorMsg: { fg: "error" },
  WarningMsg: { fg: "warning" },
  QuickFixLine: { bg: "surface" },
  WildMenu: { fg: "on-accent", bg: "accent" },
  SpellBad: { sp: "error", undercurl: true },
  SpellCap: { sp: "warning", undercurl: true },
  SpellLocal: { sp: "subtle", undercurl: true },
  SpellRare: { sp: "subtle", undercurl: true },
  DiffAdd: { bg: "diff.added" },
  DiffDelete: { fg: "error", bg: "diff.deleted" },
  DiffChange: { bg: "diff.changed" },
  DiffText: { bg: "diff.changed", bold: true },
  Added: { fg: "accent-quiet" },
  Removed: { fg: "error" },
  Changed: { fg: "warning" },
  healthSuccess: { fg: "accent-quiet" },
  healthWarning: { fg: "warning" },
  healthError: { fg: "error" },

  // syntax (legacy groups) — every entry reads palette.json's syntax table
  Comment: { syntax: "comment" },
  Constant: { syntax: "constant" },
  String: { syntax: "string" },
  Character: { syntax: "string" },
  Number: { syntax: "number" },
  Float: { syntax: "number" },
  Boolean: { syntax: "boolean" },
  Identifier: { syntax: "identifier" },
  Function: { syntax: "function-definition" },
  Statement: { syntax: "keyword" },
  Conditional: { syntax: "keyword" },
  Repeat: { syntax: "keyword" },
  Label: { syntax: "keyword" },
  Keyword: { syntax: "keyword" },
  Exception: { syntax: "keyword" },
  Operator: { syntax: "operator" },
  PreProc: { syntax: "keyword" },
  Include: { syntax: "keyword" },
  Define: { syntax: "keyword" },
  Macro: { syntax: "decorator" },
  PreCondit: { syntax: "keyword" },
  Type: { syntax: "type" },
  StorageClass: { syntax: "keyword" },
  Structure: { syntax: "type" },
  Typedef: { syntax: "type-definition" },
  Special: { syntax: "builtin" },
  SpecialChar: { syntax: "string-escape" },
  Tag: { syntax: "type" },
  Delimiter: { syntax: "punctuation" },
  SpecialComment: { syntax: "comment" },
  Debug: { syntax: "builtin" },
  Underlined: { underline: true },
  Ignore: { fg: "muted" },
  Error: { fg: "error" },
  Todo: { fg: "accent-quiet", bold: true },

  // treesitter
  "@comment": "Comment",
  "@comment.error": { fg: "error", bold: true },
  "@comment.warning": { fg: "warning", bold: true },
  "@comment.todo": { fg: "accent-quiet", bold: true },
  "@comment.note": { fg: "subtle", bold: true },
  "@variable": { syntax: "identifier" },
  "@variable.builtin": { syntax: "builtin" },
  "@variable.parameter": { syntax: "parameter" },
  "@variable.member": { syntax: "property" },
  "@constant": { syntax: "constant" },
  "@constant.builtin": { syntax: "boolean" },
  "@constant.macro": { syntax: "decorator" },
  "@module": { syntax: "identifier" },
  "@label": { syntax: "keyword" },
  "@string": { syntax: "string" },
  "@string.documentation": { syntax: "comment" },
  "@string.regexp": { syntax: "regexp" },
  "@string.escape": { syntax: "string-escape" },
  "@string.special": { syntax: "string-escape" },
  "@string.special.url": { fg: "accent-quiet", underline: true },
  "@string.special.path": { syntax: "string" },
  "@string.special.symbol": { syntax: "identifier" },
  "@character": { syntax: "string" },
  "@character.special": { syntax: "string-escape" },
  "@boolean": { syntax: "boolean" },
  "@number": { syntax: "number" },
  "@number.float": { syntax: "number" },
  "@type": { syntax: "type" },
  "@type.builtin": { syntax: "type" },
  "@type.definition": { syntax: "type-definition" },
  "@attribute": { syntax: "decorator" },
  "@attribute.builtin": { syntax: "decorator" },
  "@property": { syntax: "property" },
  "@function": { syntax: "function-definition" },
  "@function.builtin": { syntax: "function" },
  "@function.call": { syntax: "function" },
  "@function.macro": { syntax: "function" },
  "@function.method": { syntax: "function-definition" },
  "@function.method.call": { syntax: "function" },
  "@constructor": { syntax: "type" },
  "@operator": { syntax: "operator" },
  "@keyword": { syntax: "keyword" },
  "@keyword.coroutine": { syntax: "keyword" },
  "@keyword.function": { syntax: "keyword" },
  "@keyword.operator": { syntax: "keyword" },
  "@keyword.import": { syntax: "keyword" },
  "@keyword.type": { syntax: "keyword" },
  "@keyword.modifier": { syntax: "keyword" },
  "@keyword.repeat": { syntax: "keyword" },
  "@keyword.return": { syntax: "keyword" },
  "@keyword.debug": { syntax: "keyword" },
  "@keyword.exception": { syntax: "keyword" },
  "@keyword.conditional": { syntax: "keyword" },
  "@keyword.conditional.ternary": { syntax: "operator" },
  "@keyword.directive": { syntax: "keyword" },
  "@keyword.directive.define": { syntax: "keyword" },
  "@punctuation.delimiter": { syntax: "punctuation" },
  "@punctuation.bracket": { syntax: "punctuation" },
  "@punctuation.special": { syntax: "punctuation", bg: "overlay" },
  "@tag": { syntax: "type" },
  "@tag.builtin": { syntax: "type" },
  "@tag.attribute": { syntax: "property" },
  "@tag.delimiter": { syntax: "punctuation" },
  "@markup.strong": { bold: true },
  "@markup.italic": { italic: true },
  "@markup.strikethrough": { strikethrough: true },
  "@markup.underline": { underline: true },
  "@markup.heading": { fg: "bright", bold: true },
  "@markup.quote": { fg: "subtle", italic: true },
  "@markup.math": { fg: "text" },
  "@markup.link": { fg: "accent-quiet" },
  "@markup.link.label": { fg: "text" },
  "@markup.link.url": { fg: "accent-quiet", underline: true },
  "@markup.raw": { fg: "text", bg: "overlay" },
  "@markup.raw.block": { fg: "text" },
  "@markup.list": { fg: "muted" },
  "@markup.list.checked": { fg: "accent-quiet" },
  "@markup.list.unchecked": { fg: "muted" },
  "@diff.plus": { fg: "accent-quiet" },
  "@diff.minus": { fg: "error" },
  "@diff.delta": { fg: "warning" },

  // lsp semantic tokens
  "@lsp.type.class": { syntax: "type" },
  "@lsp.type.decorator": { syntax: "decorator" },
  "@lsp.type.enum": { syntax: "type" },
  "@lsp.type.enumMember": { syntax: "constant" },
  "@lsp.type.function": { syntax: "function" },
  "@lsp.type.interface": { syntax: "type" },
  "@lsp.type.macro": { syntax: "decorator" },
  "@lsp.type.method": { syntax: "function" },
  "@lsp.type.namespace": { syntax: "identifier" },
  "@lsp.type.parameter": { syntax: "parameter" },
  "@lsp.type.property": { syntax: "property" },
  "@lsp.type.struct": { syntax: "type" },
  "@lsp.type.type": { syntax: "type" },
  "@lsp.type.typeParameter": { syntax: "type" },
  "@lsp.type.variable": { syntax: "identifier" },
  "@lsp.type.keyword": { syntax: "keyword" },
  "@lsp.mod.deprecated": { strikethrough: true },
  "@lsp.typemod.function.declaration": { syntax: "function-definition" },
  "@lsp.typemod.method.declaration": { syntax: "function-definition" },
  "@lsp.typemod.class.declaration": { syntax: "type-definition" },
  "@lsp.typemod.interface.declaration": { syntax: "type-definition" },
  "@lsp.typemod.enum.declaration": { syntax: "type-definition" },
  "@lsp.typemod.type.declaration": { syntax: "type-definition" },
  "@lsp.typemod.function.defaultLibrary": { syntax: "function" },
  "@lsp.typemod.variable.defaultLibrary": { syntax: "builtin" },
  "@lsp.typemod.variable.readonly": { syntax: "identifier" },

  // diagnostics + lsp ui
  DiagnosticError: { fg: "error" },
  DiagnosticWarn: { fg: "warning" },
  DiagnosticInfo: { fg: "subtle" },
  DiagnosticHint: { fg: "muted" },
  DiagnosticOk: { fg: "accent-quiet" },
  DiagnosticUnderlineError: { sp: "error", undercurl: true },
  DiagnosticUnderlineWarn: { sp: "warning", undercurl: true },
  DiagnosticUnderlineInfo: { sp: "subtle", undercurl: true },
  DiagnosticUnderlineHint: { sp: "muted", undercurl: true },
  DiagnosticVirtualTextError: { fg: "error", bg: "diff.deleted" },
  DiagnosticVirtualTextWarn: { fg: "warning", bg: "diff.changed" },
  DiagnosticVirtualTextInfo: { fg: "subtle", bg: "surface" },
  DiagnosticVirtualTextHint: { fg: "muted", bg: "surface" },
  DiagnosticSignError: { fg: "error" },
  DiagnosticSignWarn: { fg: "warning" },
  DiagnosticSignInfo: { fg: "subtle" },
  DiagnosticSignHint: { fg: "muted" },
  DiagnosticUnnecessary: { fg: "muted" },
  DiagnosticDeprecated: { sp: "muted", strikethrough: true },
  LspReferenceText: { bg: "surface" },
  LspReferenceRead: { bg: "surface" },
  LspReferenceWrite: { bg: "surface", underline: true },
  LspInlayHint: { fg: "muted" },
  LspSignatureActiveParameter: { fg: "accent" },
  LspCodeLens: { fg: "muted" },

  // gitsigns
  GitSignsAdd: { fg: "accent-quiet" },
  GitSignsChange: { fg: "warning" },
  GitSignsDelete: { fg: "error" },
  GitSignsUntracked: { fg: "muted" },
  GitSignsCurrentLineBlame: { fg: "muted", italic: true },
  GitSignsAddInline: { bg: "diff.added" },
  GitSignsDeleteInline: { bg: "diff.deleted" },
  GitSignsChangeInline: { bg: "diff.changed" },

  // fzf-lua
  FzfLuaNormal: { fg: "text", bg: "overlay" },
  FzfLuaBorder: { fg: "border", bg: "overlay" },
  FzfLuaTitle: { fg: "bright", bg: "overlay" },
  FzfLuaPreviewNormal: { fg: "text", bg: "base" },
  FzfLuaPreviewBorder: { fg: "border", bg: "base" },
  FzfLuaPreviewTitle: { fg: "bright", bg: "base" },
  FzfLuaCursorLine: { bg: "border" },
  FzfLuaCursorLineNr: { fg: "subtle" },
  FzfLuaSearch: { fg: "on-accent", bg: "accent" },
  FzfLuaScrollBorderFull: { fg: "border" },
  FzfLuaHeaderBind: { fg: "accent" },
  FzfLuaHeaderText: { fg: "subtle" },
  FzfLuaPathColNr: { fg: "muted" },
  FzfLuaPathLineNr: { fg: "muted" },
  FzfLuaBufName: { fg: "text" },
  FzfLuaBufNr: { fg: "muted" },
  FzfLuaBufFlagCur: { fg: "accent" },
  FzfLuaBufFlagAlt: { fg: "subtle" },
  FzfLuaTabTitle: { fg: "bright" },
  FzfLuaTabMarker: { fg: "accent" },
  FzfLuaLiveSym: { fg: "accent" },
  FzfLuaFzfMatch: { fg: "accent" },
  FzfLuaFzfPrompt: { fg: "accent" },
  FzfLuaFzfPointer: { fg: "accent" },
  FzfLuaFzfMarker: { fg: "accent" },
  FzfLuaFzfHeader: { fg: "subtle" },
  FzfLuaFzfInfo: { fg: "muted" },
  FzfLuaFzfCursorLine: { bg: "border" },
  FzfLuaFzfQuery: { fg: "text" },
  FzfLuaFzfSpinner: { fg: "accent" },
  FzfLuaFzfGutter: { bg: "overlay" },
  FzfLuaFzfSeparator: { fg: "border" },
  FzfLuaFzfBorder: { fg: "border" },
  FzfLuaFzfScrollbar: { fg: "border" },

  // oil
  OilDir: { fg: "bright" },
  OilDirIcon: { fg: "subtle" },
  OilFile: { fg: "text" },
  OilLink: { fg: "accent-quiet" },
  OilLinkTarget: { fg: "muted" },
  OilSocket: { fg: "subtle" },
  OilCreate: { fg: "accent-quiet" },
  OilDelete: { fg: "error" },
  OilMove: { fg: "warning" },
  OilCopy: { fg: "warning" },
  OilChange: { fg: "warning" },

  // mini
  MiniSurround: { fg: "on-accent", bg: "accent" },
  MiniPairs: { fg: "text" },
};

function luaString(s: string): string {
  return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function resolve(p: Lichen, v: string): string {
  if (v === "NONE") return "NONE";
  if (v.startsWith("diff.")) return p.diff[v.slice(5) as "added" | "deleted" | "changed"];
  return p.hex(v as Role);
}

function specToLua(p: Lichen, spec: Spec): string {
  if (typeof spec === "string") return `{ link = ${luaString(spec)} }`;
  let full = spec;
  if (spec.syntax) {
    const s = p.syntax[spec.syntax];
    if (!s) throw new Error(`lichen: palette.json has no syntax entry "${spec.syntax}"`);
    full = {
      fg: s.role,
      ...(s.background ? { bg: s.background } : {}),
      ...(s.bold ? { bold: true } : {}),
      ...(s.italic ? { italic: true } : {}),
      ...spec,
    };
  }
  const parts: string[] = [];
  if (full.fg) parts.push(`fg = ${luaString(resolve(p, full.fg))}`);
  if (full.bg) parts.push(`bg = ${luaString(resolve(p, full.bg))}`);
  if (full.sp) parts.push(`sp = ${luaString(resolve(p, full.sp))}`);
  for (const k of ["bold", "italic", "underline", "undercurl", "strikethrough", "reverse"] as const) {
    if (full[k]) parts.push(`${k} = true`);
  }
  return `{ ${parts.join(", ")} }`;
}

const HEADER = "-- lichen — generated by `bun run build`, do not edit\n";

export const nvimPalette: Emitter = {
  path: "lua/lichen/palette.lua",
  render(p) {
    const lines = Object.entries(p.roles).map(([role, r]) => `  [${luaString(role)}] = ${luaString(r.hex)},`);
    const diff = Object.entries(p.diff).map(([k, v]) => `    ${k} = ${luaString(v)},`);
    return [
      HEADER,
      "---@class lichen.palette",
      "local M = {",
      ...lines,
      "  diff = {",
      ...diff,
      "  },",
      `  ansi = { ${p.ansi.map(luaString).join(", ")} },`,
      "}",
      "",
      "return M",
      "",
    ].join("\n");
  },
};

export const nvimGroups: Emitter = {
  path: "lua/lichen/groups.lua",
  render(p) {
    const lines = Object.entries(groups).map(([g, s]) => `  [${luaString(g)}] = ${specToLua(p, s)},`);
    return [HEADER, "return {", ...lines, "}", ""].join("\n");
  },
};

export const nvimInit: Emitter = {
  path: "lua/lichen/init.lua",
  render() {
    return `${HEADER}
local M = {}

---@class lichen.config
---@field transparent? boolean  -- keep the terminal's background instead of base
M.config = { transparent = false }

---@param opts? lichen.config
function M.setup(opts)
  M.config = vim.tbl_deep_extend("force", M.config, opts or {})
end

function M.load()
  if vim.g.colors_name then
    vim.cmd("hi clear")
  end
  vim.o.termguicolors = true
  vim.o.background = "dark"
  vim.g.colors_name = "lichen"

  local palette = require("lichen.palette")
  local groups = require("lichen.groups")

  if M.config.transparent then
    for _, name in ipairs({ "Normal", "NormalNC", "SignColumn", "LineNr", "EndOfBuffer" }) do
      local g = groups[name]
      if type(g) == "table" and g.bg then
        g.bg = "NONE"
      end
    end
  end

  for name, spec in pairs(groups) do
    vim.api.nvim_set_hl(0, name, spec)
  end

  for i, hex in ipairs(palette.ansi) do
    vim.g["terminal_color_" .. (i - 1)] = hex
  end
end

return M
`;
  },
};

export const nvimColors: Emitter = {
  path: "colors/lichen.lua",
  render() {
    return `${HEADER}require("lichen").load()\n`;
  },
};

export const nvim: Emitter[] = [nvimPalette, nvimGroups, nvimInit, nvimColors];
