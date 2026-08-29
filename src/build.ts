import { join } from "node:path";
import { ghostty } from "./emit/ghostty";
import { herdr } from "./emit/herdr";
import { nvim } from "./emit/nvim";
import { p10k } from "./emit/p10k";
import type { Emitter } from "./emit/types";
import { vscode } from "./emit/vscode";
import { wallpaper } from "./emit/wallpaper";
import { lichen } from "./palette";

export const emitters: Emitter[] = [ghostty, ...nvim, ...vscode, herdr, p10k, ...wallpaper];

export async function build(
  root: string,
  opts: { check: boolean; emitters?: Emitter[] },
): Promise<{ written: string[]; stale: string[]; skipped: string[] }> {
  const written: string[] = [];
  const stale: string[] = [];
  const skipped: string[] = [];

  for (const emitter of opts.emitters ?? emitters) {
    const fullPath = join(root, emitter.path);
    const file = Bun.file(fullPath);

    if (opts.check) {
      if (emitter.check === false) {
        skipped.push(emitter.path);
        continue;
      }
      const rendered = await emitter.render(lichen);
      if (!(await file.exists())) {
        stale.push(emitter.path);
        continue;
      }
      const matches =
        typeof rendered === "string"
          ? (await file.text()) === rendered
          : Buffer.compare(Buffer.from(await file.bytes()), Buffer.from(rendered)) === 0;
      if (!matches) stale.push(emitter.path);
    } else {
      const rendered = await emitter.render(lichen);
      await Bun.write(fullPath, rendered);
      written.push(emitter.path);
    }
  }

  return { written, stale, skipped };
}

if (import.meta.main) {
  const check = process.argv.includes("--check");
  const result = await build(process.cwd(), { check });

  if (check) {
    if (result.stale.length > 0) {
      console.log("stale:");
      for (const path of result.stale) console.log(`  ${path}`);
      process.exit(1);
    }
    console.log(`up to date${result.skipped.length ? ` (not compared: ${result.skipped.join(", ")})` : ""}`);
  } else {
    console.log("written:");
    for (const path of result.written) console.log(`  ${path}`);
  }
}
