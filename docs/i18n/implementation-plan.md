# Documentation Translation Implementation Plan

**Goal:** Deliver full maintained public documentation in six locales with
reproducible freshness, coverage, link, and executable-example checks.

**Architecture:** Keep English as the canonical source. Mirror repository paths
under each locale, sharing original assets and non-document files. Run one
translation worker per locale with disjoint file ownership, then validate and
review the combined output. No production code or package metadata changes.

**Tech Stack:** Markdown, JSON manifest, Node.js built-ins, node:test.

## Execution

1. Inventory sources and exclusions; add README navigation and record hashes.
   Files: `README.md`, `docs/i18n/task.md`, this plan, `docs/i18n/manifest.json`.
   Status: complete.
2. Delegate all 21 documents to each locale worker. Workers may edit only their
   `docs/i18n/<locale>/` tree and must use apply_patch. Preserve all executable
   examples and add original English heading anchors when translating headings.
   Status: complete. Five locale trees were completed by workers. After CLI quota
   failure, the owning agent completed seven missing Japanese mirrors and
   repaired its unfinished Japanese drafts, preserving the other locale trees.
3. Write failing regression fixtures before implementing a dependency-free
   validator. Files: `tests/i18n-validator.test.mjs`,
   `scripts/validate-i18n.mjs`. Test stale source hashes, missing mirrors,
   unclassified documentation, broken links/fragments/assets, reference links,
   escaped traversal, fenced/inline/raw code changes, and version drift.
   Status: complete; 21 focused regression tests pass.
4. Add `docs/i18n/README.md` describing scope, exclusions, review/refresh workflow,
   validator commands, hash normalization, and honest validation limitations.
   Status: complete.
5. Run `node --test tests/i18n-validator.test.mjs` and
   `node scripts/validate-i18n.mjs`. Review locale coverage and all diffs,
   repair inconsistencies, then mark only verified coverage complete.
   Status: complete. The default complete-coverage validator passes for all 126
   mirrors; all 21 regression tests and git diff --check pass. Native-language
   human review and new live Blender/MCPB testing remain outside this task.

## Risks And Checkpoints

- Preserve private Studio vs public connector boundaries and historical evidence
  qualifications in every locale. Never upgrade pending installation tests to
  passing claims or turn optional Docker support into a supported path.
- Source site/setup Markdown contains unfenced shell commands and JSON: preserve
  those lines exactly, in addition to ordinary fenced and inline code.
- Local links to untranslated runtime files/legal originals/assets must be
  rebased, not copied into locale directories. README fragment links need stable
  English aliases in translations.
- Do not modify sources after hashing without refreshing all affected locales.
- Machine validation cannot certify fluent translation or visual/Blender quality.
- No commits or publication at any checkpoint, per user instruction.
