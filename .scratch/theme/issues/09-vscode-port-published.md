# VS Code / Cursor theme, published to Marketplace and Open VSX, verified in t3code

Type: task
Status: resolved
Blocked by: 06

## Question

Emit the VS Code theme extension, install it in Cursor, publish it, and confirm t3code imports it correctly.

Three parts:

1. **The theme JSON** — workbench `colors` + `tokenColors` + `semanticTokenColors`. Set every key in t3code's `USED_WORKBENCH_COLORS` (`apps/web/src/openVsxThemes.ts` in `~/repos/personal/t3code`) explicitly; that set is the contract. First find out *why* kanso "doesn't work well" in t3code — diff kanso's theme JSON against that set; the missing keys are the lesson.
2. **Publishing** — VS Code Marketplace needs a publisher (Azure DevOps PAT); Open VSX needs a namespace + token. t3code reads Open VSX only, and rejects non-OSI licenses. Account setup is HITL — hand jass a checklist; everything after the tokens exist is AFK.
3. **Verification** — install in Cursor from the marketplace; in t3code, search and import the theme, screenshot the result. UI checks go to `codex-verify-ui`.

Record: publisher/namespace ids, extension id, the Open VSX URL, and where the tokens live.

## Answer

Built and installed locally 2026-08-29; **publishing is the part that needs jass.** The extension lives in `ports/vscode/` (id `jassuwu.lichen`, v0.1.0), sets all 42 keys t3code's importer reads (`T3CODE_KEYS` in `src/emit/vscode.ts`, enforced by a test), plus token + semantic colours. Packaged with `bunx --bun @vscode/vsce package --no-dependencies` → `lichen-0.1.0.vsix` (gitignored), installed into Cursor with `cursor --install-extension`, `workbench.colorTheme` set to `lichen`.

Publishing checklist (HITL):
1. VS Code Marketplace: create publisher `jassuwu` at https://marketplace.visualstudio.com/manage, mint an Azure DevOps PAT (Marketplace → Manage, all orgs), then `cd ports/vscode && bunx --bun @vscode/vsce publish --no-dependencies -p <PAT>`.
2. Open VSX (what t3code reads): sign in at https://open-vsx.org with GitHub, create namespace `jassuwu`, generate a token, then `bunx ovsx publish lichen-0.1.0.vsix -p <TOKEN>`. MIT satisfies t3code's license gate.
3. t3code: Settings → theme search → `lichen` → import; screenshot and compare with Cursor. If anything looks off, the missing key goes in `workbench` in `src/emit/vscode.ts`, `bun run build`, bump version, republish.
