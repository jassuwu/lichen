import { join } from "node:path";
import { ghostty } from "./emit/ghostty";
import type { Emitter } from "./emit/types";
import { lichen } from "./palette";

export const emitters: Emitter[] = [ghostty];

export async function build(
  root: string,
  opts: { check: boolean },
): Promise<{ written: string[]; stale: string[] }> {
  const written: string[] = [];
  const stale: string[] = [];

  for (const emitter of emitters) {
    const rendered = emitter.render(lichen);
    const fullPath = join(root, emitter.path);
    const file = Bun.file(fullPath);

    if (opts.check) {
      const exists = await file.exists();
      if (!exists) {
        stale.push(emitter.path);
        continue;
      }
      const current = typeof rendered === "string" ? await file.text() : await file.bytes();
      const matches =
        typeof rendered === "string"
          ? current === rendered
          : Buffer.compare(Buffer.from(current as Uint8Array), Buffer.from(rendered)) === 0;
      if (!matches) stale.push(emitter.path);
    } else {
      await Bun.write(fullPath, rendered);
      written.push(emitter.path);
    }
  }

  return { written, stale };
}

if (import.meta.main) {
  const check = process.argv.includes("--check");
  const result = await build(process.cwd(), { check });

  if (check) {
    if (result.stale.length > 0) {
      console.log("stale:");
      for (const path of result.stale) console.log(`  ${path}`);
      process.exit(1);
    } else {
      console.log("up to date");
    }
  } else {
    console.log("written:");
    for (const path of result.written) console.log(`  ${path}`);
  }
}
