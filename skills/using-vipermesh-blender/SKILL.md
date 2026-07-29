---
name: using-vipermesh-blender
description: Operates Blender through the persistent ViperMesh MCP connector. Use for scene inspection, structured Blender edits, validation, rendering, rigging, animation, retopology, assets, and export.
---

# Using ViperMesh For Blender

Use one MCP server process for the complete agent session. The MCP client should
start the server; do not launch `npm`, `npx`, `tsx`, or another server process
for individual Blender operations.

## Start A Session

1. Call `bootstrap_vipermesh_session`.
2. Inspect existing scene state before changing it.
3. Use `search_3d_guidance` for the current task.
4. Use `list_blender_tools` with a relevant category or search term rather than
   loading the complete registry.

Prefer deterministic tools when they express the intended operation. Keep
`execute_code` available for custom geometry, procedural effects, unusual node
graphs, and other work that the structured tools do not cover well.

Batch operations only when their inputs are already known and no intermediate
result changes the next decision. Preserve inspection and repair points between
meaningful stages.

## References

- Scene mutation and lifecycle: [references/scene-operations.md](references/scene-operations.md)
- Contact, orientation, and clearance: [references/spatial-validation.md](references/spatial-validation.md)
- Camera, lighting, previews, and acceptance: [references/visual-presentation.md](references/visual-presentation.md)
- Geometry, materials, and assets: [references/geometry-materials-assets.md](references/geometry-materials-assets.md)
- Characters, animation, and export: [references/character-animation-export.md](references/character-animation-export.md)

These references provide useful patterns and checks, not mandatory recipes.
Adapt them to the user's goal, the current scene, the active render engine, and
the evidence available.
