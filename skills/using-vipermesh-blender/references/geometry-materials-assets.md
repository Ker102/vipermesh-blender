# Geometry, Materials, And Assets

## Geometry Strategy

Select an approach based on the requested form and downstream use:

- primitives and assembly tools for blockouts and hard-surface structures
- curves for paths, cables, rails, and profile-driven forms
- modifiers for reversible repetition, smoothing, thickness, and deformation
- retopology tools for density reduction or topology conversion
- `execute_code` for custom procedural geometry that lacks a suitable direct
  operation

Avoid treating one method as universally superior. Preserve source geometry
when a destructive conversion would make iteration harder.

## Materials

Use structured material tools for common Principled BSDF and texture workflows.
Check texture paths, color space, UV dependence, and render-engine behavior when
the result matters beyond a preview.

Material values should respond to the intended substance, scale, lighting, and
art direction. Defaults and physical ranges are useful references, not a reason
to override deliberate stylization.

## Assets

Search reusable assets before manually approximating complex objects whose
identity depends on detailed geometry. Import multi-object assets through a
managed root when possible, then inspect bounds, scale, orientation, and support
in the destination scene.

An asset match is a candidate, not automatic acceptance. Verify that its
license, style, topology, materials, and functional direction fit the task.
