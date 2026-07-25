---
title: "Animation & Keyframing Guide"
category: "animation"
tags: ["animation", "keyframe", "F-curve", "interpolation", "easing", "timeline", "shape key", "shape_key", "morph target", "blend shape", "viseme", "facial expression", "same-topology", "target mesh", "slider range", "mute", "rename", "delete", "duplicate", "mix", "bake", "squash", "stretch", "bounce", "timing", "turntable", "product spin", "keyframe_insert", "fcurves", "NLA", "inspect_shape_keys", "extract_shape_key_to_object", "create_shape_key_from_object", "set_shape_key_properties", "rename_shape_key", "delete_shape_key", "duplicate_shape_key", "create_shape_key_from_mix", "set_shape_key_value", "set_timeline_settings", "set_keyframe_animation", "create_turntable_animation"]
description: "Research-backed animation guide covering Blender 5.0 breaking API changes, keyframe performance hierarchy (RNA vs bpy.ops), F-curve access/modifier patterns, and the 12 Disney animation principles with volume-preserving code. Based on NotebookLM research with 8 cited sources."
blender_version: "5.0+"
triggered_by: ["inspect_animation_data", "inspect_shape_keys", "extract_shape_key_to_object", "create_shape_key_from_object", "set_shape_key_properties", "rename_shape_key", "delete_shape_key", "duplicate_shape_key", "create_shape_key_from_mix", "set_shape_key_value", "set_timeline_settings", "set_keyframe_animation", "create_turntable_animation"]
---

# Animation Guide — Blender Agent Best Practices

> **Domain:** Keyframing, F-Curves, Interpolation, Animation Principles
> **Version:** Blender 5.x (verified via NotebookLM research)
> **Purpose:** Research-backed guide for the agent. Use `inspect_animation_data` before changing existing animation, `inspect_shape_keys` before morph/viseme/expression edits, `extract_shape_key_to_object` to materialize an existing morph as an editable target, `create_shape_key_from_object` when a same-topology target mesh already contains the desired morph geometry, `set_shape_key_properties` for slider ranges or mute state, `rename_shape_key` and `delete_shape_key` for bounded shape-key control cleanup, `duplicate_shape_key` for shape-key variants, `create_shape_key_from_mix` for baked composite morph controls, `set_timeline_settings` for timeline range/FPS/current-frame setup, `create_turntable_animation` for product/model showcase spins, then `set_keyframe_animation` or `set_shape_key_value` for bounded keys. Reserve `execute_code` only for unsupported animation systems such as custom drivers, rig controls, arbitrary shape-key sculpting without a target mesh, particles, or procedural simulations.

---

## CRITICAL: Blender 5.0 Breaking Changes

> **Source:** Blender 5.0 Python API review (ojambo.com), BlenderArtists forums

- **Dict-like property access removed:** `bpy.context.scene['cycles']` no longer works
- **New `get_transform` / `set_transform` methods** replace older getter/setter workflows
- **Bundled modules now private:** `bl_console_utils`, `bl_rna_utils` cannot be used by scripts
- **`property_unset`** replaces dict-like access for old property patterns

---

## 0. Inspect Before Editing Existing Animation

Call `inspect_animation_data` before creating or editing keyframes on an existing scene, rig, material, driver, or NLA setup. Use its timeline, action, F-curve, driver, and NLA report to avoid overwriting the wrong action slot, duplicating curves, or changing hidden animation state.

Use `set_timeline_settings` for frame range, FPS, current frame, preview range, and playback sync before animation or render workflows. Use `create_turntable_animation` for model showcase/product spin loops because it owns target validation, rotation axis, linear interpolation, timeline expansion, and frame restoration. Use `set_keyframe_animation` for object transform animation on `location`, `rotation_euler`, or `scale` when the motion is not a simple turntable.

Use `inspect_shape_keys` before changing morph targets, visemes, blend shapes, or facial expression sliders. Use `extract_shape_key_to_object` to turn an existing shape key into a separate editable same-topology target mesh. Use `create_shape_key_from_object` when the requested shape-key geometry can be copied from a same-topology duplicate or edited target mesh. Use `set_shape_key_properties` when only the slider range or mute state needs to change. Use `rename_shape_key` or `delete_shape_key` when the requested work only cleans up existing shape-key controls. Use `duplicate_shape_key` when a new morph should start from an existing shape key. Use `create_shape_key_from_mix` when existing shape-key values should be baked into a new composite control. Use `set_shape_key_value` when the requested work only needs existing shape-key values or value keyframes. Keep `execute_code` for arbitrary custom shape-key sculpting when there is no same-topology target object to copy from.

Keep `execute_code` for unsupported animation systems only, and verify all generated F-curves with `inspect_animation_data`.

---

## 1. Performance: NEVER Use bpy.ops for Keyframes in Loops

> **Source:** StackExchange "Improving Python Performance with Blender Operators"

`bpy.ops` operators cause **implicit scene updates** on every call. In a loop adding N objects,
this causes O(n²) total checks — exponential slowdown.

### API Hierarchy (fastest to slowest):
| Method | Speed | Use When |
|--------|-------|----------|
| Low-level F-Curve API (manual `keyframe_points`) | ⚡ Fastest | Bulk animation, many objects |
| `Object.keyframe_insert()` (RNA method) | ✅ Fast | Standard use — **PREFERRED** |
| `bpy.ops.anim.keyframe_insert()` | ❌ Slow | Never use in scripts |
| `bpy.ops.anim.keyframe_insert_menu()` | ❌ UI only | Never use in scripts |

### Correct Pattern: RNA Method
```python
import bpy

obj = bpy.data.objects['Cube']
obj.location = (0, 0, 0)
obj.keyframe_insert(data_path='location', frame=1)

obj.location = (0, 0, 5)
obj.keyframe_insert(data_path='location', frame=30)
```

### Fastest Pattern: Low-Level F-Curve API
```python
import bpy

obj = bpy.data.objects['Cube']

# Ensure animation data exists
if not obj.animation_data:
    obj.animation_data_create()
if not obj.animation_data.action:
    obj.animation_data.action = bpy.data.actions.new(name=obj.name + 'Action')

action = obj.animation_data.action

# Add F-curve for location Z (index=2)
fc = action.fcurves.new(data_path='location', index=2)
# Add keyframe points directly
fc.keyframe_points.add(count=2)
fc.keyframe_points[0].co = (1.0, 0.0)      # frame 1, z=0
fc.keyframe_points[1].co = (30.0, 5.0)     # frame 30, z=5
fc.keyframe_points.update()

# Manual scene update required with low-level API
bpy.context.view_layer.update()
```

---

## 2. F-Curve Access and Interpolation

> **Source:** StackExchange "Set Keyframe interpolation CONSTANT"

### Finding F-Curves (Blender 5.0+ Channelbag API)

> **CRITICAL:** In Blender 5.0+, `action.fcurves` was REMOVED.
> Use the channelbag API instead:

```python
from bpy_extras import anim_utils

action = obj.animation_data.action
slot = obj.animation_data.action_slot
channelbag = anim_utils.action_get_channelbag_for_slot(action, slot)

# Find a specific F-curve
fcu = channelbag.fcurves.find('rotation_euler', index=1)  # Y rotation

# Or iterate all F-curves
for fcu in channelbag.fcurves:
    print(fcu.data_path, fcu.array_index)
```

### Setting Interpolation Per-Keyframe
```python
# All keyframes on a curve — both interpolation AND easing are valid properties
for pt in fcu.keyframe_points:
    pt.interpolation = 'BEZIER'  # or 'LINEAR', 'CONSTANT', 'BOUNCE'
    pt.easing = 'EASE_IN_OUT'   # or 'EASE_IN', 'EASE_OUT', 'AUTO'

# Alternative: use handle types for finer control
for pt in fcu.keyframe_points:
    pt.interpolation = 'BEZIER'
    pt.handle_left_type = 'AUTO_CLAMPED'
    pt.handle_right_type = 'AUTO_CLAMPED'

# Specific frame only
frame_num = 24
target = [pt for pt in fcu.keyframe_points if pt.co[0] == frame_num]
if target:
    target[0].interpolation = 'CONSTANT'
```

### Material Animation F-Curves
```python
# Material animations live in node_tree, NOT in object.animation_data
from bpy_extras import anim_utils

mat = bpy.data.materials['Material']
mat_action = mat.node_tree.animation_data.action
mat_slot = mat.node_tree.animation_data.action_slot
mat_cb = anim_utils.action_get_channelbag_for_slot(mat_action, mat_slot)
for fcu in mat_cb.fcurves:  # access material fcurves here
    print(fcu.data_path)
```

---

## 3. F-Curve Modifiers via Python

> **Source:** StackExchange "modifying fcurve modifiers in python"

```python
# Add a Noise modifier to an F-curve (use channelbag API)
from bpy_extras import anim_utils

action = obj.animation_data.action
slot = obj.animation_data.action_slot
channelbag = anim_utils.action_get_channelbag_for_slot(action, slot)

fcu = channelbag.fcurves.find('location', index=2)
modifier = fcu.modifiers.new('NOISE')
modifier.scale = 10      # adjust noise scale
modifier.strength = 0.5  # adjust noise strength

# Cycles modifier (for repeating animation)
cycle_mod = fcu.modifiers.new('CYCLES')
# Properties come with defaults — only set what you need to change
```

Available modifier types: `'NOISE'`, `'CYCLES'`, `'LIMITS'`, `'GENERATOR'`,
`'ENVELOPE'`, `'FNGENERATOR'`, `'STEPPED'`

---

## 4. The 12 Animation Principles (Disney)

> **Source:** Wikipedia "Twelve basic principles of animation" (Johnston & Thomas, 1981)

These principles guide HOW the agent should create animations, not just the API calls:

### Volume-Preserving Squash & Stretch
When an object squashes, its width must increase. When it stretches, width decreases.
**Rule: X × Y × Z scale product must stay constant.**

```python
# Impact frame: squash (wider, shorter)
obj.scale = (1.3, 1.3, 0.6)   # 1.3 * 1.3 * 0.6 ≈ 1.01 (volume preserved)
obj.keyframe_insert(data_path='scale', frame=15)

# Stretch frame: taller, thinner
obj.scale = (0.8, 0.8, 1.56)  # 0.8 * 0.8 * 1.56 ≈ 1.0
obj.keyframe_insert(data_path='scale', frame=20)
```

### Slow In / Slow Out
More frames near start and end of action = realistic acceleration/deceleration.
Use `BEZIER` interpolation with `EASE_IN_OUT` — this is the Blender equivalent.

### Anticipation
Before a big action, add a small opposite movement (wind-up before punch, crouch before jump).

### Follow Through
After main action stops, appendages/loose parts continue moving briefly, then settle.
Implement with offset keyframes on child objects or secondary bones.

### Arcs
Natural movement follows curved paths, not straight lines. Exception: mechanical/robotic motion
uses `LINEAR` interpolation deliberately.

### Timing
Fewer frames = faster/lighter. More frames = slower/heavier.
- Light object bounce: 8-12 frames per bounce
- Heavy object: 20-30 frames per bounce

---

## 5. Timeline Setup

> **Source:** BlenderArtists "Set first and end frame by script"

```python
scene = bpy.context.scene
scene.frame_start = 1
scene.frame_end = 120    # 5 sec at 24fps
scene.render.fps = 24    # Film standard
scene.frame_set(1)       # Go to frame 1
```

---

## 6. Common Pitfalls

| Problem | Cause | Fix (Research-backed) |
|---------|-------|----------------------|
| Keyframes not appearing | Wrong `data_path` string | Check exact path in Blender tooltip |
| Animation data is None | No keyframes inserted yet | Call `obj.animation_data_create()` first |
| Material anim not found | Looking in object instead of node_tree | Use `material.node_tree.animation_data` |
| Slow with many objects | Using `bpy.ops` in loops | Switch to RNA `keyframe_insert()` or low-level API |
| Stiff/robotic motion | Linear interpolation | Use `BEZIER` + `EASE_IN_OUT`, apply 12 principles |
