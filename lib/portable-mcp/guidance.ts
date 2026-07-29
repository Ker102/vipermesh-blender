import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url))
const TOOL_SKILLS_DIR = [
  path.resolve(
    MODULE_DIR,
    "..",
    "..",
    "skills",
    "using-vipermesh-blender",
    "references"
  ),
  path.resolve(
    MODULE_DIR,
    "..",
    "skills",
    "using-vipermesh-blender",
    "references"
  ),
  path.resolve(
    process.cwd(),
    "skills",
    "using-vipermesh-blender",
    "references"
  ),
].find((candidate) => fs.existsSync(candidate)) ??
  path.resolve(
    MODULE_DIR,
    "..",
    "..",
    "skills",
    "using-vipermesh-blender",
    "references"
  )
const MAX_GUIDANCE_DOCUMENT_BYTES = 64 * 1024
const DEFAULT_GUIDANCE_LIMIT = 5
const MAX_GUIDANCE_LIMIT = 20
const MAX_GUIDANCE_EXCERPT_CHARS = 8_000

export interface GuidanceSearchInput {
  query: string
  limit?: number
  source?: "all" | "local" | "semantic"
  minSimilarity?: number
}

export interface GuidanceSearchItem {
  id: string
  title: string
  content: string
  source: string
  similarity?: number
  metadata?: Record<string, unknown> | null
}

export interface GuidanceSearchResult {
  query: string
  source: "all" | "local" | "semantic"
  results: GuidanceSearchItem[]
  semanticError?: string
}

interface GuidanceDependencies {
  semanticSearch: (
    query: string,
    options: {
      limit: number
      source?: string
      minSimilarity: number
    }
  ) => Promise<Array<{
    id: string
    content: string
    metadata?: Record<string, unknown> | null
    source?: string
    similarity?: number
  }>>
}

function normalizeLimit(value: number | undefined) {
  if (!Number.isFinite(value)) return DEFAULT_GUIDANCE_LIMIT
  return Math.min(MAX_GUIDANCE_LIMIT, Math.max(1, Math.floor(value as number)))
}

function validateGuideFilename(filename: string) {
  if (
    !filename ||
    path.isAbsolute(filename) ||
    filename !== path.basename(filename) ||
    filename.includes("/") ||
    filename.includes("\\") ||
    !filename.endsWith(".md")
  ) {
    throw new Error("Guidance filename must be a Markdown basename")
  }
}

function guidePath(filename: string) {
  validateGuideFilename(filename)
  const resolved = path.resolve(TOOL_SKILLS_DIR, filename)
  const relative = path.relative(TOOL_SKILLS_DIR, resolved)
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error("Guidance filename resolves outside the tool-skill directory")
  }
  return resolved
}

function boundedContent(content: string) {
  const bytes = Buffer.byteLength(content, "utf8")
  if (bytes <= MAX_GUIDANCE_DOCUMENT_BYTES) return content

  let result = content.slice(0, MAX_GUIDANCE_DOCUMENT_BYTES)
  while (Buffer.byteLength(result, "utf8") > MAX_GUIDANCE_DOCUMENT_BYTES) {
    result = result.slice(0, -256)
  }
  return result
}

function excerpt(content: string) {
  return content.length <= MAX_GUIDANCE_EXCERPT_CHARS
    ? content
    : `${content.slice(0, MAX_GUIDANCE_EXCERPT_CHARS)}\n[truncated]`
}

function titleFromContent(filename: string, content: string) {
  const heading = content.match(/^#\s+(.+)$/m)?.[1]?.trim()
  return heading || filename.replace(/\.md$/i, "").replaceAll("-", " ")
}

export function getGuidanceDocument(filename: string) {
  const filepath = guidePath(filename)
  if (!fs.existsSync(filepath) || !fs.statSync(filepath).isFile()) {
    throw new Error(`Guidance document not found: ${filename}`)
  }

  const rawContent = fs.readFileSync(filepath, "utf8")
  const content = boundedContent(rawContent)
  return {
    filename,
    title: titleFromContent(filename, content),
    content,
    truncated:
      Buffer.byteLength(rawContent, "utf8") > MAX_GUIDANCE_DOCUMENT_BYTES,
  }
}

function searchLocalGuides(query: string, limit: number): GuidanceSearchItem[] {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .map((term) => term.trim())
    .filter(Boolean)

  if (terms.length === 0) return []

  return fs
    .readdirSync(TOOL_SKILLS_DIR)
    .filter((filename) => filename.endsWith(".md"))
    .map((filename) => {
      const content = fs.readFileSync(guidePath(filename), "utf8")
      const haystack = `${filename}\n${content}`.toLowerCase()
      const score = terms.reduce(
        (total, term) => total + (haystack.includes(term) ? 1 : 0),
        0
      )
      return { filename, content, score }
    })
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score || left.filename.localeCompare(right.filename))
    .slice(0, limit)
    .map(({ filename, content }) => ({
      id: `local:${filename}`,
      title: titleFromContent(filename, content),
      content: excerpt(content),
      source: "tool-skills",
      metadata: { filename, retrieval: "local" },
    }))
}

export async function search3dGuidance(
  input: GuidanceSearchInput,
  dependencies: GuidanceDependencies
): Promise<GuidanceSearchResult> {
  const query = input.query.trim()
  if (!query) {
    throw new Error("Guidance search query is required")
  }

  const limit = normalizeLimit(input.limit)
  const source = input.source ?? "all"
  const minSimilarity = Math.min(1, Math.max(0, input.minSimilarity ?? 0.4))
  const localResults =
    source === "semantic" ? [] : searchLocalGuides(query, limit)
  let semanticResults: GuidanceSearchItem[] = []
  let semanticError: string | undefined

  if (source !== "local") {
    try {
      const results = await dependencies.semanticSearch(query, {
        limit,
        minSimilarity,
      })
      semanticResults = results.map((result) => ({
        id: result.id,
        title:
          typeof result.metadata?.title === "string"
            ? result.metadata.title
            : result.source ?? "Semantic guidance",
        content: excerpt(result.content),
        source: result.source ?? "semantic",
        similarity: result.similarity,
        metadata: result.metadata,
      }))
    } catch (error) {
      semanticError =
        error instanceof Error ? error.message : "Semantic guidance search failed"
    }
  }

  const deduplicated = new Map<string, GuidanceSearchItem>()
  for (const result of [...semanticResults, ...localResults]) {
    const key = `${result.source}:${result.id}`
    if (!deduplicated.has(key)) deduplicated.set(key, result)
  }

  return {
    query,
    source,
    results: [...deduplicated.values()].slice(0, limit),
    ...(semanticError ? { semanticError } : {}),
  }
}
