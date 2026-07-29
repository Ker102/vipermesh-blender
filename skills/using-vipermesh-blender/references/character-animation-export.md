# Characters, Animation, And Export

## Character Work

Treat retopology, UVs, rig generation, binding, weight cleanup, and animation
readiness as separate concerns with explicit checks between them. A successful
operator call does not prove deformation quality or production readiness.

Select decimation, voxel remesh, QuadriFlow, or custom topology work according
to the source mesh and target use. Preserve a source revision before destructive
topology changes.

For rigging, verify scale, transforms, mesh integrity, armature alignment,
deform groups, weight normalization, and representative deformations. Automated
weights are a starting point whose adequacy depends on the mesh and motion.

## Animation

Inspect frame range, actions, constraints, drivers, root motion, and target rig
compatibility before editing. Retargeting and baking can be lossy, so keep a
recoverable source and validate representative poses or motion segments.

## Export

Choose format and options from the destination pipeline rather than a universal
preset. Before export, inspect:

- intended object and collection inclusion
- transforms and scale
- topology and normals
- UVs, materials, and texture dependencies
- armature, weights, actions, and animation range
- modifiers or constraints that must be applied or preserved

Validate the exported artifact when possible. A saved file is not sufficient
evidence that another application can consume it correctly.
