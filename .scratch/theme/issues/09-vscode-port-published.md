# VS Code / Cursor theme, published to Marketplace and Open VSX, verified in t3code

Type: task
Status: open
Blocked by: 06

## Question

Emit the VS Code theme extension, install it in Cursor, publish it, and confirm t3code imports it correctly.

Three parts:

1. **The theme JSON** — workbench `colors` + `tokenColors` + `semanticTokenColors`. Set every key in t3code's `USED_WORKBENCH_COLORS` (`apps/web/src/openVsxThemes.ts` in `~/repos/personal/t3code`) explicitly; that set is the contract. First find out *why* kanso "doesn't work well" in t3code — diff kanso's theme JSON against that set; the missing keys are the lesson.
2. **Publishing** — VS Code Marketplace needs a publisher (Azure DevOps PAT); Open VSX needs a namespace + token. t3code reads Open VSX only, and rejects non-OSI licenses. Account setup is HITL — hand jass a checklist; everything after the tokens exist is AFK.
3. **Verification** — install in Cursor from the marketplace; in t3code, search and import the theme, screenshot the result. UI checks go to `codex-verify-ui`.

Record: publisher/namespace ids, extension id, the Open VSX URL, and where the tokens live.
