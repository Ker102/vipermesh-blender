# Translation Maintenance

English is the canonical source for the public
[ViperMesh for Blender connector](../../README.md). These are full documentation
mirrors, not summaries, and not documentation for the private ViperMesh Studio
application or its complete benchmarked harness.

## Languages

[English](../../README.md) | [Español](es/README.md) | [简体中文](zh-CN/README.md) | [Français](fr/README.md) | [日本語](ja/README.md) | [Deutsch](de/README.md) | [Português (Brasil)](pt-BR/README.md)

The expected scope is 21 source documents per locale, 126 mirrors in total.
The [manifest](manifest.json) records the exact source paths, hashes, and
completed locale coverage. Only source/locale pairs listed in a source's
`completedLocales` are claimed complete; files merely existing is not a
completion claim. Locale `coverage` records must agree with those pairs.

Current completed coverage: `es` 21/21, `zh-CN` 21/21, `fr` 21/21, `ja` 21/21,
`de` 21/21, and `pt-BR` 21/21. There are no pending source/locale pairs.

## Source Inventory

| Group | Maintained sources | Count |
| --- | --- | --- |
| Root documentation | README, CONTRIBUTING, SECURITY, CODE_OF_CONDUCT, NOTICE, CHANGELOG | 6 |
| Connector guides | Client setup, MCP distribution, portable MCP manual, release checklist | 4 |
| Shipped agent guidance | The skill and all five reference documents | 6 |
| Public site prose | `site/index.md` and `site/setup/index.md` | 2 |
| Agent-facing indexes | Root and site `llms.txt` | 2 |
| Contribution workflow | `.github/pull_request_template.md` | 1 |

The public changelog is included in full, including older releases. Historical
internal implementation plans are not equivalent to maintained public release
notes and are excluded.

## Mirror And Link Rules

A source at `docs/client-setup.md` is mirrored at
`docs/i18n/<locale>/docs/client-setup.md`. Keep original basenames and directory
structure, including hidden directories. Use UTF-8 for native-language prose.

Relative document links point to translated peers. Images, video, fonts, legal
originals, runtime files, and machine-readable metadata remain shared in the
repository, with the correct number of `../` components. Do not duplicate assets
or rewrite an external URL to imply that a localized deployment exists.

Each translated Markdown heading retains the English GitHub fragment through
an explicit `<a id="english-heading-slug"></a>` alias, unless the unchanged heading
already supplies that fragment. Include the numeric suffix for repeated
headings. This keeps links such as `README.md#install` valid in every locale.
Keep the marked, native-language README switcher near the top of each README.

## Fidelity Rules

Translate all prose, headings, tables, alt text, link labels, caveats and FAQs.
Preserve executable code, CLI/tool/configuration names, file paths, versions,
dates, hashes, and external URLs. Fenced blocks (including text diagrams) stay
byte-equivalent after LF normalization. Inline code retains its content; the
validator treats inline line breaks as spaces, as Markdown rendering does.

The source `site/setup/index.md` contains unfenced shell commands and a JSON
configuration. Preserve those exact lines as well. In skill frontmatter,
translate `description` but retain `name` and metadata keys. UI instructions may
include a translated explanation alongside the exact English Blender label.

Do not turn design goals into universal performance guarantees. Keep the
historical scene comparison qualified as one example, preserve the pending
live MCPB installation checks, and retain the distinction between supported
native stdio and optional, not-yet-supported Docker setup. The public connector
does not include private Studio assets, prompts, RAG, billing, authentication,
cloud model routing, or the complete private benchmarked harness.

## Updating Sources

1. Edit and review the canonical English source.
2. Remove affected locale names from that source's `completedLocales` while
   translations are being updated. Set their coverage status to `pending` and
   adjust `completedSourceCount` to the number of still-complete source pairs.
3. Update all six full mirrors and review the meaning, links and code against
   the changed source. Add a native-language reviewer where available.
4. Print the new source hash using the read-only command below. Update the
   source's manifest `sha256` only after the translations have been reviewed.
5. Restore only actually completed locale names. Set locale status to
   `complete` only when all 21 sources are complete and counts agree.
6. Run both checks. Do not silence failures by copying English prose into a
   translation or blindly refreshing hashes.

From the repository root:

```bash
node --test tests/i18n-validator.test.mjs
node scripts/validate-i18n.mjs
node scripts/validate-i18n.mjs --hash README.md
```

No install, build, Blender instance, credentials, network access, or registry
publication is needed for these checks. The validator is separate from the
existing application test commands; it changes no software behavior.

Hashes use SHA-256 over UTF-8 source text with CRLF converted to LF, retaining
all other whitespace and the final newline. This avoids false staleness between
Windows and Unix clones while detecting actual source edits. Hashes cover the
full source, including navigation. The tool never writes files, refreshes hashes
automatically, or declares translations complete.

New maintained prose documents must be added to `sources` and mirrored in all
locales, or added to the exclusion inventory with a specific reason. Update
expected counts and the inventory table when scope changes. The validator flags
new unclassified Markdown/text documents outside excluded trees.

## Exclusions

The manifest inventories every excluded file present in the inspected clone,
with reasons, and separately lists excluded trees:

- Authoritative MIT, SIL Open Font License and Lucide license texts remain
  unchanged; translated attribution and READMEs point to originals.
- Deployed English HTML, CSS and JavaScript are not localized. Their maintained
  public Markdown documentation is included; this task does not deploy a
  multilingual website.
- Media, fonts, SVG icons, and image-integrity records are shared, not copied.
- Publication/citation metadata, crawler files, verification tokens, structured
  issue templates, workflows, source code, tests and build files are not prose
  translation targets.
- Internal/historical plans, private corpora, generated traces, dependency trees,
  build output and Git history are excluded. No historical plan or trace files
  were present in this fresh public clone.
- This maintenance README, manifest, [task record](task.md),
  [implementation plan](implementation-plan.md), validator and its tests are
  translation infrastructure, not canonical English source documents.

## Check Boundaries

The local validator checks source freshness, declared completion, missing and
unexpected mirrors, structural heading/list/table coverage, original heading
aliases, Markdown/reference/HTML links, shared assets, case-sensitive paths,
fragments, path traversal, unchanged external URLs, technical identifiers,
versions and numeric limits, fenced/inline code, and unfenced site setup examples.

It is a focused scanner for this repository's Markdown constructs, not a full
CommonMark renderer. It cannot certify translation fluency, complete semantic
equivalence, Blender compatibility, benchmark performance, or visual quality.
External links are preserved but not fetched, and no fresh live MCPB/Blender
installation tests are implied. Legal originals remain authoritative.

Localized skill files are documentation mirrors; automatic runtime guidance
retrieval still uses the original English `skills/` tree. Publication, release
bundles, npm contents and live website deployment are unchanged and not tested
by the translation checks.
