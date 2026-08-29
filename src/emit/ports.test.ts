import { describe, expect, test } from "bun:test";
import { lichen } from "../palette";
import { herdr } from "./herdr";
import { nvim, nvimColors, nvimGroups } from "./nvim";
import { p10k } from "./p10k";
import { T3CODE_KEYS, vscodeTheme } from "./vscode";
import { wallpaperHtml } from "./wallpaper";

describe("nvim", () => {
  test("colors/lichen.lua loads the plugin", () => {
    expect(nvimColors.path).toBe("colors/lichen.lua");
    expect(nvimColors.render(lichen)).toContain('require("lichen").load()');
  });
  test("functions are the accent, types bright, keywords subtle, strings boxed", () => {
    const lua = nvimGroups.render(lichen) as string;
    expect(lua).toContain('["@function"] = { fg = "#d4fd80" }');
    expect(lua).toContain('["@type"] = { fg = "#f5f5f5" }');
    expect(lua).toContain('["@keyword"] = { fg = "#9b9b9b" }');
    expect(lua).toContain('["@string"] = { fg = "#cecece", bg = "#1d1d1d" }');
    expect(lua).toContain('["Comment"] = { fg = "#6c6c6c", italic = true }');
  });
  test("emits four files at the plugin root", () => {
    expect(nvim.map((e) => e.path)).toEqual(["lua/lichen/palette.lua", "lua/lichen/groups.lua", "lua/lichen/init.lua", "colors/lichen.lua"]);
  });
});

describe("vscode", () => {
  const theme = JSON.parse(vscodeTheme.render(lichen) as string);
  test("sets every key t3code reads", () => {
    for (const k of T3CODE_KEYS) expect(theme.colors[k], k).toMatch(/^#[0-9a-f]{6}([0-9a-f]{2})?$/);
  });
  test("editor is base on text, cursor is the accent", () => {
    expect(theme.colors["editor.background"]).toBe("#040404");
    expect(theme.colors["editor.foreground"]).toBe("#cecece");
    expect(theme.colors["editorCursor.foreground"]).toBe("#d4fd80");
    expect(theme.type).toBe("dark");
  });
  test("function tokens are the accent", () => {
    const fn = theme.tokenColors.find((t: { name: string }) => t.name === "function");
    expect(fn.settings.foreground).toBe("#d4fd80");
    expect(theme.semanticTokenColors.function).toBe("#d4fd80");
  });
});

test("herdr follows the terminal and overrides the ui tokens", () => {
  const toml = herdr.render(lichen) as string;
  expect(toml).toContain('name = "terminal"');
  expect(toml).toContain('accent = "#d4fd80"');
  expect(toml).toContain('sidebar_bg = "#0f0f0f"');
});

test("p10k gives the prompt char the accent and dirs the text colour", () => {
  const zsh = p10k.render(lichen) as string;
  expect(zsh).toContain("local magenta='#d4fd80'");
  expect(zsh).toContain("local blue='#cecece'");
  expect(zsh).toContain("local grey='#6c6c6c'");
});

test("wallpaper is a rock face with the palette painted on a canvas", () => {
  const html = wallpaperHtml(lichen, 3440, 1440);
  expect(html).toContain("background:#040404");
  expect(html).toContain('<canvas id="c" width="3440" height="1440">');
  expect(html).toContain('"accent":"#d4fd80"');
  expect(html).toContain('"overlay":"#1d1d1d"');
  // deterministic: the same size renders the same page
  expect(wallpaperHtml(lichen, 3440, 1440)).toBe(html);
});
