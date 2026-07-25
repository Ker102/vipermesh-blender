# Contributing

Thanks for improving ViperMesh for Blender.

## Development

Requirements:

- Node.js 20 or newer
- Python 3.11 or newer
- Blender 5.2 for live compatibility checks

```bash
npm install
npm run check
```

Install `addon/vipermesh-addon.py` through Blender's **Install from Disk**
workflow, start the local bridge, and run `npm run mcp` for live testing.

## Pull Requests

- Keep changes focused and explain the user-visible behavior.
- Add or update conformance coverage for protocol and packaging changes.
- Test Blender mutations on a disposable scene.
- Never commit credentials, private asset catalogs, benchmark evidence, or
  proprietary ViperMesh product code.
- Preserve the deterministic-tool-first design and keep `execute_code`
  available for uncovered custom work.

Use Conventional Commit-style subjects where practical, such as
`feat(addon): add mesh validation`.

By contributing, you agree that your contribution is licensed under the MIT
License.
