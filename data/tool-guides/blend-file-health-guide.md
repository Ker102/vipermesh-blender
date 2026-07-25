---
title: "Blend File Health Inspection Guide"
category: "inspection"
tags: ["blend file", "health", "missing files", "linked libraries", "packed assets", "orphan data", "datablocks", "usage guess", "path info", "inspect_blend_file_health", "get_blendfile_summary_path_info", "get_blendfile_summary_datablocks", "get_blendfile_summary_missing_files", "get_blendfile_summary_of_linked_libraries", "get_blendfile_summary_usage_guess"]
triggered_by: ["inspect_blend_file_health", "get_blendfile_summary_path_info", "get_blendfile_summary_datablocks", "get_blendfile_summary_missing_files", "get_blendfile_summary_of_linked_libraries", "get_blendfile_summary_usage_guess"]
description: "Guidance for using the non-mutating .blend file health summary before diagnosing missing assets, broken links, package/export issues, or large-scene problems."
blender_version: "latest stable (verified 5.1.2)"
---

# Blend File Health Inspection Guide

Use `inspect_blend_file_health` before writing Python when the user reports:

- missing textures, white materials, broken image maps, or missing linked assets,
- imported files that behave differently after reload/export,
- large scenes that are slow or hard for the agent to reason about,
- packaging/export problems where external files may not be available.

Use focused summaries when the question is narrow:

- `get_blendfile_summary_path_info` for saved path, directory, and dirty-state questions.
- `get_blendfile_summary_datablocks` for object/material/image/action/orphan counts.
- `get_blendfile_summary_missing_files` for missing texture, font, sound, movie, or library files.
- `get_blendfile_summary_of_linked_libraries` for linked `.blend` library path/existence checks.
- `get_blendfile_summary_usage_guess` when deciding whether a file looks like a rig, animation, render scene, textured asset, or large scene before choosing the next tool.

## Reading the Result

- `status: "healthy"` means no high-signal file health issue was found.
- `status: "warning"` usually means the file is unsaved, very large, or has orphaned datablocks.
- `status: "error"` usually means at least one external file or linked library is missing.

Treat missing external files as a file/package problem first. Do not try to repaint or rebuild materials until the missing path is understood.

## Recommended Flow

1. Call the narrowest summary that answers the question, or `inspect_blend_file_health` for a full report.
2. If `missing_external_files` is non-empty, report the missing paths and ask for a relink/reupload/package fix.
3. If linked libraries are missing, do not attempt destructive cleanup. Explain which library path is unavailable.
4. If orphan counts are high, mention cleanup as optional. Do not purge orphan data unless the user explicitly asks.
5. If the scene is large, use `get_all_object_info` with pagination or inspect specific collections/objects rather than loading everything at once.

## What Not To Do

- Do not use `execute_code` just to count missing files or libraries.
- Do not hard-delete orphaned datablocks automatically.
- Do not assume packed images are missing. Packed assets are embedded in the `.blend`.
