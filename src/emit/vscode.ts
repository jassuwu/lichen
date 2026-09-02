import type { Lichen, Role } from "../palette";
import type { Emitter } from "./types";

const VERSION = "0.1.0";

/** workbench colour → role. every key t3code reads (apps/web/src/openVsxThemes.ts USED_WORKBENCH_COLORS) is here, plus the usual suspects. */
const workbench: Record<string, Role | "diff.added" | "diff.deleted" | "diff.changed" | `${Role}@${number}`> = {
  // base
  foreground: "text",
  descriptionForeground: "subtle",
  disabledForeground: "muted",
  errorForeground: "error",
  focusBorder: "accent",
  contrastBorder: "border",
  "icon.foreground": "subtle",
  "selection.background": "overlay",
  "widget.border": "border",
  "widget.shadow": "base@0.6",
  "textLink.foreground": "accent-quiet",
  "textLink.activeForeground": "accent",
  "textCodeBlock.background": "overlay",
  "textPreformat.foreground": "text",
  "textBlockQuote.background": "surface",
  "textSeparator.foreground": "border",
  // editor
  "editor.background": "base",
  "editor.foreground": "text",
  "editorPane.background": "base",
  "editorCursor.foreground": "accent",
  "editorCursor.background": "on-accent",
  "editor.selectionBackground": "overlay",
  "editor.inactiveSelectionBackground": "surface",
  "editor.selectionHighlightBackground": "surface",
  "editor.wordHighlightBackground": "surface",
  "editor.wordHighlightStrongBackground": "overlay",
  "editor.findMatchBackground": "accent",
  "editor.findMatchForeground": "on-accent",
  "editor.findMatchHighlightBackground": "accent@0.25",
  "editor.lineHighlightBackground": "surface",
  "editor.lineHighlightBorder": "surface",
  "editorLineNumber.foreground": "muted",
  "editorLineNumber.activeForeground": "subtle",
  "editorIndentGuide.background1": "border",
  "editorIndentGuide.activeBackground1": "muted",
  "editorWhitespace.foreground": "border",
  "editorRuler.foreground": "border",
  "editorBracketMatch.background": "overlay",
  "editorBracketMatch.border": "accent",
  "editorBracketHighlight.foreground1": "muted",
  "editorBracketHighlight.foreground2": "subtle",
  "editorBracketHighlight.foreground3": "muted",
  "editorBracketHighlight.foreground4": "subtle",
  "editorBracketHighlight.foreground5": "muted",
  "editorBracketHighlight.foreground6": "subtle",
  "editorCodeLens.foreground": "muted",
  "editorInlayHint.foreground": "muted",
  "editorInlayHint.background": "base",
  "editorLink.activeForeground": "accent",
  "editorError.foreground": "error",
  "editorWarning.foreground": "warning",
  "editorInfo.foreground": "subtle",
  "editorHint.foreground": "muted",
  "editorGutter.background": "base",
  "editorGutter.addedBackground": "accent-quiet",
  "editorGutter.modifiedBackground": "warning",
  "editorGutter.deletedBackground": "error",
  "editorOverviewRuler.border": "border",
  "editorOverviewRuler.findMatchForeground": "accent@0.6",
  "editorGroup.border": "border",
  "editorGroupHeader.tabsBackground": "surface",
  "editorGroupHeader.noTabsBackground": "surface",
  "editorWidget.background": "overlay",
  "editorWidget.border": "border",
  "editorWidget.foreground": "text",
  "editorSuggestWidget.background": "overlay",
  "editorSuggestWidget.border": "border",
  "editorSuggestWidget.foreground": "text",
  "editorSuggestWidget.highlightForeground": "accent",
  "editorSuggestWidget.selectedBackground": "border",
  "editorSuggestWidget.selectedForeground": "bright",
  "editorHoverWidget.background": "overlay",
  "editorHoverWidget.border": "border",
  "editorStickyScroll.background": "surface",
  "editorStickyScrollHover.background": "overlay",
  "diffEditor.insertedTextBackground": "diff.added",
  "diffEditor.removedTextBackground": "diff.deleted",
  "diffEditor.insertedLineBackground": "diff.added",
  "diffEditor.removedLineBackground": "diff.deleted",
  "diffEditor.diagonalFill": "border",
  "merge.currentHeaderBackground": "accent-quiet@0.3",
  "merge.incomingHeaderBackground": "blue-tint@0.3",
  // workbench chrome
  "activityBar.background": "surface",
  "activityBar.foreground": "text",
  "activityBar.inactiveForeground": "muted",
  "activityBar.border": "border",
  "activityBar.activeBorder": "accent",
  "activityBarBadge.background": "accent",
  "activityBarBadge.foreground": "on-accent",
  "badge.background": "accent",
  "badge.foreground": "on-accent",
  "sideBar.background": "surface",
  "sideBar.foreground": "subtle",
  "sideBar.border": "border",
  "sideBarTitle.foreground": "text",
  "sideBarSectionHeader.background": "surface",
  "sideBarSectionHeader.foreground": "subtle",
  "sideBarSectionHeader.border": "border",
  "list.activeSelectionBackground": "overlay",
  "list.activeSelectionForeground": "bright",
  "list.inactiveSelectionBackground": "overlay",
  "list.inactiveSelectionForeground": "text",
  "list.hoverBackground": "overlay",
  "list.hoverForeground": "text",
  "list.focusBackground": "overlay",
  "list.focusOutline": "border",
  "list.highlightForeground": "accent",
  "list.errorForeground": "error",
  "list.warningForeground": "warning",
  "list.deemphasizedForeground": "muted",
  "tree.indentGuidesStroke": "border",
  "tab.activeBackground": "base",
  "tab.activeForeground": "text",
  "tab.activeBorderTop": "accent",
  "tab.inactiveBackground": "surface",
  "tab.inactiveForeground": "muted",
  "tab.border": "border",
  "tab.hoverBackground": "overlay",
  "tab.unfocusedActiveForeground": "subtle",
  "titleBar.activeBackground": "surface",
  "titleBar.activeForeground": "subtle",
  "titleBar.inactiveBackground": "surface",
  "titleBar.inactiveForeground": "muted",
  "titleBar.border": "border",
  "statusBar.background": "surface",
  "statusBar.foreground": "subtle",
  "statusBar.border": "border",
  "statusBar.debuggingBackground": "warning",
  "statusBar.debuggingForeground": "on-accent",
  "statusBar.noFolderBackground": "surface",
  "statusBarItem.hoverBackground": "overlay",
  "statusBarItem.remoteBackground": "surface",
  "statusBarItem.remoteForeground": "subtle",
  "statusBarItem.errorBackground": "error",
  "statusBarItem.errorForeground": "on-accent",
  "statusBarItem.warningBackground": "warning",
  "statusBarItem.warningForeground": "on-accent",
  "panel.background": "base",
  "panel.border": "border",
  "panelTitle.activeForeground": "text",
  "panelTitle.activeBorder": "accent",
  "panelTitle.inactiveForeground": "muted",
  "breadcrumb.foreground": "muted",
  "breadcrumb.focusForeground": "text",
  "breadcrumb.activeSelectionForeground": "text",
  "breadcrumbPicker.background": "overlay",
  "menu.background": "overlay",
  "menu.foreground": "text",
  "menu.selectionBackground": "border",
  "menu.selectionForeground": "bright",
  "menu.separatorBackground": "border",
  "menu.border": "border",
  "menubar.selectionBackground": "overlay",
  "quickInput.background": "overlay",
  "quickInput.foreground": "text",
  "quickInputTitle.background": "overlay",
  "quickInputList.focusBackground": "border",
  "quickInputList.focusForeground": "bright",
  "pickerGroup.foreground": "subtle",
  "pickerGroup.border": "border",
  "input.background": "base",
  "input.foreground": "text",
  "input.border": "border",
  "input.placeholderForeground": "muted",
  "inputOption.activeBackground": "overlay",
  "inputOption.activeBorder": "accent",
  "inputOption.activeForeground": "text",
  "inputValidation.errorBackground": "base",
  "inputValidation.errorBorder": "error",
  "inputValidation.warningBackground": "base",
  "inputValidation.warningBorder": "warning",
  "inputValidation.infoBackground": "base",
  "inputValidation.infoBorder": "subtle",
  "dropdown.background": "overlay",
  "dropdown.foreground": "text",
  "dropdown.border": "border",
  "dropdown.listBackground": "overlay",
  "button.background": "accent",
  "button.foreground": "on-accent",
  "button.hoverBackground": "accent-quiet",
  "button.secondaryBackground": "overlay",
  "button.secondaryForeground": "text",
  "button.secondaryHoverBackground": "border",
  "button.border": "accent",
  "checkbox.background": "base",
  "checkbox.border": "border",
  "checkbox.foreground": "accent",
  "progressBar.background": "accent",
  "scrollbar.shadow": "base",
  "scrollbarSlider.background": "border@0.5",
  "scrollbarSlider.hoverBackground": "border",
  "scrollbarSlider.activeBackground": "muted",
  "minimap.background": "base",
  "minimap.selectionHighlight": "overlay",
  "minimap.findMatchHighlight": "accent",
  "minimapSlider.background": "border@0.3",
  "notifications.background": "overlay",
  "notifications.foreground": "text",
  "notifications.border": "border",
  "notificationCenterHeader.background": "surface",
  "notificationLink.foreground": "accent-quiet",
  "notificationsErrorIcon.foreground": "error",
  "notificationsWarningIcon.foreground": "warning",
  "notificationsInfoIcon.foreground": "subtle",
  "peekView.border": "border",
  "peekViewEditor.background": "surface",
  "peekViewResult.background": "overlay",
  "peekViewTitle.background": "overlay",
  "peekViewEditor.matchHighlightBackground": "accent@0.25",
  "peekViewResult.matchHighlightBackground": "accent@0.25",
  "peekViewResult.selectionBackground": "border",
  // git
  "gitDecoration.addedResourceForeground": "accent-quiet",
  "gitDecoration.untrackedResourceForeground": "accent-quiet",
  "gitDecoration.modifiedResourceForeground": "warning",
  "gitDecoration.deletedResourceForeground": "error",
  "gitDecoration.conflictingResourceForeground": "error",
  "gitDecoration.ignoredResourceForeground": "muted",
  "gitDecoration.stageModifiedResourceForeground": "warning",
  "gitDecoration.stageDeletedResourceForeground": "error",
  "gitDecoration.submoduleResourceForeground": "subtle",
  // terminal
  "terminal.background": "base",
  "terminal.foreground": "text",
  "terminal.selectionBackground": "overlay",
  "terminal.inactiveSelectionBackground": "surface",
  "terminalCursor.foreground": "accent",
  "terminalCursor.background": "on-accent",
  "terminal.border": "border",
  "terminal.findMatchBackground": "accent",
  "terminal.findMatchHighlightBackground": "accent@0.25",
  "terminal.ansiBlack": "surface",
  "terminal.ansiRed": "error",
  "terminal.ansiGreen": "accent-quiet",
  "terminal.ansiYellow": "warning",
  "terminal.ansiBlue": "blue-tint",
  "terminal.ansiMagenta": "magenta-tint",
  "terminal.ansiCyan": "cyan-tint",
  "terminal.ansiWhite": "text",
  "terminal.ansiBrightBlack": "muted",
  "terminal.ansiBrightRed": "error-bright",
  "terminal.ansiBrightGreen": "accent",
  "terminal.ansiBrightYellow": "warning-bright",
  "terminal.ansiBrightBlue": "blue-tint-bright",
  "terminal.ansiBrightMagenta": "magenta-tint-bright",
  "terminal.ansiBrightCyan": "cyan-tint-bright",
  "terminal.ansiBrightWhite": "bright",
  // debug / misc
  "debugToolBar.background": "overlay",
  "debugIcon.breakpointForeground": "error",
  "debugConsole.errorForeground": "error",
  "debugConsole.warningForeground": "warning",
  "debugConsole.infoForeground": "subtle",
  "problemsErrorIcon.foreground": "error",
  "problemsWarningIcon.foreground": "warning",
  "problemsInfoIcon.foreground": "subtle",
  "settings.headerForeground": "bright",
  "settings.modifiedItemIndicator": "accent",
  "settings.focusedRowBackground": "surface",
  "keybindingLabel.background": "overlay",
  "keybindingLabel.foreground": "text",
  "keybindingLabel.border": "border",
  "keybindingLabel.bottomBorder": "border",
  "commandCenter.background": "surface",
  "commandCenter.foreground": "subtle",
  "commandCenter.border": "border",
  "commandCenter.activeBackground": "overlay",
  "toolbar.hoverBackground": "overlay",
  "welcomePage.background": "base",
  "walkThrough.embeddedEditorBackground": "surface",
  "charts.foreground": "text",
  "charts.lines": "border",
  "charts.red": "error",
  "charts.yellow": "warning",
  "charts.green": "accent-quiet",
  "charts.blue": "blue-tint",
  "charts.purple": "magenta-tint",
  "charts.orange": "warning",
  "chat.requestBackground": "surface",
  "chat.requestBorder": "border",
  "chat.slashCommandForeground": "accent",
  "inlineChat.background": "overlay",
  "inlineChat.border": "border",
  "editorGhostText.foreground": "muted",
  "editorGhostText.background": "base",
};

/** the keys t3code's importer reads; the theme must set every one explicitly. */
export const T3CODE_KEYS = [
  "activityBar.background", "activityBarBadge.background", "badge.background", "button.background", "button.foreground",
  "contrastBorder", "descriptionForeground", "disabledForeground", "dropdown.background", "dropdown.border",
  "editor.background", "editor.foreground", "editor.selectionBackground", "editorCursor.foreground", "editorError.foreground",
  "editorGroup.border", "editorPane.background", "editorWarning.foreground", "editorWidget.background", "errorForeground",
  "focusBorder", "foreground", "input.border", "input.placeholderForeground", "list.activeSelectionBackground",
  "list.hoverBackground", "list.inactiveSelectionBackground", "menu.background", "panel.background", "panel.border",
  "progressBar.background", "quickInput.background", "scrollbarSlider.background", "sideBar.background", "sideBar.border",
  "sideBar.foreground", "terminal.background", "terminal.foreground", "terminal.selectionBackground", "terminalCursor.foreground",
  "textCodeBlock.background", "textLink.foreground",
] as const;

function alpha(hex: string, a: number): string {
  return hex + Math.round(a * 255).toString(16).padStart(2, "0");
}

function resolveWorkbench(p: Lichen, v: string): string {
  if (v.startsWith("diff.")) return p.diff[v.slice(5) as "added" | "deleted" | "changed"];
  const [role, a] = v.split("@");
  const hex = p.hex(role as Role);
  return a ? alpha(hex, Number(a)) : hex;
}

interface TokenRule { name: string; scope: string[]; settings: { foreground?: string; fontStyle?: string } }

/** vs code draws no token backgrounds, so a syntax entry becomes ink plus a font style */
function style(p: Lichen, token: string, extra?: string): { foreground: string; fontStyle?: string } {
  const s = p.syntax[token];
  if (!s) throw new Error(`lichen: palette.json has no syntax entry "${token}"`);
  const font = [s.bold ? "bold" : "", s.italic ? "italic" : "", extra ?? ""].filter(Boolean).join(" ");
  return { foreground: p.hex(s.role), ...(font ? { fontStyle: font } : {}) };
}

function tokenColors(p: Lichen): TokenRule[] {
  const h = (r: Role) => p.hex(r);
  const t = (token: string, extra?: string) => style(p, token, extra);
  return [
    { name: "comment", scope: ["comment", "punctuation.definition.comment", "string.quoted.docstring"], settings: t("comment") },
    { name: "keyword", scope: ["keyword", "storage", "storage.type", "storage.modifier", "keyword.control", "keyword.operator.new", "keyword.operator.expression", "keyword.other", "entity.name.tag.yaml"], settings: t("keyword") },
    { name: "decorator", scope: ["meta.decorator", "punctuation.decorator", "entity.name.function.decorator"], settings: t("decorator") },
    { name: "builtin", scope: ["variable.language", "support.variable", "support.constant"], settings: t("builtin") },
    { name: "operator and punctuation", scope: ["keyword.operator", "punctuation", "meta.brace", "punctuation.definition.string", "punctuation.separator", "punctuation.terminator", "punctuation.accessor", "meta.tag punctuation.definition.tag", "punctuation.definition.template-expression"], settings: t("operator") },
    { name: "string", scope: ["string", "string.template", "meta.embedded.line"], settings: t("string") },
    { name: "regexp", scope: ["string.regexp"], settings: t("regexp") },
    { name: "string escape", scope: ["constant.character.escape", "string.regexp keyword", "constant.other.placeholder"], settings: t("string-escape") },
    { name: "template expression", scope: ["meta.template.expression", "meta.embedded.expression"], settings: t("identifier") },
    { name: "number", scope: ["constant.numeric", "constant.character"], settings: t("number") },
    { name: "boolean and null", scope: ["constant.language", "constant.language.boolean", "constant.language.null", "constant.language.undefined"], settings: t("boolean") },
    { name: "constant", scope: ["variable.other.constant", "constant.other"], settings: t("constant") },
    { name: "function", scope: ["entity.name.function", "meta.function-call", "support.function", "meta.function-call entity.name.function", "variable.function", "entity.name.function.member", "support.function.builtin", "entity.name.function.macro"], settings: t("function") },
    { name: "function definition", scope: ["meta.definition.function entity.name.function", "meta.definition.method entity.name.function", "meta.method.declaration entity.name.function", "meta.function.declaration entity.name.function"], settings: t("function-definition") },
    { name: "type", scope: ["entity.name.type", "entity.name.class", "entity.name.struct", "entity.name.enum", "entity.name.interface", "entity.name.namespace", "entity.other.inherited-class", "support.type", "support.class", "storage.type.primitive", "meta.type", "support.type.primitive", "entity.name.tag", "support.class.component", "entity.name.tag.jsx", "entity.name.tag.tsx"], settings: t("type") },
    { name: "type definition", scope: ["meta.class entity.name.type.class", "meta.interface entity.name.type.interface", "meta.enum.declaration entity.name.type.enum", "meta.type.declaration entity.name.type.alias", "entity.name.type.alias"], settings: t("type-definition") },
    { name: "parameter", scope: ["variable.parameter", "meta.parameters variable"], settings: t("parameter") },
    { name: "variable and property", scope: ["variable", "variable.other", "variable.other.property", "variable.other.object.property", "meta.object-literal.key", "support.type.property-name", "entity.other.attribute-name", "entity.name.variable", "support.variable.property", "meta.definition.variable"], settings: t("identifier") },
    { name: "markup heading", scope: ["markup.heading", "entity.name.section"], settings: { foreground: h("bright"), fontStyle: "bold" } },
    { name: "markup bold", scope: ["markup.bold"], settings: { fontStyle: "bold" } },
    { name: "markup italic", scope: ["markup.italic"], settings: { fontStyle: "italic" } },
    { name: "markup link", scope: ["markup.underline.link", "string.other.link"], settings: { foreground: h("accent-quiet"), fontStyle: "underline" } },
    { name: "markup code", scope: ["markup.inline.raw", "markup.fenced_code.block", "markup.raw"], settings: { foreground: h("text") } },
    { name: "markup list", scope: ["markup.list", "punctuation.definition.list"], settings: { foreground: h("muted") } },
    { name: "diff inserted", scope: ["markup.inserted", "meta.diff.header.to-file"], settings: { foreground: h("accent-quiet") } },
    { name: "diff deleted", scope: ["markup.deleted", "meta.diff.header.from-file"], settings: { foreground: h("error") } },
    { name: "diff changed", scope: ["markup.changed"], settings: { foreground: h("warning") } },
    { name: "invalid", scope: ["invalid", "invalid.illegal"], settings: { foreground: h("error") } },
    { name: "deprecated", scope: ["invalid.deprecated"], settings: { foreground: h("muted"), fontStyle: "strikethrough" } },
    { name: "css property / selector", scope: ["support.type.property-name.css", "entity.other.attribute-name.class.css", "entity.other.attribute-name.id.css"], settings: { foreground: h("text") } },
    { name: "css value", scope: ["support.constant.property-value.css", "constant.other.color"], settings: { foreground: h("text") } },
    { name: "json key", scope: ["support.type.property-name.json", "meta.structure.dictionary.key"], settings: { foreground: h("text") } },
  ];
}

/** semantic tokens: same table; a bare hex where the entry has no style, so tests and readers see the plain value */
function semanticTokenColors(p: Lichen) {
  const h = (r: Role) => p.hex(r);
  const t = (token: string) => {
    const s = style(p, token);
    return s.fontStyle ? { foreground: s.foreground, bold: !!p.syntax[token]!.bold, italic: !!p.syntax[token]!.italic } : s.foreground;
  };
  return {
    function: t("function"), method: t("function"), "function.defaultLibrary": t("function"),
    "function.declaration": t("function-definition"), "method.declaration": t("function-definition"),
    class: t("type"), type: t("type"), interface: t("type"), enum: t("type"), struct: t("type"), typeParameter: t("type"),
    "class.declaration": t("type-definition"), "interface.declaration": t("type-definition"), "enum.declaration": t("type-definition"), "type.declaration": t("type-definition"),
    namespace: t("identifier"), variable: t("identifier"), property: t("identifier"), enumMember: t("identifier"),
    parameter: t("parameter"),
    keyword: t("keyword"), decorator: t("decorator"), macro: t("decorator"), "variable.defaultLibrary": t("builtin"),
    comment: t("comment"), string: t("string"), regexp: t("regexp"), number: t("number"), operator: t("operator"),
    "*.deprecated": { strikethrough: true },
  };
}

export const vscodeTheme: Emitter = {
  path: "ports/vscode/themes/lichen-color-theme.json",
  render(p) {
    const colors: Record<string, string> = {};
    for (const [k, v] of Object.entries(workbench)) colors[k] = resolveWorkbench(p, v);
    for (const k of T3CODE_KEYS) if (!(k in colors)) throw new Error(`vscode theme is missing t3code key ${k}`);
    const theme = {
      $schema: "vscode://schemas/color-theme",
      name: "lichen",
      type: "dark",
      semanticHighlighting: true,
      colors,
      tokenColors: tokenColors(p),
      semanticTokenColors: semanticTokenColors(p),
    };
    return JSON.stringify(theme, null, 2) + "\n";
  },
};

export const vscodePackage: Emitter = {
  path: "ports/vscode/package.json",
  render() {
    return JSON.stringify({
      name: "lichen",
      displayName: "lichen",
      description: "a monochrome theme with one colour. neutral greys and one lime.",
      version: VERSION,
      publisher: "jassuwu",
      license: "MIT",
      author: "jass",
      repository: { type: "git", url: "https://github.com/jassuwu/lichen" },
      homepage: "https://github.com/jassuwu/lichen",
      bugs: { url: "https://github.com/jassuwu/lichen/issues" },
      engines: { vscode: "^1.85.0" },
      categories: ["Themes"],
      keywords: ["theme", "dark", "monochrome", "minimal", "lime", "lichen"],
      galleryBanner: { color: "#040404", theme: "dark" },
      contributes: { themes: [{ label: "lichen", uiTheme: "vs-dark", path: "./themes/lichen-color-theme.json" }] },
    }, null, 2) + "\n";
  },
};

export const vscodeReadme: Emitter = {
  path: "ports/vscode/README.md",
  render(p) {
    return `# lichen

a monochrome theme with one colour. neutral greys, chroma 0, and one lime (\`${p.hex("accent")}\`) that does exactly one job in code: function names.

keywords recede, names come forward, strings sit on a faint box, types are the brightest grey. errors are a muted red, warnings a muted amber, and nothing else has a hue.

generated from [jassuwu/lichen](https://github.com/jassuwu/lichen) — the same palette ships to ghostty, neovim, herdr and p10k.
`;
  },
};

export const vscodeIgnore: Emitter = {
  path: "ports/vscode/.vscodeignore",
  render() {
    return "**/*.vsix\n";
  },
};

export const vscode: Emitter[] = [vscodeTheme, vscodePackage, vscodeReadme, vscodeIgnore];
