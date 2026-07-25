---
title: "Export & File Format Guide"
category: "export"
tags: ["export", "GLB", "GLTF", "FBX", "OBJ", "STL", "file format", "3D printing", "game engine", "web", "UV", "cleanup", "texture dependencies", "missing image paths", "prepare_uv_layout", "validate_export_readiness", "inspect_export_cleanup_candidates", "inspect_export_texture_dependencies", "export_asset_package", "export_object"]
triggered_by: ["prepare_uv_layout", "validate_export_readiness", "inspect_export_cleanup_candidates", "inspect_export_texture_dependencies", "export_asset_package", "export_object"]
description: "Domain knowledge for 3D model export, file format selection, pre-export preparation, and format-specific considerations."
blender_version: "4.0+"
---

# Export & File Format Guide

## FORMAT SELECTION

| Format | Extension | Best For | Materials | Animation | Notes |
|---|---|---|---|---|---|
| **GLB** | `.glb` | Web, AR/VR, Three.js | ✅ PBR | ✅ | **Default choice** — single binary file, widely supported |
| GLTF | `.gltf` | Web (separate files) | ✅ PBR | ✅ | Same as GLB but textures as separate files |
| FBX | `.fbx` | Game engines (Unity, Unreal) | ✅ | ✅ | Industry standard for game dev |
| OBJ | `.obj` | Legacy compatibility | ⚠️ Basic | ❌ | Oldest format, universally supported |
| STL | `.stl` | 3D printing | ❌ No | ❌ | Mesh-only, no colors or materials |

### Quick Decision Guide
- **Web/online viewer?** → GLB
- **Unity/Unreal?** → FBX
- **3D printing?** → STL
- **Simple mesh exchange?** → OBJ
- **Not sure?** → GLB (most versatile)

## PRE-EXPORT CHECKLIST

### Always Do Before Export
1. **Apply transforms** (`apply_transforms`) — Resets scale/rotation to identity, prevents distorted models
2. **Apply all modifiers** (if you want clean geometry) — SubSurf, mirrors, booleans become permanent
3. **Set correct origin** — Usually center of geometry or bottom center for grounding
4. **Inspect cleanup candidates** (`inspect_export_cleanup_candidates`) — Find helper empties, reference objects, hidden construction geometry, and protected modifier/constraint targets before cleanup
5. **Validate export readiness** (`validate_export_readiness`) — Catches missing UVs, invalid mesh data, missing textures, unapplied transforms, and format/path issues before export

### UV Policy
- Imported assets: call `prepare_uv_layout` with `mode: "preserve_original"` first. Do not overwrite original UVs unless the user asks or validation reports no usable UVs.
- Generated or procedural meshes without UVs: call `prepare_uv_layout` with `mode: "smart_project"` before applying image textures or exporting GLB/FBX/OBJ.
- Existing UVs that only need cleaner packing: use `mode: "pack_existing"`.
- Bake/lightmap workflows: use `mode: "lightmap_pack"` with a named UV map.
- Treat partial UVs, degenerate UV islands, and UV bounds far outside 0-1 as export-readiness problems. Run `validate_export_readiness` after any UV prep before exporting.

### Texture Portability Policy
- For portable GLB/FBX/OBJ delivery, prefer PNG or JPEG image textures.
- Use `inspect_export_texture_dependencies` before repair work when a model has missing textures, white materials, empty image paths, packed images, or risky image formats. It gives the exact material/node/image dependency list without mutating the scene.
- If `validate_export_readiness` or `inspect_export_texture_dependencies` reports WebP, AVIF, HEIC, PSD, TIFF, missing image paths, empty image paths, or unpacked sidecar risks, fix those before export when the asset needs to work in browsers, game engines, or external viewers.
- Packed images are acceptable for Blender-internal work, but exported interchange assets should still be validated in the target viewer.

### Recommended Tool Sequence
Use `export_asset_package` for normal user-requested exports. It runs UV prep, optional rotation/scale application, readiness validation, export, and expected-file reporting in one deterministic flow:

```text
export_asset_package(
  names=["HeroMesh"],
  filepath="C:/exports/hero.glb",
  file_format="GLB",
  uv_mode="preserve_original",
  apply_transforms=true
)
```

Use the lower-level sequence only when a validation report needs manual repair:

1. `prepare_uv_layout(names, mode: "preserve_original")`
2. If missing UVs on a generated mesh, `prepare_uv_layout(names, mode: "smart_project")`
3. `inspect_export_cleanup_candidates(names, action: "report")` before deleting, hiding, or moving helpers
4. `inspect_export_texture_dependencies(names, file_format)` when texture portability is uncertain
5. `validate_export_readiness(names, filepath, file_format)`
6. Fix reported errors
7. `export_object(names, filepath, file_format)`

### Format-Specific Prep
- **GLB/GLTF:** Ensure materials use Principled BSDF (auto-converts to PBR)
- **FBX:** Apply scale — FBX uses centimeters by default, Blender uses meters
- **STL:** Make sure mesh is watertight (no holes) for 3D printing
- **OBJ:** Materials export as separate .mtl file — keep files together

## SCALE CONSIDERATIONS

| Scenario | Scale Factor | Notes |
|---|---|---|
| Blender → Web (Three.js) | 1.0 (no change) | GLB preserves Blender units |
| Blender → Unity | 1.0 | Unity reads FBX scale correctly |
| Blender → Unreal | 100× | Unreal uses centimeters |
| Blender → 3D Print (mm) | 1000× | Blender meters → millimeters |

## PATH HANDLING

- Use **absolute paths**: `/tmp/model.glb`, `C:/tmp/export.fbx`
- Include the file extension in the path — it determines the format
- The tool creates parent directories if needed
- Existing files at the same path are overwritten

## MATERIAL COMPATIBILITY

| Material Feature | GLB | FBX | OBJ | STL |
|---|---|---|---|---|
| Base Color | ✅ | ✅ | ✅ | ❌ |
| Metallic/Roughness | ✅ | ✅ | ❌ | ❌ |
| Normal Maps | ✅ | ✅ | ⚠️ | ❌ |
| Emission | ✅ | ✅ | ❌ | ❌ |
| Transparency | ✅ | ✅ | ⚠️ | ❌ |

## COMMON MISTAKES TO AVOID

1. ❌ Exporting without applying transforms — causes scale/rotation issues in target application
2. ❌ Using STL when materials are needed — STL is mesh-only
3. ❌ Forgetting file extension in path — the tool uses file_format param or extension to determine format
4. ❌ Exporting unapplied modifiers — geometry won't match what you see in viewport
5. ❌ Using OBJ for PBR materials — OBJ only supports basic diffuse/specular, use GLB instead
