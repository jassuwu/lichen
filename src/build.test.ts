import { afterEach, beforeEach, expect, test } from "bun:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { build } from "./build";
import { ghostty } from "./emit/ghostty";
import { lichen } from "./palette";

let dir: string;

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), "lichen-build-"));
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

test("check reports the ghostty path stale when the file is missing", async () => {
  const result = await build(dir, { check: true });
  expect(result.stale).toContain(ghostty.path);
  expect(result.written).toEqual([]);
});

test("build writes the exact content, then check reports nothing stale", async () => {
  const built = await build(dir, { check: false });
  expect(built.written).toContain(ghostty.path);

  const file = Bun.file(join(dir, ghostty.path));
  expect(await file.exists()).toBe(true);
  expect(await file.text()).toBe(ghostty.render(lichen) as string);

  const checked = await build(dir, { check: true });
  expect(checked.stale).toEqual([]);
});

test("corrupting the written file makes check report it stale again", async () => {
  await build(dir, { check: false });
  const path = join(dir, ghostty.path);
  await Bun.write(path, (await Bun.file(path).text()) + "x");

  const checked = await build(dir, { check: true });
  expect(checked.stale).toContain(ghostty.path);
});
