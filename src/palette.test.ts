import { describe, expect, test } from "bun:test";
import palette from "../palette.json" with { type: "json" };
import { ROLES, contrast, lichen, loadPalette, oklchToHex } from "./palette";

// literals below come from the independent design prototype (spec-06.md), not from the code under test.
const HEX: Record<string, string> = {
  base: "#040404",
  surface: "#0f0f0f",
  overlay: "#1d1d1d",
  border: "#303030",
  muted: "#6c6c6c",
  subtle: "#9b9b9b",
  text: "#cecece",
  bright: "#f5f5f5",
  accent: "#d4fd80",
  "accent-quiet": "#b4c695",
  "on-accent": "#0a0a0a",
  error: "#e47b79",
  "error-bright": "#ff9492",
  warning: "#e1b767",
  "warning-bright": "#f5ca7a",
  "blue-tint": "#919cae",
  "blue-tint-bright": "#c3cfe2",
  "magenta-tint": "#a795a4",
  "magenta-tint-bright": "#dac7d7",
  "cyan-tint": "#86a1a3",
  "cyan-tint-bright": "#b8d4d5",
};

describe("oklchToHex", () => {
  test("base", () => {
    expect(oklchToHex(0.11, 0, 0)).toBe("#040404");
  });
  test("accent", () => {
    expect(oklchToHex(0.9392, 0.1588, 124.39)).toBe("#d4fd80");
  });
  test("error", () => {
    expect(oklchToHex(0.7, 0.13, 22)).toBe("#e47b79");
  });
  test("blue-tint", () => {
    expect(oklchToHex(0.69, 0.03, 260)).toBe("#919cae");
  });
});

test("ROLES equals Object.keys(palette.json.roles) in order", () => {
  const rolesFromJson: string[] = Object.keys(palette.roles);
  expect(ROLES as readonly string[]).toEqual(rolesFromJson);
});

describe("every role's hex matches the literal table", () => {
  for (const role of ROLES) {
    test(role, () => {
      expect(lichen.roles[role].hex).toBe(HEX[role]);
      expect(lichen.hex(role)).toBe(HEX[role]);
    });
  }
});

test("ansi is 16 entries with known slots", () => {
  expect(lichen.ansi.length).toBe(16);
  expect(lichen.ansi[0]).toBe("#0f0f0f");
  expect(lichen.ansi[10]).toBe("#d4fd80");
  expect(lichen.ansi[15]).toBe("#f5f5f5");
});

describe("contrast gates (WCAG, on base)", () => {
  test("text >= 7", () => {
    expect(contrast(lichen.hex("text"), lichen.hex("base"))).toBeGreaterThanOrEqual(7);
  });
  test("subtle >= 4.5", () => {
    expect(contrast(lichen.hex("subtle"), lichen.hex("base"))).toBeGreaterThanOrEqual(4.5);
  });
  test("muted >= 3", () => {
    expect(contrast(lichen.hex("muted"), lichen.hex("base"))).toBeGreaterThanOrEqual(3);
  });
  test("accent >= 4.5 on every surface incl. border", () => {
    for (const surface of ["base", "surface", "overlay", "border"] as const) {
      expect(contrast(lichen.hex("accent"), lichen.hex(surface))).toBeGreaterThanOrEqual(4.5);
    }
  });
  test("on-accent on accent >= 7", () => {
    expect(contrast(lichen.hex("on-accent"), lichen.hex("accent"))).toBeGreaterThanOrEqual(7);
  });
});

test("diff added/deleted/changed are lowercase hex that differ from base and from each other", () => {
  const { added, deleted, changed } = lichen.diff;
  const hexPattern = /^#[0-9a-f]{6}$/;
  for (const value of [added, deleted, changed]) {
    expect(value).toMatch(hexPattern);
    expect(value).not.toBe(lichen.hex("base"));
  }
  expect(added).not.toBe(deleted);
  expect(deleted).not.toBe(changed);
  expect(added).not.toBe(changed);
});

describe("loadPalette validation", () => {
  test("throws a readable error when an ansi role isn't in roles", () => {
    const bad = structuredClone(palette) as any;
    bad.ansi = [...bad.ansi];
    bad.ansi[0] = "not-a-role";
    expect(() => loadPalette(bad)).toThrow(/ansi/i);
  });

  test("throws a readable error when a syntax role isn't in roles", () => {
    const bad = structuredClone(palette) as any;
    bad.syntax = { ...bad.syntax, function: "not-a-role" };
    expect(() => loadPalette(bad)).toThrow(/syntax/i);
    const badBg = structuredClone(palette) as any;
    badBg.syntax = { ...badBg.syntax, string: { role: "text", background: "not-a-role" } };
    expect(() => loadPalette(badBg)).toThrow(/syntax\.string\.background/);
  });

  test("a bare role string is still a valid syntax entry", () => {
    const plain = structuredClone(palette) as any;
    plain.syntax = { ...plain.syntax, keyword: "subtle" };
    expect(loadPalette(plain).syntax.keyword).toEqual({ role: "subtle" });
  });

  test("throws a readable error when a diff role isn't in roles", () => {
    const bad = structuredClone(palette) as any;
    bad.diff = { ...bad.diff, added: { ...bad.diff.added, role: "not-a-role" } };
    expect(() => loadPalette(bad)).toThrow(/diff/i);
  });
});

test("loadPalette rejects an ansi table that is not 16 slots", () => {
  const broken = structuredClone(palette) as { ansi: string[] };
  broken.ansi = broken.ansi.slice(0, 15);
  expect(() => loadPalette(broken)).toThrow(/ansi must list exactly 16 roles/);
});

test("loadPalette rejects a missing diff entry", () => {
  const broken = structuredClone(palette) as { diff: Record<string, unknown> };
  delete broken.diff.added;
  expect(() => loadPalette(broken)).toThrow(/diff\.added is missing/);
});
