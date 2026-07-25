---
title: "Multi-Part Object Assembly Guide"
category: "object-assembly"
tags: ["assembly", "compound", "multi-part", "parent", "attach", "connect", "hierarchy", "empty", "root-control", "locator", "pole", "arm", "joint", "furniture", "vehicle", "building", "array", "pattern", "grid", "radial", "local-coordinate", "local-handedness", "add_empty_object", "set_empty_properties", "parent_set", "set_object_transform", "arrange_objects", "duplicate_object_pattern", "create_primitive_assembly"]
triggered_by: ["add_empty_object", "set_empty_properties", "parent_set", "set_object_transform", "arrange_objects", "duplicate_object_pattern", "create_primitive_assembly"]
description: "Domain knowledge for building compound objects from primitives. Covers connection point calculation, parent-child assembly, flush attachment, and common archetypes like furniture, street infrastructure, and architectural elements."
blender_version: "4.0+"
---

# Multi-Part Object Assembly Guide

## CRITICAL RULES

1. **Build bottom-up.** Start with the base/foundation piece and calculate each subsequent piece's position relative to the piece it connects to. Never guess attachment points.

2. **Calculate connection points, don't hardcode.** Use `base_z + base_height/2` to find the top of a base, then place the next piece starting there. This works regardless of where the base was placed.

3. **Use parenting for compound objects that move together.** Parent all parts to a root Empty so the entire assembly can be moved/rotated as one unit.

## ASSEMBLY STRATEGY

### Step-by-Step Assembly Process
When building any compound object from primitives:

1. **Identify the structural hierarchy** — Which part is the base? What attaches to what?
2. **Create the base part first** — Position it at the intended world location
3. **Calculate each attachment point** — Use the base part's position + half its dimensions
4. **Create child parts at calculated positions** — Each child's position derives from its parent geometry
5. **Optionally parent all parts** — Group under an Empty for unified control

## DIRECT PATTERN TOOLS

Use `create_primitive_assembly`, `arrange_objects`, and `duplicate_object_pattern` before `execute_code` for repeated objects, scene dressing, local-coordinate part families, and symmetrical layouts. These tools cover the common Python-loop cases:

- L-brackets, fixture plates, simple furniture, object families, and rotated assemblies with preserved local handedness
- bar stools in front of a counter
- columns, fence posts, books, lamps, table legs, wheels, bolts, and tiles
- product objects evenly spaced on a pedestal
- plants/rocks/props distributed in a row or grid
- circular/radial displays around a centerpiece

### Create A Local-Coordinate Primitive Assembly

Use `create_primitive_assembly` when a compound object can be described as bounded cube/sphere/cylinder/cone/plane/torus parts in a shared local coordinate frame. This is the direct-tool replacement for generated Python that creates many primitive children, transforms them through a root rotation, and parents them to a root Empty.

```text
create_primitive_assembly(
  name="Bracket_Rz90",
  location=[1.2, 0, 0],
  rotation=[0, 0, -90],
  parts=[
    { primitive_type="cube", name="Bracket_Plate", local_location=[0,0,0.7], scale=[1.0,0.2,1.4], size=1 },
    { primitive_type="cube", name="Bracket_Foot", local_location=[0.55,0,0.09], scale=[1.1,0.55,0.18], size=1 },
    { primitive_type="cylinder", name="Bracket_Bolt_A", local_location=[-0.32,-0.14,0.48], local_rotation=[90,0,0], radius=0.08, depth=0.08 }
  ],
  create_root_empty=true
)
```

Use `local_location` for each part center before the root rotation is applied. Use `local_rotation` for part orientation in the assembly frame, such as rotating cylinder depth onto a local face. After creation, run `inspect_scene_grounding` and `inspect_spatial_relations` to verify contact and handedness.

### Arrange Existing Objects

Use this when all objects already exist and only need clean spacing:

```text
arrange_objects(
  names=["Ball_Red", "Ball_Green", "Ball_Blue"],
  layout="CIRCLE",
  center=[0, 0, 0.25],
  radius=0.9,
  plane="XY",
  align_bottom_to_z=0.1
)
```

`align_bottom_to_z` grounds every arranged object by its bounding-box bottom. Use it for objects sitting on a shared plane such as a pedestal top, floor, shelf, or table.

### Duplicate Into A Pattern

Use this when one source object should become many repeated parts:

```text
duplicate_object_pattern(
  name="Stool",
  count=3,
  layout="LINE",
  name_prefix="Counter_Stool",
  spacing=0.75,
  axis="X",
  center=[0, 1.2, 0],
  include_source=true,
  align_bottom_to_z=0
)
```

Prefer `linked=true` for lightweight repeated mesh instances when the duplicates should share geometry. Use `linked=false` when later edits may make the copies unique.

Do not write generated Python loops for simple rows, grids, or radial duplication. Use focused `execute_code` only when the pattern must follow a custom curve, irregular terrain, or semantic per-item variation that these direct tools cannot express.

### Connection Point Formulas

**Top of a vertical piece (pole, leg, column):**
```
top_z = pole.location.z + (pole_height / 2)
```

**Bottom attachment (seat on legs, shelf on brackets):**
```
seat_z = leg_top_z + (seat_thickness / 2)
```

**Side attachment (arm from pole, sign from post):**
```
arm_x = pole.location.x + (pole_radius) + (arm_length / 2)
arm_z = pole_top_z  # or a specific fraction of pole height
```

**End of a horizontal arm:**
```
end_x = arm.location.x + (arm_length / 2)
end_z = arm.location.z
```

## COMMON ARCHETYPES

### Archetype 1: Street Lamp (Pole + Arm + Head + Base)

```
Structure:   Base ← Pole ← Arm ← Head
              │        │       │       └── Light source location
              │        │       └── Horizontal, attached at pole top
              │        └── Vertical, standing on base
              └── Wide flat disc on ground
```

**Position calculations:**
```python
pole_height = 3.5
pole_radius = 0.05
arm_length = 0.5
arm_radius = 0.03
base_loc = (-1.5, 0, 0)

# Base: flat disc on ground
base_z = base_loc[2] + 0.025  # half of base depth

# Pole: centered on base, extends upward
pole_z = base_loc[2] + pole_height / 2

# Arm: horizontal, attached at pole top
arm_x = base_loc[0] + arm_length / 2  # extends from pole center
arm_z = base_loc[2] + pole_height      # at pole top

# Head: at END of arm, not offset from pole
head_x = base_loc[0] + arm_length      # at arm tip
head_z = arm_z                          # same height as arm
```

**Common mistake:** Placing the head offset from the *pole*, not from the *arm tip*. The head connects to the arm's end, not the pole.

### Archetype 2: Park Bench (Seat + Backrest + Legs)

```
Structure:   Legs ← Seat ← Backrest
              │        │       └── Angled panel, FLUSH against seat back edge
              │        └── Flat board, sits on top of legs
              └── 4 vertical posts, bottom at Z=0
```

**Position calculations:**
```python
seat_height = 0.45   # real-world bench seat height
seat_width = 1.5
seat_depth = 0.5
seat_thickness = 0.05
backrest_height = 0.4
backrest_thickness = 0.05
backrest_angle = -15  # degrees, tilted back
leg_thickness = 0.05

# Legs: bottom at Z=0, top at seat bottom
leg_height = seat_height - seat_thickness / 2
leg_z = leg_height / 2  # center origin

# Seat: sits on top of legs
seat_z = seat_height  # center of seat thickness at seat_height

# Backrest: FLUSH AGAINST the seat's back edge
# The backrest bottom should touch the seat top
import math
theta = math.radians(abs(backrest_angle))

# When rotated, the bottom edge shifts. Compensate:
backrest_center_z = seat_z + (seat_thickness / 2) + (backrest_height / 2) * math.cos(theta)
backrest_y = (seat_depth / 2) - (backrest_thickness / 2)  # at back edge of seat

# The backrest's location.y needs to account for rotation shifting it
backrest_y_shift = (backrest_height / 2) * math.sin(theta)
backrest_y_final = backrest_y + backrest_y_shift
```

**Common mistake:** Setting backrest location without accounting for rotation. A -15° tilt on X shifts the bottom edge upward and forward.

### Archetype 3: Table (Top + Legs)

```
Structure:   Legs ← Table Top
              └── 4 vertical posts at corners
```

**Position calculations:**
```python
table_height = 0.75  # standard dining table
top_thickness = 0.04
top_width = 1.2
top_depth = 0.75

# Table top
top_z = table_height  # center of thickness

# Legs: inset from corners
leg_height = table_height - top_thickness / 2
leg_z = leg_height / 2
inset = 0.05  # legs slightly inside table edge

corners = [
    (-top_width/2 + inset, -top_depth/2 + inset),
    ( top_width/2 - inset, -top_depth/2 + inset),
    (-top_width/2 + inset,  top_depth/2 - inset),
    ( top_width/2 - inset,  top_depth/2 - inset),
]
```

### Archetype 4: Bookshelf / Shelving Unit

```
Structure:   Side Panels ← Shelves ← Back Panel (optional)
```

**Evenly spaced shelves:**
```python
shelf_count = 4
unit_height = 1.8
shelf_thickness = 0.02
usable_height = unit_height - shelf_thickness  # subtract top/bottom

spacing = usable_height / (shelf_count - 1)
for i in range(shelf_count):
    shelf_z = shelf_thickness / 2 + i * spacing
```

### Archetype 5: Vehicle (Body + Wheels)

```
Structure:   Body ← Wheels (4)
```

**Wheel placement:**
```python
body_width = 1.8
body_length = 4.0
wheelbase = body_length * 0.7  # 70% of body length
track = body_width  # wheels at body edges
wheel_radius = 0.3

# Wheels sit on ground, center at wheel_radius height
wheel_z = wheel_radius
wheel_positions = [
    (-wheelbase/2, -track/2, wheel_z),  # front-left
    (-wheelbase/2,  track/2, wheel_z),  # front-right
    ( wheelbase/2, -track/2, wheel_z),  # rear-left
    ( wheelbase/2,  track/2, wheel_z),  # rear-right
]
```

## PARENTING FOR ASSEMBLIES

### When to Parent
- **Always parent** when the object should move/rotate as one unit
- **Use an Empty as root** for easy manipulation of the whole assembly
- **Prefer direct tools**: use `add_empty_object` for root controls, `parent_set` for parent-child links, and `organize_collection_hierarchy` when grouping, collection movement, parenting, and visibility changes belong in one batch

`parent_set` and `organize_collection_hierarchy` preserve world transforms so child objects do not visually jump when parented. Use `add_empty_object` for the root helper instead of generated Python.

### Root Empty Controls

Create a non-rendered root control before parenting compound object parts:

```text
add_empty_object(name="Lamp_Root", location=[-1.5, 0, 0], display_type="CUBE", display_size=0.35)
parent_set(parent_name="Lamp_Root", child_name="Lamp_Base")
parent_set(parent_name="Lamp_Root", child_name="Lamp_Pole")
parent_set(parent_name="Lamp_Root", child_name="Lamp_Arm")
```

An Empty is a transform handle, not visible geometry. Do not use it for renderable pieces; use it so `set_object_transform(name="Lamp_Root", ...)` moves the whole assembly safely. If the handle is hard to see or too large, adjust it with `set_empty_properties(name="Lamp_Root", display_type="SPHERE", display_size=0.5, show_in_front=true)`.

### Using parent_set MCP Tool
```
parent_set(parent="Lamp_Root", child="Lamp_Pole", keep_transform=true)
```

## VERIFICATION CHECKLIST

After assembling a compound object, verify:

1. ☐ **No floating parts** — Every part touches or connects to its neighbor
2. ☐ **Bottom at Z=0** — The base of the assembly sits on the ground plane
3. ☐ **Proportions match reality** — Compare dimensions to reference table
4. ☐ **Rotated parts are compensated** — Angled pieces have position offsets applied
5. ☐ **Use `get_viewport_screenshot`** — Visual check catches issues formulas might miss

## COMMON MISTAKES TO AVOID

1. ❌ **Placing child parts relative to world origin instead of parent geometry** — Arm position must derive from pole top, not from (0,0,0)
2. ❌ **Connecting to the wrong point of a rotated piece** — A rotated arm's endpoint is NOT at `arm.location.x + arm_length/2` — use `matrix_world @ Vector(local_point)` to find the real endpoint
3. ❌ **Forgetting that cylinder depth is FULL height, not half** — A `depth=3.5` cylinder extends 1.75m above and below its origin
4. ❌ **Not accounting for object radius in side attachments** — An arm touching a pole must offset by `pole_radius + arm_radius`, not just `arm_length/2`
5. ❌ **Hardcoding heights instead of calculating from connected parts** — If you change the pole height later, all attachment points break
6. ❌ **Hand-writing parenting logic when direct tools cover it** — Use `parent_set` or `organize_collection_hierarchy` so world transforms are preserved and child objects do not visually jump
7. ❌ **Building top-down** — Always start from the ground up to prevent accumulated positioning errors
