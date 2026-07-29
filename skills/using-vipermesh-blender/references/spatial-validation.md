# Spatial Validation

## Read World-Space State

Object origins and local dimensions are not reliable substitutes for evaluated
world-space bounds. Rotation, scale, parenting, modifiers, and evaluated
geometry can change the surfaces that matter.

When placement is consequential, inspect the relevant objects and reason from
their world-space bounds, attachment points, or actual surface hits.

## Express The Intended Relationship

Choose validation that matches the user's meaning:

- `supported_by` or `on_top_of` for physical support
- facing or orientation relations for functional direction
- clearance checks for required gaps
- containment checks for objects intended to be inside another object
- attachment-point alignment for parts that must meet precisely

Broad vertical ordering such as "above" does not prove contact. A clean camera
angle also does not prove that an object is grounded or non-intersecting.

## Use Recommendations, Not Fixed Layouts

Reasonable scale, spacing, and orientation depend on the asset, camera,
animation, target platform, and artistic intent. Use reference dimensions or
clearance ranges as starting evidence when useful, then adapt them.

After close placement, inspect from an angle that reveals depth and contact.
Repair floating, unintended penetration, reversed functional direction, and
support errors before final acceptance.
