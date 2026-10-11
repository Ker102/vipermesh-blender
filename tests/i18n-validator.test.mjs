import assert from "node:assert/strict"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import test from "node:test"
import { scanMarkdown, sourceHash, validateRepository } from "../scripts/validate-i18n.mjs"

function fixture(t, source = "# Install\n\nUse `node` version 1.3.0.\n\n```bash\nnpm run build\n```\n") {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "vipermesh-i18n-"))
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  const write = (relative, content) => {
    const destination = path.join(root, relative)
    fs.mkdirSync(path.dirname(destination), { recursive: true })
    fs.writeFileSync(destination, content)
  }
  const manifest = {
    schemaVersion: 1,
    sourceHashAlgorithm: "sha256-utf8-lf",
    locales: ["es"],
    coverage: { es: { status: "complete", completedSourceCount: 1, expectedSourceCount: 1 } },
    sources: [{ path: "guide.md", sha256: sourceHash(source), completedLocales: ["es"] }],
    exclusions: [],
    excludedTrees: [],
    infrastructure: []
  }
  write("guide.md", source)
  write("docs/i18n/es/guide.md", source.replace("# Install", '<a id="install"></a>\n# Instalacion').replace("Use ", "Usa ").replace(" version ", " version de "))
  const save = () => write("docs/i18n/manifest.json", JSON.stringify(manifest))
  save()
  return { root, write, manifest, save, source, check: () => validateRepository(root).errors }
}

test("valid mirror and LF-normalized hashes", t => {
  const f = fixture(t)
  assert.deepEqual(f.check(), [])
  assert.equal(sourceHash("one\r\ntwo\r\n"), sourceHash("one\ntwo\n"))
})

test("stale English source fails", t => {
  const f = fixture(t)
  f.write("guide.md", f.source + "\nNew information.\n")
  assert.match(f.check().join("\n"), /stale source/i)
})

test("missing mirrors and inaccurate completed coverage fail", t => {
  const f = fixture(t)
  fs.unlinkSync(path.join(f.root, "docs/i18n/es/guide.md"))
  f.manifest.coverage.es.completedSourceCount = 0
  f.manifest.sources[0].completedLocales = []
  f.save()
  const errors = f.check().join("\n")
  assert.match(errors, /missing mirror/i)
  assert.match(errors, /coverage/i)
})

test("new source docs and unexpected mirror files need inventory", t => {
  const f = fixture(t)
  f.write("docs/new.md", "# New\n")
  f.write("docs/i18n/es/extra.md", "# Extra\n")
  const errors = f.check().join("\n")
  assert.match(errors, /unclassified documentation.*docs\/new.md/i)
  assert.match(errors, /unexpected mirror.*extra.md/i)
})

test("inventory can explicitly exclude legal originals and internal trees", t => {
  const f = fixture(t)
  f.write("legal.txt", "Authoritative license")
  f.write("docs/plans/history.md", "# Internal history\n")
  f.manifest.exclusions.push({ path: "legal.txt", reason: "Original legal text" })
  f.manifest.excludedTrees.push({ path: "docs/plans/", reason: "Internal plans" })
  f.save()
  assert.deepEqual(f.check(), [])
})

test("fenced content, info strings and inline code cannot drift", t => {
  const f = fixture(t)
  f.write("docs/i18n/es/guide.md", f.source.replace("```bash", "```sh").replace("npm run build", "npm run test").replace("`node`", "`nodo`"))
  const errors = f.check().join("\n")
  assert.match(errors, /fenced code/i)
  assert.match(errors, /inline code/i)
})

test("versions, technical identifiers and heading structure cannot drift", t => {
  const f = fixture(t, "# Install\n\nCall bootstrap_vipermesh_session for version 1.3.0.\n")
  f.write("docs/i18n/es/guide.md", "# Instalacion\n\nLlama iniciar_sesion en la version 1.2.0.\n\n## Resumen\n")
  const errors = f.check().join("\n")
  assert.match(errors, /version/i)
  assert.match(errors, /technical identifier/i)
  assert.match(errors, /structure/i)
})

test("unfenced site setup CLI and JSON stay exact", t => {
  const source = '# Setup\n\ngit clone https://github.com/Ker102/vipermesh-blender.git\ncd vipermesh-blender\nnpm install\nnpm run build\n\n{\n  "mcpServers": {}\n}\n'
  const f = fixture(t, source)
  f.manifest.sources[0].path = "site/setup/index.md"
  fs.unlinkSync(path.join(f.root, "guide.md"))
  fs.unlinkSync(path.join(f.root, "docs/i18n/es/guide.md"))
  f.write("site/setup/index.md", source)
  f.write("docs/i18n/es/site/setup/index.md", source.replace("# Setup", "# Configuracion").replace("npm run build", "npm run test").replace('"mcpServers"', '"servers"'))
  f.save()
  assert.match(f.check().join("\n"), /unfenced setup code/i)
})

test("local links must use translated peers and original assets", t => {
  const source = "# Install\n\n[Self](guide.md#install) ![Logo](assets/logo.svg)\n"
  const f = fixture(t, source)
  f.write("assets/logo.svg", '<svg xmlns="http://www.w3.org/2000/svg"></svg>')
  f.write("docs/i18n/es/guide.md", '<a id="install"></a>\n# Instalacion\n\n[Yo](guide.md#install) ![Marca](../../../assets/logo.svg)\n')
  assert.deepEqual(f.check(), [])
  f.write("docs/i18n/es/guide.md", '# Instalacion\n\n[Yo](../../../guide.md#install) ![Marca](assets/missing.svg)\n')
  const errors = f.check().join("\n")
  assert.match(errors, /link target fidelity/i)
  assert.match(errors, /missing link target/i)
})

test("broken fragment and incorrectly cased paths fail", t => {
  const f = fixture(t, "# Install\n\n[Self](guide.md#install)\n")
  f.write("docs/i18n/es/guide.md", "# Instalacion\n\n[Yo](Guide.md#missing)\n")
  const errors = f.check().join("\n")
  assert.match(errors, /case|missing link target/i)
  f.write("docs/i18n/es/guide.md", "# Instalacion\n\n[Yo](guide.md#install)\n")
  assert.match(f.check().join("\n"), /missing fragment/i)
})

test("reference links, HTML assets, nested destinations and literal code", () => {
  const parsed = scanMarkdown('# [Release]\n\n[Release]: https://example.org/v1.3.0\n\n[Manual][ref] ![Image](<assets/a b.png>)\n[Shape](assets/a(b).svg)\n<img src="assets/logo.svg"><a id="stable"></a>\n[ref]: guide.md#install\n\n`[Ignored](missing.md)`\n\n```text\n[Ignored](missing.md)\n```\n')
  assert.deepEqual(parsed.links.map(link => link.target).sort(), [
    "https://example.org/v1.3.0", "guide.md#install", "https://example.org/v1.3.0",
    "guide.md#install", "assets/a b.png", "assets/a(b).svg", "assets/logo.svg"
  ].sort())
  assert.ok(parsed.anchors.has("stable"))
  assert.ok(!parsed.links.some(link => link.target === "missing.md"))
})

test("undefined explicit reference links fail", t => {
  const f = fixture(t)
  f.write("docs/i18n/es/guide.md", f.source.replace("# Install", "# Instalacion") + "\n[Manual][missing]\n")
  assert.match(f.check().join("\n"), /undefined reference/i)
})

test("percent-encoded traversal and unsafe manifest paths fail", t => {
  const f = fixture(t, "# Install\n\n[Self](guide.md#install)\n")
  f.write("docs/i18n/es/guide.md", "# Instalacion\n\n[Yo](../../../../%2e%2e/outside.md)\n")
  assert.match(f.check().join("\n"), /escapes repository/i)
  f.manifest.sources[0].path = "../outside.md"
  f.save()
  assert.match(f.check().join("\n"), /unsafe source path/i)
})

test("README native language bar is required and checked separately", t => {
  const f = fixture(t, "# Install\n")
  f.manifest.sources[0].path = "README.md"
  fs.unlinkSync(path.join(f.root, "guide.md"))
  fs.unlinkSync(path.join(f.root, "docs/i18n/es/guide.md"))
  f.write("README.md", "# Install\n")
  f.write("docs/i18n/es/README.md", "# Instalacion\n")
  f.save()
  assert.match(f.check().join("\n"), /language navigation/i)
})

test("a complete claim cannot hide untranslated content", t => {
  const f = fixture(t)
  f.write("docs/i18n/es/guide.md", f.source)
  assert.match(f.check().join("\n"), /identical to English/i)
})

test("repeated heading aliases follow GitHub numbering", () => {
  const parsed = scanMarkdown("# Changed\n\n## Changed\n\n## Changed-1\n\n## Changed\n")
  assert.deepEqual(parsed.headings.map(heading => heading.slug), ["changed", "changed-1", "changed-1-1", "changed-2"])
})

test("numbers in prose and translation infrastructure remain checked", t => {
  const f = fixture(t, "# Install\n\nLimit: 32 commands, 3 MiB.\n")
  f.write("docs/i18n/es/guide.md", '<a id="install"></a>\n# Instalacion\n\nLimite: 64 comandos, 6 MiB.\n')
  assert.match(f.check().join("\n"), /numeric values/i)
  f.manifest.infrastructure.push("docs/i18n/README.md")
  f.save()
  assert.match(f.check().join("\n"), /missing infrastructure/i)
})

test("aliased headings do not affect numeric fidelity", t => {
  const f = fixture(t, "# Version 1.3.0\n\nVersion 1.3.0.\n")
  f.write("docs/i18n/es/guide.md", '<a id="version-130"></a>\n# Version 1.3.0\n\nLa version 1.3.0.\n')
  assert.deepEqual(f.check(), [])
})

test("East Asian sentence punctuation is not part of a URL", () => {
  const source = scanMarkdown("[Checksum](https://example.org/check.sha256).\n")
  const translated = scanMarkdown("[校验和](https://example.org/check.sha256)。\n")
  assert.deepEqual(translated.externalUrls, source.externalUrls)
})

test("heading fragments retain inline code text", () => {
  const parsed = scanMarkdown("## Does ViperMesh replace `execute_code`?\n")
  assert.equal(parsed.headings[0].slug, "does-vipermesh-replace-execute_code")
})

test("equivalent relative README switcher paths are accepted", t => {
  const f = fixture(t)
  const start = "<!-- i18n:languages:start -->\n", end = "\n<!-- i18n:languages:end -->\n\n"
  const source = start + "[English](README.md) | [Español](docs/i18n/es/README.md)" + end + f.source
  const target = start + "[English](../../../README.md) | [Español](../es/README.md)" + end + f.source.replace("# Install", '<a id="install"></a>\n# Instalacion').replace("Use ", "Usa ")
  fs.unlinkSync(path.join(f.root, "guide.md"))
  fs.unlinkSync(path.join(f.root, "docs/i18n/es/guide.md"))
  f.manifest.sources[0] = { path: "README.md", sha256: sourceHash(source), completedLocales: ["es"] }
  f.write("README.md", source)
  f.write("docs/i18n/es/README.md", target)
  f.save()
  assert.deepEqual(f.check(), [])
})
