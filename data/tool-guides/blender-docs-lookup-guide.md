---
title: "Blender Docs Lookup Guide"
category: "documentation"
tags: ["blender api", "manual", "version verification", "execute_code", "toolification"]
triggered_by: ["search_blender_api_docs", "get_blender_api_doc", "search_blender_manual_docs"]
description: "Rules for using official Blender documentation lookup before version-sensitive Blender Python or tool guidance."
blender_version: "latest stable (verified 5.1.2)"
---

# Blender Docs Lookup Guide

Use official Blender docs lookup when exact API behavior matters. The lookup tools are guardrails before `execute_code`, not scene-editing tools themselves.

## Use API Lookup Before Python For

- `bpy.ops` operators and their context requirements
- node tree construction and socket names
- Principled BSDF, texture, normal map, and color-space setup
- UV unwrap, original UV preservation, and export/import operators
- mesh creation and validation APIs
- render engine IDs, EEVEE/Cycles settings, camera, and lighting properties
- removed, renamed, or changed Blender 5.x properties

## Tool Order

1. `search_blender_api_docs(query)` for symbols, operators, properties, and classes.
2. `get_blender_api_doc(path_or_url)` when an exact entry needs confirmation.
3. `search_blender_manual_docs(query)` for artist-facing workflows or UI concepts.
4. Only then use a deterministic tool or a scoped `execute_code` fallback.

## Citation Rule

When creating or updating reusable tool guidance, record the exact docs URL that informed the decision. Do not promote guidance based only on model memory.

## Failure Handling

If lookup fails, do not guess version-sensitive API names. Use a short introspection `execute_code` call only when the scene can safely tolerate it, such as checking `dir(obj.data)`, `hasattr(...)`, or available node sockets.
