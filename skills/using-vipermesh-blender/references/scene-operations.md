# Scene Operations

## Choose The Smallest Useful Surface

- Inspect before mutating an existing scene.
- Search or filter the registry around the current task.
- Prefer a named deterministic operation when it matches the requested change.
- Use `execute_code` when custom Blender logic is materially clearer or more
  capable than composing available tools.

## Group Calls Deliberately

`call_blender_tool_batch` is useful for independent or already-decided actions,
such as creating a known blockout or applying several known transforms. Keep
calls separate when the next action depends on dimensions, contact, topology,
viewport feedback, or a render.

`run_blender_scene_stage` can compact common build, preview, and finalize work.
Its stages remain optional and may configure the camera and lighting. Set
`preservePresentation: true` on finalize to keep the active presentation.
Standalone tools are appropriate for targeted
repairs and workflows that do not fit the staged shape.

## Preserve User Work

Treat existing objects, collections, modifiers, materials, animation, and file
paths as user-owned state. Prefer reversible edits and duplicate or save a
revision before destructive operations when recovery would be expensive.

Use descriptive object and collection names when later operations depend on
identity. Do not reorganize a scene merely to make it match one preferred
hierarchy.

## Finish With Evidence

Before reporting completion, confirm that the requested objects and changes
exist and inspect high-risk structural relationships. Save a blend file only
when the user requests it, using their approved destination. Omit `blendPath`
for rendering-only work; inspection and export workflows can use standalone
tools without saving or overwriting a blend file. Produce and inspect the
requested visual or export artifact before claiming it is ready.
