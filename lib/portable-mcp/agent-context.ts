const COMPACT_AGENT_CONTEXT = `# ViperMesh Blender MCP operating context

You are operating Blender through the ViperMesh portable MCP gateway.

1. Keep one MCP server process alive for the complete agent session. Never launch npm, npx, tsx, or another MCP subprocess for individual operations.
2. Inspect current scene state before mutation. Prefer get_scene_info or get_all_object_info in a single call.
3. Search search_3d_guidance for task-specific Blender and ViperMesh guidance before unfamiliar or high-risk work.
4. Discover direct tools with list_blender_tools. Prefer deterministic structured tools where they cover the operation.
5. Use run_blender_scene_stage when its optional build, inspect_preview, and finalize helpers fit the task. They can configure cameras and lighting: use standalone tools to preserve an artist's existing presentation. Batch only already-decided actions; inspect when the next decision depends on a result.
6. Keep execute_code available for genuinely custom geometry, procedural effects, unusual node setups, and other operations not covered by direct tools. Keep fallback scripts scoped to one logical cluster.
7. For reference reconstruction, compare required-object presence, relative scale, orientation, support, occlusion, framing, and lighting. Choose useful previews according to uncertainty and task complexity; avoid fixed preview counts, redundant screenshots and full-scene dumps.
8. Verify consequential contact, support, orientation, and clearance with inspect_scene_grounding and explicit inspect_spatial_relations constraints. Bounds-based checks are diagnostic, not proof of exact mesh contact. Inspect suspicious contact and collisions from another angle; respect intentional suspension, overlaps or stylization.
9. Perform visual checks after major changes and before acceptance. Use a viewport capture when a usable 3D viewport exists; use a camera thumbnail or render artifact for autonomous/headless sessions.
10. Tool success and image-file health do not prove visual quality. Open and inspect the actual requested output; repair concrete defects and recheck affected relationships. Report unresolved failures instead of declaring them correct. Save a .blend only when requested, to an approved path; inspection/render/export-only tasks need no blend save.
11. Import multi-object local assets with one managed bottom-center root and placement transform in import_local_asset; request compact output instead of manually creating an Empty, parenting every child, and transforming children one by one.
`

export function getBlenderAgentContext() {
  return {
    profile: "compact" as const,
    context: COMPACT_AGENT_CONTEXT,
    exactInAppHarness: false,
    recommendedFirstCalls: ["get_scene_info", "search_3d_guidance"],
  }
}
