---
title: "Rigging & Rigify Workflow Guide"
category: "rigging"
tags: ["rigging", "rigify", "armature", "skeleton", "metarig", "IK", "bone", "edit-bone", "bone alignment", "rig", "auto-rig", "mesh preparation", "edge loops", "joint", "weight cleanup", "create_rigify_metarig", "inspect_edit_bone_alignment", "set_edit_bone_alignment", "generate_rigify_rig", "bind_mesh_to_armature", "transfer_vertex_group_weights", "project_vertex_group_weights"]
triggered_by: ["inspect_rigging_data", "inspect_edit_bone_alignment", "set_edit_bone_alignment", "inspect_weight_paint_readiness", "normalize_vertex_group_weights", "create_rigify_metarig", "generate_rigify_rig", "bind_mesh_to_armature", "transfer_vertex_group_weights", "project_vertex_group_weights"]
description: "Research-backed guide for Rigify rigging workflows including mesh preparation, per-bone metarig alignment, IK bend requirements, rig generation, and post-rigging weight cleanup. Based on NotebookLM research with 9 cited sources."
blender_version: "4.0+ / 5.x"
---

# Rigging Guide — Blender Agent Best Practices

> **Domain:** Rigging, Skeleton, Armature, Weight Painting
> **Version:** Blender 4.x / 5.x compatible
> **Purpose:** Guide the agent through correct rigging workflows. This is a RAG-injected tool guide — follow every step in order.

---

## ⚠️ AGENT BEHAVIORAL RULES (MANDATORY)

Before starting ANY rigging task, the agent MUST follow these rules:

1. **ALWAYS delete default scene objects first.** If the scene contains a default Cube, default Light, or default Camera, delete them using `delete_object` before creating the character mesh. Check the pre-injected scene state for existing objects.

2. **NEVER pose the rig after creation.** After rigging is complete, leave the character in **rest pose / T-pose**. Do NOT move IK handles, rotate bones, or "demonstrate" the rig works. The user will pose it themselves if needed.

3. **NEVER add materials unless the user explicitly requests them.** Do not assign skin tones, colors, or any material to the character mesh unless the user's prompt specifically asks for materials or colors. The rigging task is about skeleton and weights — not appearance.

4. **PREFER this guide's Rigify workflow over custom armature scripts.** If RAG context includes both this guide AND a custom armature script (like `humanoid_armature.py`), IGNORE the custom armature approach and follow the Rigify workflow described here (Section 2). Rigify produces production-quality rigs with IK controls, FK chains, and proper bone layers.

5. **Scene cleanup comes first.** Before creating any geometry, ensure no conflicting objects exist. If the user wants a "fresh" character, the agent should clear the scene of irrelevant objects.

---

## Decision: Direct Tools vs execute_code

Rigging is still a multi-step workflow, but it should no longer default to freeform Python for
inspection and cleanup. Use direct ViperMesh tools whenever they cover the operation:

- `inspect_rigging_data` before creating or modifying rigs, armatures, bones, vertex groups, or Armature modifiers.
- `inspect_weight_paint_readiness` before binding or cleaning weights.
- `create_rigify_metarig` for bundled human/animal templates. This creates only the blueprint and never auto-fits bones.
- `inspect_edit_bone_alignment` before and after metarig fitting to verify head, tail, roll, length, parent/child links, and Rigify type.
- `set_edit_bone_alignment` for explicit named edit-bone head/tail/roll edits. Keep each call small and model-driven.
- `generate_rigify_rig` only after every metarig bone is aligned and joint bend direction is verified.
- `bind_mesh_to_armature` to bind an existing mesh and armature with automatic, envelope, empty-group, or name-matched weights.
- `transfer_vertex_group_weights` when a clean weighted source and target have identical vertex topology.
- `project_vertex_group_weights` when a clean weighted source must project weights onto a retopologized or different-topology target.
- `normalize_vertex_group_weights` for bounded post-binding cleanup: influence limits, normalization, and tiny-weight pruning.
- `inspect_modifier_constraint_stack`, `configure_modifier`, `add_object_constraint`, and `configure_constraint` for modifier/constraint authoring that fits those schemas.

Use `execute_code` only for custom bone placement logic that cannot be expressed as explicit named
`set_edit_bone_alignment` edits. Enabling Rigify, template creation, edit-bone inspection/alignment,
final generation, and mesh binding are now direct tools. Keep any fallback scripts focused and verify
with inspection tools before generation.

---

## 1. Mesh Preparation (MANDATORY Before Rigging)

Before adding ANY armature to a mesh, the mesh MUST be prepared:

### 1.1 Geometry at Joints
Meshes need **sufficient vertex density at deformation zones** (knees, elbows, shoulders, neck, wrists, ankles).
Simple cylinders or low-poly primitives will deform terribly.

```python
# Add edge loops at joint positions for clean deformation
import bpy, bmesh

obj = bpy.data.objects['CharacterMesh']
bpy.context.view_layer.objects.active = obj
bpy.ops.object.mode_set(mode='EDIT')

# Subdivide the mesh to add geometry, especially at joints
bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.mesh.subdivide(number_cuts=2)  # 2 cuts minimum for joints

bpy.ops.object.mode_set(mode='OBJECT')
```

### 1.2 Clean Topology
Before rigging, ALWAYS run these cleanup steps:

```python
import bpy

obj = bpy.data.objects['CharacterMesh']
bpy.context.view_layer.objects.active = obj
bpy.ops.object.mode_set(mode='EDIT')

# 1. Merge overlapping vertices (critical for auto-weights)
bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.mesh.remove_doubles(threshold=0.0001)

# 2. Fix normals
bpy.ops.mesh.normals_make_consistent(inside=False)

# 3. Apply all transforms BEFORE rigging
bpy.ops.object.mode_set(mode='OBJECT')
bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
```

### 1.3 Scale Check
If the mesh is small (under ~0.5 Blender units tall), **scale up 10x** before auto-weighting,
then scale back down after. Small meshes cause "Bone Heat Weighting: Failed" errors.

---

## 2. Rigify Workflow (Correct Order)

### 2.1 Template Selection
| Template | Use When |
|----------|----------|
| `basic_human` | Simple characters, no face rig needed, game-ready rigs |
| `human` | Full characters with facial animation (has jaw, eyes, lips, breast bones) |
| `basic_quadruped` | Four-legged animals |
| Other templates | `bird`, `cat`, `horse`, `shark`, `wolf` — species-specific |

**Rule:** If unsure, use `basic_human`. The full `human` metarig has complex facial bones
that are unnecessary for most agent-generated characters and can complicate the rig.

### 2.2 Enable Rigify

`create_rigify_metarig` and `generate_rigify_rig` enable the bundled Rigify addon when needed.

### 2.3 Create Metarig

Call `create_rigify_metarig`. Prefer `basic_human` unless facial controls are explicitly needed.
The command returns bone and Rigify-type counts, then instructs the agent to stop for alignment.

### 2.4 Align Metarig to Mesh (CRITICAL — Per-Bone, Not Uniform Scale)

**WRONG approach** (causes rig to extend beyond mesh):
```python
# DON'T DO THIS — uniform bounding-box scale leaves bones outside limbs
scale_factor = mesh_height / meta_height
metarig.scale = (scale_factor, scale_factor, scale_factor)
```

**CORRECT approach** — per-bone alignment with direct tools:

1. Call `inspect_edit_bone_alignment` on the metarig, requesting the bones you intend to fit.
2. Derive explicit target `head` and `tail` coordinates from the mesh silhouette, landmarks, or inspected bounds.
3. Call `set_edit_bone_alignment` with a small batch of named bone edits.
4. Call `inspect_edit_bone_alignment` again and verify every edited bone is centered inside the intended body volume.

Example edit payload:

```json
{
  "armature_name": "Character_Metarig",
  "bones": [
    { "name": "spine", "head": [0, 0, 0.85], "tail": [0, 0, 1.25] },
    { "name": "upper_arm.L", "head": [-0.22, 0, 1.2], "tail": [-0.72, -0.02, 1.05] }
  ]
}
```

### 2.5 Joint Bends (MANDATORY for IK)

Elbows and knees MUST have a **slight bend** — never leave them perfectly straight.
The IK solver cannot determine fold direction for straight chains.

Use `inspect_edit_bone_alignment` to read the current limb joint coordinates, then use
`set_edit_bone_alignment` to nudge elbow/knee joint heads slightly along the intended bend axis.
Keep the offset small and inspect again before generation.

### 2.6 Generate Rig

After alignment and inspection, call `generate_rigify_rig`. Do not set
`regenerate_existing` unless replacing the generated control rig is explicitly intended.

### 2.7 Bind Mesh to Rig

Call `bind_mesh_to_armature` with the target mesh and generated rig names. Use:

- `AUTOMATIC` for initial organic-character bone heat weights.
- `ENVELOPE` only when envelope weighting is intentionally preferred.
- `EMPTY` when an artist will paint weights manually.
- `NAME` when valid bone-named vertex groups already exist.

Leave `replace_existing` false unless inspection confirms that the previous Armature modifier,
armature parent, and matching deform groups should be replaced.

### 2.8 Hide Metarig
```python
metarig.hide_set(True)
```

---

## 3. Post-Rigging Weight Cleanup (MANDATORY)

After binding with auto-weights, ALWAYS run cleanup. Raw auto-weights are never good enough.

Preferred direct-tool flow:

1. Call `inspect_weight_paint_readiness` on the mesh and armature to confirm vertex groups, modifiers, and deform-readiness.
2. Call `normalize_vertex_group_weights` with a 4-influence limit, normalization, and tiny-weight pruning.
3. Call `inspect_rigging_data` again to verify the mesh still has the expected Armature modifier and vertex groups.

Only use `execute_code` for cleanup when the direct tool reports that a requested operation is outside
its supported surface.

---

## 4. Common Pitfalls & Troubleshooting

### "Bone Heat Weighting: Failed to find solution"
**Cause:** Bad mesh topology. Fix with:
1. `Merge by Distance` (remove duplicate vertices)
2. Fix non-manifold geometry (edges connecting 3+ faces)
3. Separate intersecting loose parts (`P → Separate by loose parts`)
4. Scale mesh + armature up 10x, apply weights, scale back down

### Rig Controls Extend Beyond Mesh
**Cause:** Uniform bounding-box scale on metarig, ignoring per-bone alignment.
**Fix:** Always do per-bone alignment (Section 2.4) after rough scale.

### Mesh Warps/Pinches at Joints
**Cause:** Insufficient geometry at deformation zones.
**Fix:** Add edge loops or subdivide mesh before rigging (Section 1.1).

### IK Limbs Bend Wrong Way
**Cause:** Perfectly straight joint chains — IK solver doesn't know which axis to fold.
**Fix:** Add slight bend to elbows (backward) and knees (forward) — Section 2.5.

---

## 5. Verification Checklist

After rigging, verify in Pose Mode:
- [ ] Select rig → enter Pose Mode (Ctrl+Tab)
- [ ] Rotate/move arm controls → mesh follows smoothly without pinching
- [ ] Rotate/move leg controls → knees bend correctly in one direction
- [ ] Move root control → entire character translates
- [ ] No mesh parts stay behind or warp unexpectedly
- [ ] Reset pose: Alt+R (rotation), Alt+G (location)
