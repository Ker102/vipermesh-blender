export const VIPERMESH_CONNECTOR_MANUAL_URI =
  "vipermesh://blender/connector-manual"
export const VIPERMESH_OPERATING_CONTEXT_URI =
  "vipermesh://blender/operating-context"

export const VIPERMESH_MCP_INSTRUCTIONS = `ViperMesh for Blender uses one persistent MCP server process per agent session.
Do not launch npm, npx, tsx, or another MCP subprocess for individual Blender operations.
Call bootstrap_vipermesh_session once before the first Blender mutation.
Inspect the scene before editing, prefer deterministic Blender tools, group only already-decided operations, and retain execute_code for genuinely custom work.
Use a build, inspect/repair, and finalize workflow. Validate support, orientation, clearance, framing, and the final visual artifact before accepting a scene.`

export const VIPERMESH_CONNECTOR_MANUAL = `# ViperMesh for Blender connector manual

## Session lifecycle

The MCP host starts one persistent ViperMesh MCP server process for the complete
agent session. That process owns one lazy, serialized connection to the Blender addon.
Never invoke the server command separately for each tool call.

## First calls

1. Call \`bootstrap_vipermesh_session\`.
2. If Blender is unavailable, ask the user to start the local bridge or use the
   documented launcher when authorized.
3. Inspect the scene with \`get_scene_info\` through \`call_blender_tool\`.
4. Search task-specific guidance when the operation is unfamiliar or risky.
5. Discover only the relevant tool category or search term.

## Mutation workflow

Prefer deterministic tools over generated Blender Python when they cover the
operation. Use \`call_blender_tool_batch\` only when later commands do not depend
on intermediate observations. Use separate build, inspect/repair, and finalize
decision points for scene work. \`execute_code\` remains available for custom
geometry, procedural effects, unusual node graphs, and other uncovered work.

## Acceptance

Before saving, inspect required-object presence, relative scale, orientation,
support, interpenetration, clearance, occlusion, camera framing, and lighting.
Do not accept an object merely because one camera angle hides a structural
problem. Review the final rendered artifact before declaring completion.
`
