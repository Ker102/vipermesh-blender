export type McpCommandType =
  | "execute_code"
  | "get_scene_info"
  | "get_object_info"
  | "get_viewport_screenshot"
  | "get_local_asset_library_status"
  | "inspect_scene_grounding"
  | "inspect_spatial_relations"
  | "search_local_assets"
  | "import_local_asset"
  | "get_polyhaven_categories"
  | "search_polyhaven_assets"
  | "download_polyhaven_asset"
  | "set_texture"
  | "create_pbr_material_from_textures"
  | "prepare_uv_layout"
  | "validate_export_readiness"
  | "setup_studio_scene"
  | "validate_studio_scene"
  | "inspect_render_artifact"
  | "create_parametric_staircase"
  | "create_room_shell"
  | "create_wall_opening"
  | "create_mesh_from_data"
  | "create_draped_surface_mesh"
  | "validate_mesh_geometry"
  | "repair_mesh_geometry"
  | "decimate_mesh"
  | "voxel_remesh_mesh"
  | "quadriflow_remesh_mesh"
  | "inspect_edit_bone_alignment"
  | "set_edit_bone_alignment"
  | "inspect_shape_keys"
  | "extract_shape_key_to_object"
  | "create_shape_key_from_object"
  | "set_shape_key_properties"
  | "rename_shape_key"
  | "delete_shape_key"
  | "duplicate_shape_key"
  | "create_shape_key_from_mix"
  | "set_shape_key_value"
  | "create_rigify_metarig"
  | "generate_rigify_rig"
  | "bind_mesh_to_armature"
  | "transfer_vertex_group_weights"
  | "project_vertex_group_weights"
  | "search_sketchfab_models"
  | "download_sketchfab_model"
  | string

export interface McpCommand {
  id?: string
  type: McpCommandType
  params?: Record<string, unknown>
}

export interface McpResponse<T = unknown> {
  status?: "ok" | "success" | "error"
  result?: T
  message?: string
  raw?: unknown
}

export interface McpClientConfig {
  host: string
  port: number
  timeoutMs: number
}

/**
 * Response from get_viewport_screenshot MCP command.
 * Contains base64-encoded image data from Blender's viewport.
 */
export interface ViewportScreenshotResponse {
  /** Base64-encoded image data */
  image: string
  /** Image width in pixels */
  width: number
  /** Image height in pixels */
  height: number
  /** Image format */
  format: "png" | "jpeg"
  /** ISO timestamp when screenshot was captured */
  timestamp: string
}
