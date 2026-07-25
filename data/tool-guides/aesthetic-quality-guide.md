---
title: "Aesthetic Quality & Stylistic Coherence Guide"
category: "scene-design"
tags: ["aesthetic", "quality", "style", "decorative", "detail", "execute_code", "procedural", "torch", "lantern", "ornament", "medieval", "modern", "furniture"]
description: "Principles for creating visually convincing, aesthetically rich 3D scenes. Prevents minimalistic primitive-based shortcuts and teaches the agent to match object detail to scene context while preferring direct tools before execute_code fallbacks."
blender_version: "5.0+"
---

# Aesthetic Quality & Stylistic Coherence Guide

## CORE PRINCIPLE: VISUAL CONVICTION OVER SPEED

When a user describes a scene, they expect objects that **look like the real thing**, not geometric approximations. A torch is not a cylinder with a sphere on top. A chair is not a cube with four sticks. Every object must be recognizable at first glance without needing the user to imagine what it's supposed to be.

**Rule:** If an object would not be recognizable in a photograph, it is not finished. Add more geometry until it reads correctly.

## ANTI-MINIMALISM RULES

### Never Substitute Primitives for Complex Objects
The following patterns are UNACCEPTABLE:

| Object | ❌ Wrong (Primitive) | ✅ Correct (Detailed) |
|---|---|---|
| Torch | Cylinder + sphere | Bracket + handle + irregular flame shape |
| Chair | Cube + 4 thin cubes | Seat + backrest + legs with slight taper |
| Tree | Cylinder + sphere/cone | Trunk with taper + branch structure + leaf volume |
| Lamp/Lantern | Cylinder + point light | Housing + glass panels + chain/mount + bulb |
| Sword | Thin cube | Blade (tapered) + crossguard + grip + pommel |
| Bookshelf | Cube with lines | Frame + individual shelves + books (varied sizes) |

### Minimum Geometry Budget Per Object
Every named object in the scene should have AT LEAST:
- **Decorative/props:** 3+ distinct mesh operations (not just a single primitive)
- **Furniture:** 4+ sub-components (e.g., legs, seat, back, armrests)
- **Architectural features:** Follow the Architectural Completeness Guide
- **Organic shapes:** Use subdivision + proportional editing, never raw primitives

### When to Use Direct Tools First

Use direct tools first for repeatable operations: transforms, materials, lighting, cameras, render settings, collection organization, parenting, modifiers, constraints, mesh validation, and viewport verification.

Use direct tools for the object parts they already cover:

1. `create_primitive_assembly` for grouped local-coordinate furniture, fixtures, props, panels, baskets, crates, brackets, handles, and repeated hard-surface parts.
2. `soften_mesh_edges` for bevels, rounded corners, weighted normals, and less primitive-looking hard-surface parts.
3. `create_draped_surface_mesh` for bounded sagging or wavy surfaces such as tarps, flags, canopies, awnings, cloth panels, terrain patches, and irregular panels.
4. `create_mesh_from_data` for known vertex/face surfaces and custom silhouette pieces not covered by the draped-surface helper.
5. `add_curve_object` for cables, vines, rails, straps, ropes, arcs, and tube-like strokes.

Use `execute_code` only when direct tools cannot express the required custom geometry, such as an object that:
1. Has **irregular or organic shapes** (flames, plants, terrain, fabric)
2. Requires **procedural deformation or generation** beyond direct assembly tools
3. Needs **vertex-level manipulation** (tapering, bending, sculpting)
4. Needs mesh operations not covered by `create_draped_surface_mesh`, `create_mesh_from_data`, `soften_mesh_edges`, or modifier tools
5. Involves custom shader nodes, procedural effects, simulation, or animation internals

**Rule:** If you catch yourself making a single `create_cube` or `create_cylinder` call for a decorative object, STOP and decompose it into a multi-part assembly. Use direct tools for the parts they cover, and use a focused `execute_code` fallback only for the custom geometry that remains.

## STYLISTIC COHERENCE

### Match Object Style to Scene Context
Every object in a scene must visually belong to the same world. The prompt's keywords define the style vocabulary:

| Prompt Keywords | Style Vocabulary | Material Palette |
|---|---|---|
| "medieval", "dungeon", "castle" | Rough stone, iron brackets, wood planks, rivets | Dark metals, weathered wood, rough stone |
| "modern", "apartment", "office" | Clean lines, smooth surfaces, chrome/glass | Polished metal, white/gray matte, glass |
| "sci-fi", "spaceship", "futuristic" | Panel lines, glowing accents, hexagonal patterns | Emissive strips, brushed aluminum, dark composites |
| "rustic", "cabin", "farmhouse" | Rough-hewn wood, hand-forged iron, woven fabric | Warm browns, muted greens, worn textures |
| "fantasy", "magical", "enchanted" | Organic curves, carved details, crystal/gem shapes | Glowing emissive, deep jewel tones, gold accents |

**Rule:** Before building ANY sub-object, ask: "Does this shape and material belong in the world described by the prompt?" A smooth chrome cylinder does NOT belong in a medieval dungeon.

### Contextual Material Selection
Materials must match the era and setting. Derive roughness and color from the **scene context**, not from defaults:
- **Aged/rustic settings:** Higher roughness (0.6–0.8), muted warm tones, metallic only on iron/steel
- **Modern/clean settings:** Lower roughness (0.05–0.3), neutral or cool tones, polished metals
- **Fantasy/magical:** Emissive accents, jewel tones, gold/copper metallics

**Rule:** Never use default gray or smooth chrome for objects in non-modern settings. Always set roughness and base color intentionally to match the scene's era.

## MULTI-COMPONENT ASSEMBLY PATTERN

### Generic Direct-Tool Pattern

When building ANY complex object, follow this pattern with direct tools first:

```text
1. Create context-appropriate materials first.
2. Use create_primitive_assembly for the structural body and named sub-parts.
3. Use create_draped_surface_mesh for bounded cloth, tarp, canopy, flag, terrain-patch, or irregular-panel surfaces.
4. Use create_mesh_from_data only for the parts that need custom vertices/faces beyond the draped-surface helper.
5. Use add_curve_object for ropes, straps, cables, vines, rails, or handle arcs.
6. Use soften_mesh_edges on hard-surface families so primitives do not look raw.
7. Run inspect_scene_grounding and inspect_spatial_relations before final render.
8. Use execute_code only for the remaining geometry or shader step that no direct tool covers.
```

### Key Techniques for Realistic Shapes

- **Tapered forms:** Use cone primitive parts where available, or a focused mesh-data/custom fallback when tapering is the only missing step.
- **Organic shapes:** Prefer assets for high-detail plants/foliage and use focused custom geometry only when an asset does not fit.
- **Repeated elements:** Use multiple named assembly parts for legs, slats, rungs, chain links, bricks, and panel details.
- **Edge softening:** Use `soften_mesh_edges` (small width, 2 segments, weighted normals) to avoid sharp CG edges.
- **Surface detail:** Use `create_draped_surface_mesh` for bounded sagging/wavy surfaces and `create_mesh_from_data` for other bounded custom surfaces; use `execute_code` only for subdivision/displacement workflows not covered by direct tools.

### Few-Shot: What "Multi-Part" Means in Practice
These are hints — adapt the decomposition to whatever object the prompt requires:
- **Light fixture** → mount/bracket + housing body + shade/glass + bulb/flame + point light
- **Seating** → legs (4, tapered) + seat surface (beveled) + back support + optional armrests
- **Weapon/tool** → blade/head (tapered) + guard/collar + grip (wrapped) + pommel/end cap
- **Container** → body (hollow or thick-walled) + rim/lip + handles + lid (if closed)

## QUALITY CHECKLIST

Before finishing any scene, verify:

1. **Silhouette test:** Would each object be identifiable from its silhouette alone?
2. **Style consistency:** Do all objects share the same era/aesthetic?
3. **Material variety:** Are there at least 3 distinct materials in the scene?
4. **No naked primitives:** Is every cube/cylinder/sphere part of a larger assembly?
5. **Light motivation:** Does every light source have a visible physical object (lamp, torch, window)?
6. **Scale plausibility:** Are objects proportioned correctly relative to each other?

## COMMON AESTHETIC FAILURES

1. ❌ Single cylinder as a "torch" — use multi-part assembly with bracket, handle, flame
2. ❌ Smooth metallic surface for medieval iron — use higher roughness (0.6-0.8)
3. ❌ Perfect geometric shapes for organic/rustic objects — add imperfection via displacement
4. ❌ Using only one material for everything — minimum 3 distinct materials per scene
5. ❌ Point lights with no visible source — every light needs a physical emitter object
6. ❌ Chrome/polished finishes in medieval/rustic scenes — match material to era
7. ❌ All furniture same height/size — vary proportions for visual interest
