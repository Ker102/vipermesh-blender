# Changelog

All notable changes to ViperMesh for Blender are documented here.

## [Unreleased]

### Changed

- Replaced the exported private tool-guide corpus with a concise, installable
  public agent skill and adaptable reference documents.
- Added explicit native stdio client setup and clarified the optional,
  not-yet-supported Docker MCP Toolkit route.
- Added export checks that prevent private `data/tool-guides` content from
  entering public releases.

## [1.2.0] - 2026-07-25

### Added

- Persistent stdio MCP server with one serialized Blender connection per agent
  session.
- Blender addon with explicit Stopped, Ready, Agent connected, and Error
  states.
- Deterministic scene inspection, assembly, materials, lighting, camera,
  rendering, animation, rigging, UV, export, and retopology tools.
- Bounded batch calls and staged build, preview-inspection, and finalize
  workflows.
- Session bootstrap, MCP resources, compact operating context, and checked-in
  task guidance for fresh agents.
- Explicit `execute_code` fallback for genuinely custom Blender work.
- Local-only loopback transport and public release validation.

[Unreleased]: https://github.com/Ker102/vipermesh-blender/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/Ker102/vipermesh-blender/releases/tag/v1.2.0
