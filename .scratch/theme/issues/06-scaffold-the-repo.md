# Scaffold the repo and emit the first port

Type: task
Status: resolved
Blocked by: 04, 05

## Question

Turn `~/repos/personal/lichen/` into `jassuwu/lichen`: `git init`, the tree from [Repo layout and the generation pipeline](05-repo-layout-and-generation.md), `palette.json` transcribed from [The palette](04-the-palette.md) as amended by [Syntax legibility](14-syntax-legibility.md) (eight greys, `bright`, the syntax map), `src/palette.ts` + `src/build.ts` with `--check`, and one port emitted end-to-end (Ghostty is the smallest — use it to prove the pipeline). `.gitignore`: `CONTEXT.md`, `docs/adr/`. `package.json` engines: bun ≥ 1.4.

Mechanical once 04 and 05 are answered: write the spec, hand the scaffold to `codex-implement`, review the diff. Small segmented commits. Create the GitHub repo under `jassuwu` (ask before anything public beyond `gh repo create`).

Record: repo URL, the command that regenerates all ports, and where `.scratch/` ended up.

## Answer

Done 2026-08-29, locally. The scaffold is in `~/repos/personal/lichen` on `main`, eight commits, working tree clean:

- `palette.json` — the source of truth: 21 roles with oklch + meaning, the ANSI order, the syntax map, the diff mixes.
- `src/palette.ts` — `ROLES`/`Role`, `oklchToHex` (Ottosson), `contrast` (WCAG), `mixOklab`, `loadPalette` (validates every cross-reference; readable errors), `lichen`.
- `src/emit/types.ts`, `src/emit/ghostty.ts` — the `Emitter` seam and the first port.
- `src/build.ts` — `bun run build` writes every emitter's output; `bun run check` diffs a fresh render against the committed file and exits 1 naming stale paths.
- `ports/ghostty/lichen` — generated, byte-identical to the design.
- 43 tests at three seams (palette, ghostty render, build/check in a temp dir), all asserting the design prototype's literals. `bun test`, `bun run typecheck`, `bun run check` all clean.
- `.gitignore`: `node_modules`, `CONTEXT.md`, `docs/adr/`. `.scratch/` tracked. MIT, `Karthickpranav S N (jass)`. README in lowercase.

**Regenerate all ports:** `bun run build`. **Guard drift:** `bun run check`.

**Not done — needs jass:** `gh repo create jassuwu/lichen --public --source . --remote origin --push`. The session's permission classifier blocked creating/pushing the public repo; run that one line (or make it private first) and the scaffold is on GitHub. Nothing else on the map depends on the remote until the VS Code publishing ticket.

**Notes for later tickets:** commits are unsigned — global `commit.gpgsign=true` hangs on pinentry in agent sessions; sign or re-sign as you like. Implementation was done inline (a Codex attempt failed: the CLI's ChatGPT login rejects `gpt-5.6-sol`).
