# Scaffold the repo and emit the first port

Type: task
Status: claimed
Blocked by: 04, 05

## Question

Turn `~/repos/personal/lichen/` into `jassuwu/lichen`: `git init`, the tree from [Repo layout and the generation pipeline](05-repo-layout-and-generation.md), `palette.json` transcribed from [The palette](04-the-palette.md) as amended by [Syntax legibility](14-syntax-legibility.md) (eight greys, `bright`, the syntax map), `src/palette.ts` + `src/build.ts` with `--check`, and one port emitted end-to-end (Ghostty is the smallest — use it to prove the pipeline). `.gitignore`: `CONTEXT.md`, `docs/adr/`. `package.json` engines: bun ≥ 1.4.

Mechanical once 04 and 05 are answered: write the spec, hand the scaffold to `codex-implement`, review the diff. Small segmented commits. Create the GitHub repo under `jassuwu` (ask before anything public beyond `gh repo create`).

Record: repo URL, the command that regenerates all ports, and where `.scratch/` ended up.
