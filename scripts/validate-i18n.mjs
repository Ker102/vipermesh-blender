import fs from "node:fs"
import path from "node:path"
import crypto from "node:crypto"
import { fileURLToPath } from "node:url"

const navigationPattern = /<!-- i18n:languages:start -->[\s\S]*?<!-- i18n:languages:end -->/g
const languageNames = { en: "English", es: "Español", "zh-CN": "简体中文", fr: "Français", ja: "日本語", de: "Deutsch", "pt-BR": "Português (Brasil)" }
const normalize = text => text.replace(/\r\n/g, "\n")
const withoutNavigation = text => normalize(text).replace(navigationPattern, "")
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)
const sorted = values => [...values].sort()
const refKey = label => label.trim().replace(/\s+/g, " ").toLowerCase()

export function sourceHash(text) {
  return crypto.createHash("sha256").update(normalize(text), "utf8").digest("hex")
}

function slug(text) {
  return text.replace(/<[^>]*>/g, "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .toLowerCase().replace(/[^\p{L}\p{M}\p{N}_\s-]/gu, "").replace(/\s/g, "-")
}

function destination(text, start) {
  let i = start
  while (/\s/.test(text[i] ?? "") && i < text.length) i++
  if (text[i] === "<") {
    const end = text.indexOf(">", i + 1)
    return end < 0 ? null : text.slice(i + 1, end)
  }
  let value = "", depth = 0
  for (; i < text.length; i++) {
    const char = text[i]
    if (char === "\\" && i + 1 < text.length) {
      value += text[++i]
    } else if (char === "(") {
      depth++
      value += char
    } else if (char === ")") {
      if (depth === 0) return value || null
      depth--
      value += char
    } else if (/\s/.test(char) && depth === 0) {
      return value || null
    } else {
      value += char
    }
  }
  return value || null
}

// This scanner supports the Markdown constructs used by this repository, not
// every CommonMark extension. Mask literal code before interpreting links.
export function scanMarkdown(input) {
  const text = withoutNavigation(input)
  const lines = text.split("\n")
  const fences = [], plainLines = []
  let block = null, marker = null, unclosedFence = false
  for (const line of lines) {
    if (block) {
      block.push(line)
      plainLines.push("")
      const closing = line.match(/^ {0,3}(`+|~+)\s*$/)
      if (closing && closing[1][0] === marker[0] && closing[1].length >= marker.length) {
        fences.push(block.join("\n"))
        block = null
      }
    } else {
      const opening = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/)
      if (opening) {
        marker = opening[1]
        block = [line]
        plainLines.push("")
      } else {
        plainLines.push(line)
      }
    }
  }
  if (block) {
    fences.push(block.join("\n"))
    unclosedFence = true
  }
  let plain = plainLines.join("\n")
  const inline = []
  plain = plain.replace(/(`+)([\s\S]*?)\1(?!`)/g, (_, ticks, content) => {
    // CommonMark treats a line break inside an inline span as a space.
    inline.push(content.replace(/\n/g, " "))
    return " ".repeat(ticks.length * 2 + content.length).replace(/[^\n]/g, " ")
  })

  const anchors = new Set(), headings = [], usedSlugs = new Set()
  for (const match of plain.matchAll(/(?:\bid|\bname)\s*=\s*["']([^"']+)["']/g)) anchors.add(match[1])
  for (const line of plainLines) {
    const heading = line.match(/^ {0,3}(#{1,6})\s+(.+?)\s*#*\s*$/)
    if (!heading) continue
    const base = slug(heading[2])
    let id = base, suffix = 1
    while (usedSlugs.has(id)) id = base + "-" + suffix++
    usedSlugs.add(id)
    headings.push({ level: heading[1].length, slug: id })
    anchors.add(id)
  }

  const links = [], definitions = new Map(), unresolvedReferences = []
  const definitionPattern = /^ {0,3}\[([^\]]+)\]:[ \t]*(.*)$/gm
  for (const match of plain.matchAll(definitionPattern)) {
    const target = destination(match[2], 0)
    if (target) {
      definitions.set(refKey(match[1]), target)
      links.push({ target })
    }
  }
  const linkText = plain.replace(definitionPattern, "")
  for (const match of linkText.matchAll(/\]\(/g)) {
    const target = destination(linkText, match.index + 2)
    if (target) links.push({ target })
  }
  for (const match of linkText.matchAll(/!?\[([^\]\n]+)\](?:\[([^\]\n]*)\])?/g)) {
    if (linkText[match.index + match[0].length] === "(") continue
    if (/^[ xX]$/.test(match[1])) continue
    const key = refKey(match[2] || match[1])
    if (definitions.has(key)) links.push({ target: definitions.get(key) })
    else if (match[2] !== undefined) unresolvedReferences.push(key)
  }
  for (const match of plain.matchAll(/\b(?:href|src)\s*=\s*["']([^"']+)["']/gi)) links.push({ target: match[1] })

  const structural = plain.replace(/^\s*<a\s+(?:id|name)=["'][^"']+["']\s*><\/a>\s*$/gm, "")
  const structuralLines = structural.split("\n")
  const shape = {
    headings: headings.map(h => h.level),
    lists: structuralLines.flatMap(line => {
      const match = line.match(/^\s*(?:([-+*])\s+|(\d+)[.)]\s+)/)
      return match ? [match[2] ? "ordered" : "unordered"] : []
    }),
    tables: structuralLines.filter(line => /^\s*\|.*\|\s*$/.test(line)).map(line => (line.match(/\|/g) ?? []).length),
    quotes: structuralLines.filter((line, i) => /^\s*>/.test(line) && !/^\s*>/.test(structuralLines[i - 1] ?? "")).length
  }
  const literalFree = text.replace(/^\s*<a\s+(?:id|name)=["'][^"']+["']\s*><\/a>\s*$/gm, "")
  return {
    text, plain, fences, inline, anchors, headings, links, unresolvedReferences, shape, unclosedFence,
    versions: sorted(literalFree.match(/(?<![\w])v?\d+\.\d+(?:\.\d+)*(?!\w)/g) ?? []),
    numbers: sorted(literalFree.match(/\d+(?:\.\d+)*/g) ?? []),
    identifiers: sorted(literalFree.match(/\b[a-z]+(?:_[a-z0-9]+)+\b/g) ?? []),
    externalUrls: sorted(literalFree.match(/\bhttps?:\/\/[^\s<>"\]\)。，；！？）]+/g)?.map(url => url.replace(/[,.;]+$/, "")) ?? []),
    prose: structural.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
  }
}

function setupCode(text) {
  const lines = normalize(text).split("\n")
  const blocks = []
  for (let i = 0; i < lines.length; i++) {
    if (/^git clone /.test(lines[i])) {
      const code = [lines[i++]]
      while (i < lines.length && /^(?:cd |npm )/.test(lines[i])) code.push(lines[i++])
      blocks.push(code.join("\n"))
      i--
    } else if (lines[i] === "{") {
      const code = []
      for (let j = i; j < lines.length; j++) {
        code.push(lines[j])
        try {
          const data = JSON.parse(code.join("\n"))
          if (data && typeof data === "object") blocks.push(code.join("\n"))
          i = j
          break
        } catch {
          // A complete JSON object may require more lines.
        }
      }
    }
  }
  return blocks
}

function safeRepoPath(relative) {
  return typeof relative === "string" && relative.length > 0 && !/[\\:]/.test(relative)
    && !relative.startsWith("/") && relative.split("/").every(part => part && part !== "." && part !== "..")
}

function contained(root, absolute) {
  const relative = path.relative(root, absolute)
  return relative === "" || relative !== ".." && !relative.startsWith(".." + path.sep) && !path.isAbsolute(relative)
}

function canonicalLink(root, document, target) {
  target = target.replace(/&amp;/g, "&")
  if (/^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith("//")) return { external: target, identity: target }
  const hash = target.indexOf("#")
  const fragment = hash < 0 ? "" : decodeURIComponent(target.slice(hash + 1))
  const before = (hash < 0 ? target : target.slice(0, hash)).split("?")[0]
  const decoded = decodeURIComponent(before)
  if (decoded.includes("\\") || /^[a-z]:/i.test(decoded)) throw new Error("unsafe link path: " + target)
  const absolute = decoded === "" ? path.resolve(root, document)
    : decoded.startsWith("/") ? path.resolve(root, "." + decoded)
    : path.resolve(root, path.dirname(document), decoded)
  if (!contained(root, absolute)) throw new Error("link escapes repository: " + target)
  const relative = path.relative(root, absolute).split(path.sep).join("/")
  return { absolute, relative, fragment, identity: relative + (fragment ? "#" + fragment : "") }
}

function exactCaseExists(root, relative) {
  let directory = root
  for (const part of relative.split("/")) {
    if (!part || !fs.existsSync(directory) || !fs.statSync(directory).isDirectory()) return false
    if (!fs.readdirSync(directory).includes(part)) return false
    directory = path.join(directory, part)
  }
  return fs.existsSync(directory)
}

function walk(root, relative = "", ignored = []) {
  const files = []
  for (const entry of fs.readdirSync(path.join(root, relative), { withFileTypes: true })) {
    const name = relative ? relative + "/" + entry.name : entry.name
    if (ignored.some(tree => name === tree.slice(0, -1) || name.startsWith(tree))) continue
    if (entry.isDirectory()) files.push(...walk(root, name, ignored))
    else files.push(name)
  }
  return files
}

export function validateRepository(directory, { requireComplete = true } = {}) {
  const root = path.resolve(directory), errors = []
  let manifest
  try {
    manifest = JSON.parse(fs.readFileSync(path.join(root, "docs/i18n/manifest.json"), "utf8"))
  } catch (error) {
    return { errors: ["Cannot read i18n manifest: " + error.message], sourceCount: 0, mirrorCount: 0 }
  }
  if (manifest.schemaVersion !== 1 || manifest.sourceHashAlgorithm !== "sha256-utf8-lf") errors.push("Unsupported manifest schema/hash algorithm")
  if (!Array.isArray(manifest.sources) || !Array.isArray(manifest.locales) || !manifest.locales.length) {
    return { errors: [...errors, "Manifest must declare sources and locales"], sourceCount: 0, mirrorCount: 0 }
  }
  const sources = new Set(), locales = manifest.locales, expectedMirrors = new Set()
  if (new Set(locales).size !== locales.length || locales.some(locale => !safeRepoPath(locale) || locale.includes("/") || !(locale in languageNames) || locale === "en")) {
    return { errors: [...errors, "Invalid or duplicate manifest locales"], sourceCount: 0, mirrorCount: 0 }
  }
  for (const entry of manifest.sources) {
    if (!safeRepoPath(entry.path) || entry.path.startsWith("docs/i18n/")) errors.push("Unsafe source path: " + entry.path)
    else if (sources.has(entry.path)) errors.push("Duplicate source path: " + entry.path)
    else sources.add(entry.path)
  }
  if (errors.some(error => /source path/i.test(error))) return { errors, sourceCount: sources.size, mirrorCount: 0 }
  const exclusions = new Set()
  for (const entry of manifest.exclusions ?? []) {
    if (!safeRepoPath(entry.path) || !entry.reason) errors.push("Invalid exclusion: " + entry.path)
    if (sources.has(entry.path)) errors.push("Source also excluded: " + entry.path)
    exclusions.add(entry.path)
  }
  const trees = (manifest.excludedTrees ?? []).map(entry => entry.path)
  for (const entry of manifest.excludedTrees ?? []) {
    if (!entry.reason || !entry.path?.endsWith("/") || !safeRepoPath(entry.path.slice(0, -1))) errors.push("Invalid excluded tree: " + entry.path)
    if ([...sources].some(source => source.startsWith(entry.path))) errors.push("Source inside excluded tree: " + entry.path)
  }
  if (errors.length) return { errors, sourceCount: sources.size, mirrorCount: 0 }
  const infrastructure = new Set(manifest.infrastructure ?? [])
  for (const file of infrastructure) {
    if (!safeRepoPath(file)) errors.push("Unsafe infrastructure path: " + file)
    else if (!exactCaseExists(root, file)) errors.push("Missing infrastructure: " + file)
  }
  for (const file of walk(root, "", trees)) {
    if (file.startsWith("docs/i18n/") || infrastructure.has(file) || exclusions.has(file) || sources.has(file)) continue
    if (/\.(?:md|txt|rst|adoc)$/i.test(file)) errors.push("Unclassified documentation: " + file)
  }

  const cache = new Map()
  function read(relative) {
    if (!cache.has(relative)) cache.set(relative, fs.readFileSync(path.join(root, relative), "utf8"))
    return cache.get(relative)
  }
  function checkLinks(document, parsed) {
    for (const reference of parsed.unresolvedReferences) errors.push(document + ": undefined reference " + reference)
    if (parsed.unclosedFence) errors.push(document + ": unclosed fenced code block")
    for (const link of parsed.links) {
      let resolved
      try {
        resolved = canonicalLink(root, document, link.target)
      } catch (error) {
        errors.push(document + ": " + error.message)
        continue
      }
      if (resolved.external) continue
      if (!exactCaseExists(root, resolved.relative)) {
        errors.push(document + ": missing link target or incorrect case " + link.target)
        continue
      }
      if (!contained(root, fs.realpathSync(resolved.absolute))) {
        errors.push(document + ": link escapes repository through symlink " + link.target)
        continue
      }
      if (resolved.fragment && fs.statSync(resolved.absolute).isFile()) {
        const anchors = scanMarkdown(read(resolved.relative)).anchors
        if (!anchors.has(resolved.fragment)) errors.push(document + ": missing fragment " + link.target)
      }
    }
  }
  function identities(document, parsed, locale) {
    return sorted(parsed.links.map(link => {
      try {
        const resolved = canonicalLink(root, document, link.target)
        if (locale && !resolved.external && sources.has(resolved.relative)) {
          return "docs/i18n/" + locale + "/" + resolved.identity
        }
        return resolved.identity
      } catch {
        return "invalid:" + link.target
      }
    }))
  }
  function checkNavigation(document, text, locale) {
    const bars = [...normalize(text).matchAll(navigationPattern)]
    if (bars.length !== 1 || normalize(text).slice(0, bars[0]?.index ?? text.length).split("\n").length > 15) {
      errors.push(document + ": language navigation must appear once near the top")
      return
    }
    const bar = bars[0][0]
    const expected = ["en", ...locales].map(code => languageNames[code] + "|" + (code === "en" ? "README.md" : "docs/i18n/" + code + "/README.md"))
    const observed = [...bar.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)].map(match => {
      try {
        return match[1] + "|" + canonicalLink(root, document, match[2]).identity
      } catch {
        return "invalid:" + match[2]
      }
    })
    if (!same(observed, expected)) {
      errors.push(document + ": language navigation labels or targets differ")
    }
    checkLinks(document, scanMarkdown(bar.replace(/<!--.*?-->/g, "")))
  }

  let mirrorCount = 0
  for (const entry of manifest.sources) {
    if (!exactCaseExists(root, entry.path)) {
      errors.push("Missing source: " + entry.path)
      continue
    }
    if (!contained(root, fs.realpathSync(path.join(root, entry.path)))) {
      errors.push("Source escapes repository: " + entry.path)
      continue
    }
    const source = read(entry.path), parsed = scanMarkdown(source)
    if (sourceHash(source) !== entry.sha256) errors.push("Stale source hash: " + entry.path)
    if (requireComplete && !same(sorted(entry.completedLocales ?? []), sorted(locales))) errors.push("Incomplete source coverage: " + entry.path)
    checkLinks(entry.path, parsed)
    if (entry.path === "README.md") checkNavigation(entry.path, source, null)
    for (const locale of locales) {
      const mirror = "docs/i18n/" + locale + "/" + entry.path
      expectedMirrors.add(mirror)
      if (!exactCaseExists(root, mirror)) {
        errors.push("Missing mirror: " + mirror)
        continue
      }
      if (!contained(root, fs.realpathSync(path.join(root, mirror))) || !fs.statSync(path.join(root, mirror)).isFile()) {
        errors.push("Unsafe mirror: " + mirror)
        continue
      }
      mirrorCount++
      const translated = read(mirror), target = scanMarkdown(translated)
      for (const [key, label] of [["fences", "fenced code"], ["inline", "inline code"], ["versions", "version numbers"], ["numbers", "numeric values"], ["identifiers", "technical identifiers"], ["externalUrls", "external URLs"], ["shape", "document structure"]]) {
        if (!same(parsed[key], target[key])) errors.push(mirror + ": " + label + " differ from source")
      }
      if (entry.path === "site/setup/index.md" && !same(setupCode(source), setupCode(translated))) errors.push(mirror + ": unfenced setup code differs from source")
      const sourceName = source.match(/^name:\s*(.+)$/m)?.[1]
      if (sourceName && sourceName !== translated.match(/^name:\s*(.+)$/m)?.[1]) errors.push(mirror + ": skill name changed")
      if (parsed.prose === target.prose) errors.push(mirror + ": content is identical to English")
      for (const heading of parsed.headings) {
        if (!target.anchors.has(heading.slug)) errors.push(mirror + ": missing English heading alias #" + heading.slug)
      }
      if (!same(identities(entry.path, parsed, locale), identities(mirror, target))) errors.push(mirror + ": link target fidelity differs from source")
      checkLinks(mirror, target)
      if (entry.path === "README.md") checkNavigation(mirror, translated, locale)
    }
  }
  for (const locale of locales) {
    const base = "docs/i18n/" + locale
    if (fs.existsSync(path.join(root, base))) {
      for (const mirror of walk(root, base)) if (!expectedMirrors.has(mirror)) errors.push("Unexpected mirror: " + mirror)
    }
    const claimed = manifest.coverage?.[locale]
    const completed = manifest.sources.filter(entry => entry.completedLocales?.includes(locale)).length
    if (requireComplete && (claimed?.status !== "complete" || claimed.completedSourceCount !== completed || completed !== sources.size || claimed.expectedSourceCount !== sources.size)) errors.push("Invalid completed coverage for locale: " + locale)
  }
  for (const key of Object.keys(manifest.coverage ?? {})) if (!locales.includes(key)) errors.push("Unknown coverage locale: " + key)
  for (const extra of fs.readdirSync(path.join(root, "docs/i18n"), { withFileTypes: true })) {
    if (extra.isDirectory() && !locales.includes(extra.name)) errors.push("Unexpected locale directory: " + extra.name)
  }
  for (const document of infrastructure) {
    if (/\.(?:md|txt)$/.test(document) && fs.existsSync(path.join(root, document))) checkLinks(document, scanMarkdown(read(document)))
  }
  return { errors, sourceCount: sources.size, mirrorCount, localeCount: locales.length }
}

function main() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
  const args = process.argv.slice(2)
  if (args[0] === "--help") {
    console.log("Usage: node scripts/validate-i18n.mjs [--hash <repo-relative-source>]\nValidates manifest, freshness, complete mirrors, local links/anchors and code fidelity.\n--hash prints a source hash without modifying files or claiming coverage.")
    return
  }
  if (args[0] === "--hash" && args.length === 2 && safeRepoPath(args[1])) {
    console.log(JSON.stringify({ path: args[1], sha256: sourceHash(fs.readFileSync(path.join(root, args[1]), "utf8")) }, null, 2))
    return
  }
  if (args.length) {
    console.error("Invalid arguments. Use --help.")
    process.exitCode = 2
    return
  }
  const result = validateRepository(root)
  if (result.errors.length) {
    console.error(result.errors.join("\n"))
    console.error(result.errors.length + " i18n validation error(s)")
    process.exitCode = 1
  } else {
    console.log("i18n valid: " + result.sourceCount + " sources, " + result.localeCount + " locales, " + result.mirrorCount + " complete mirrors")
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main()
