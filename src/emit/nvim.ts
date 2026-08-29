import type { Lichen, Role } from "../palette";
import type { Emitter } from "./types";

/** a highlight spec: roles for fg/bg/sp, plus styles. "NONE" clears; a bare string links. */
type Spec =
  | string
  | {
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

  // syntax (legacy groups)
  Comment: { fg: "muted", italic: true },
  Constant: { fg: "text" },
  String: { fg: "text", bg: "overlay" },
  Character: { fg: "text", bg: "overlay" },
  Number: { fg: "text" },
  Float: { fg: "text" },
  Boolean: { fg: "subtle" },
  Identifier: { fg: "text" },
  Function: { fg: "accent" },
  Statement: { fg: "subtle" },
  Conditional: { fg: "subtle" },
  Repeat: { fg: "subtle" },
  Label: { fg: "subtle" },
  Keyword: { fg: "subtle" },
  Exception: { fg: "subtle" },
  Operator: { fg: "muted" },
  PreProc: { fg: "subtle" },
  Include: { fg: "subtle" },
  Define: { fg: "subtle" },
  Macro: { fg: "subtle" },
  PreCondit: { fg: "subtle" },
  Type: { fg: "bright" },
  StorageClass: { fg: "subtle" },
  Structure: { fg: "bright" },
  Typedef: { fg: "bright" },
  Special: { fg: "subtle" },
  SpecialChar: { fg: "subtle" },
  Tag: { fg: "bright" },
  Delimiter: { fg: "muted" },
  SpecialComment: { fg: "muted", italic: true },
  Debug: { fg: "subtle" },
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
  "@variable": { fg: "text" },
  "@variable.builtin": { fg: "subtle" },
  "@variable.parameter": { fg: "text" },
  "@variable.member": { fg: "text" },
  "@constant": { fg: "text" },
  "@constant.builtin": { fg: "subtle" },
  "@constant.macro": { fg: "subtle" },
  "@module": { fg: "text" },
  "@label": { fg: "subtle" },
  "@string": { fg: "text", bg: "overlay" },
  "@string.documentation": { fg: "muted", italic: true },
  "@string.regexp": { fg: "subtle", bg: "overlay" },
  "@string.escape": { fg: "subtle", bg: "overlay" },
  "@string.special": { fg: "subtle", bg: "overlay" },
  "@string.special.url": { fg: "accent-quiet", underline: true },
  "@string.special.path": { fg: "text", bg: "overlay" },
  "@string.special.symbol": { fg: "text" },
  "@character": { fg: "text", bg: "overlay" },
  "@character.special": { fg: "subtle" },
  "@boolean": { fg: "subtle" },
  "@number": { fg: "text" },
  "@number.float": { fg: "text" },
  "@type": { fg: "bright" },
  "@type.builtin": { fg: "bright" },
  "@type.definition": { fg: "bright" },
  "@attribute": { fg: "subtle" },
  "@attribute.builtin": { fg: "subtle" },
  "@property": { fg: "text" },
  "@function": { fg: "accent" },
  "@function.builtin": { fg: "accent" },
  "@function.call": { fg: "accent" },
  "@function.macro": { fg: "accent" },
  "@function.method": { fg: "accent" },
  "@function.method.call": { fg: "accent" },
  "@constructor": { fg: "bright" },
  "@operator": { fg: "muted" },
  "@keyword": { fg: "subtle" },
  "@keyword.coroutine": { fg: "subtle" },
  "@keyword.function": { fg: "subtle" },
  "@keyword.operator": { fg: "subtle" },
  "@keyword.import": { fg: "subtle" },
  "@keyword.type": { fg: "subtle" },
  "@keyword.modifier": { fg: "subtle" },
  "@keyword.repeat": { fg: "subtle" },
  "@keyword.return": { fg: "subtle" },
  "@keyword.debug": { fg: "subtle" },
  "@keyword.exception": { fg: "subtle" },
  "@keyword.conditional": { fg: "subtle" },
  "@keyword.conditional.ternary": { fg: "muted" },
  "@keyword.directive": { fg: "subtle" },
  "@keyword.directive.define": { fg: "subtle" },
  "@punctuation.delimiter": { fg: "muted" },
  "@punctuation.bracket": { fg: "muted" },
  "@punctuation.special": { fg: "muted" },
  "@tag": { fg: "bright" },
  "@tag.builtin": { fg: "bright" },
  "@tag.attribute": { fg: "text" },
  "@tag.delimiter": { fg: "muted" },
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
  "@lsp.type.class": { fg: "bright" },
  "@lsp.type.decorator": { fg: "subtle" },
  "@lsp.type.enum": { fg: "bright" },
  "@lsp.type.enumMember": { fg: "text" },
  "@lsp.type.function": { fg: "accent" },
  "@lsp.type.interface": { fg: "bright" },
  "@lsp.type.macro": { fg: "subtle" },
  "@lsp.type.method": { fg: "accent" },
  "@lsp.type.namespace": { fg: "text" },
  "@lsp.type.parameter": { fg: "text" },
  "@lsp.type.property": { fg: "text" },
  "@lsp.type.struct": { fg: "bright" },
  "@lsp.type.type": { fg: "bright" },
  "@lsp.type.typeParameter": { fg: "bright" },
  "@lsp.type.variable": { fg: "text" },
  "@lsp.type.keyword": { fg: "subtle" },
  "@lsp.mod.deprecated": { strikethrough: true },
  "@lsp.typemod.function.defaultLibrary": { fg: "accent" },
  "@lsp.typemod.variable.defaultLibrary": { fg: "subtle" },
  "@lsp.typemod.variable.readonly": { fg: "text" },

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
  const parts: string[] = [];
  if (spec.fg) parts.push(`fg = ${luaString(resolve(p, spec.fg))}`);
  if (spec.bg) parts.push(`bg = ${luaString(resolve(p, spec.bg))}`);
  if (spec.sp) parts.push(`sp = ${luaString(resolve(p, spec.sp))}`);
  for (const k of ["bold", "italic", "underline", "undercurl", "strikethrough", "reverse"] as const) {
    if (spec[k]) parts.push(`${k} = true`);
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
