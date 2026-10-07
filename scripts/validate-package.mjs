import assert from "node:assert/strict"
import fs from "node:fs"

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"))
const cliPath = packageJson.bin?.["vipermesh-blender"]
assert.equal(typeof cliPath, "string", "package.json must expose vipermesh-blender")
assert.ok(fs.existsSync(cliPath), `Missing built CLI: ${cliPath}`)

const cli = fs.readFileSync(cliPath, "utf8")
assert.ok(cli.startsWith("#!/usr/bin/env node"), "Built CLI must retain its Node shebang")
assert.ok(fs.existsSync("skills/using-vipermesh-blender/SKILL.md"))
for (const reference of ["scene-operations", "spatial-validation", "visual-presentation", "geometry-materials-assets", "character-animation-export"]) {
  assert.ok(fs.existsSync(`skills/using-vipermesh-blender/references/${reference}.md`), `Missing shipped reference: ${reference}`)
}
assert.ok(!fs.existsSync("data/tool-guides"))
assert.ok(fs.existsSync("addon/vipermesh-addon.py"))
assert.ok(fs.existsSync("NOTICE.md"))
assert.ok(fs.existsSync("SECURITY.md"))

console.log("ViperMesh package contents are valid")
