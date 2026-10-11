# Public Connector Documentation Translation

## Scope

Translate the maintained public documentation of Ker102/vipermesh-blender into
`es`, `zh-CN`, `fr`, `ja`, `de`, and `pt-BR`. This is the open-source MCP connector,
not the private ViperMesh Studio product repository. Preserve the existing clone.
Do not commit, push, publish registry metadata, or change application behavior.

## Sources

- `README.md`
- `CONTRIBUTING.md`
- `SECURITY.md`
- `CODE_OF_CONDUCT.md`
- `NOTICE.md`
- `CHANGELOG.md`
- `docs/client-setup.md`
- `docs/mcp-distribution.md`
- `docs/portable-blender-mcp.md`
- `docs/releasing.md`
- `skills/using-vipermesh-blender/SKILL.md`
- `skills/using-vipermesh-blender/references/character-animation-export.md`
- `skills/using-vipermesh-blender/references/geometry-materials-assets.md`
- `skills/using-vipermesh-blender/references/scene-operations.md`
- `skills/using-vipermesh-blender/references/spatial-validation.md`
- `skills/using-vipermesh-blender/references/visual-presentation.md`
- `site/index.md`
- `site/setup/index.md`
- `llms.txt`
- `site/llms.txt`
- `.github/pull_request_template.md`

## Success Criteria

- All 21 sources have full translations under `docs/i18n/<locale>/<source>`.
- README language navigation uses native language names near the top.
- Code blocks, raw setup commands/JSON, inline code, CLI names, versions,
  checksums, and public/private capability boundaries remain unchanged.
- Relative links resolve to translated peers; shared assets/legal/runtime files
  resolve back to repository originals. English fragment aliases remain usable.
- A manifest records LF-normalized SHA-256 source hashes, explicit completed
  source/locale coverage, and a reasoned inventory of exclusions.
- A dependency-free local validator and focused regression tests cover stale
  hashes, missing/unexpected mirrors, links/assets/anchors, and code fidelity.

## Progress

- [x] Inspect repository instructions, clean state, sources, and exclusions.
- [x] Select the 21-source public documentation inventory.
- [x] Translate six locales with separate ownership and apply_patch edits.
- [x] Add manifest, maintenance documentation, validator, and tests.
- [x] Validate all mirrors and review technical fidelity; report limitations.

This task and its implementation plan are internal coordination artifacts, not
English public source documents to translate.

All 126 mirrors are present. Five locale workers completed their trees; the
parent agent finished and repaired the Japanese drafts directly after CLI quota
failure. No completed locale tree was regenerated. The parent of this task owns
`.github/workflows/ci.yml`; this task does not edit that workflow.

Final checks: `node scripts/validate-i18n.mjs` passes for 21 sources, six locales,
and 126 completed mirrors; all 21 validator regression tests pass, and
`git diff --check` passes. No pending translation pairs remain. Native-language
human review, external URL reachability, and fresh live Blender/MCPB testing
were not performed; these limitations are documented in the maintenance README.
