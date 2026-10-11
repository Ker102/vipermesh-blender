<a id="portable-blender-mcp-gateway"></a>
# 便携 Blender MCP 网关

<a id="result-review-and-existing-scenes"></a>
## 结果审查和现有场景

生成图像的调用在 MCP 服务器文件系统中可用且大小不超过 3 MiB 时，会直接附加 PNG/JPEG。否则，请使用报告的工件路径通过图像查看器打开。`imageAttached` 标志表示传输可用性；`visualReviewRequired` 表示代理必须根据任务判断实际输出。图像文件健康状态和成功命令不是视觉质量评分。

阶段 helper 是可选的便捷操作。在 finalize 上设置 `preservePresentation:
true` 可保留当前相机、灯光和构图。`blendPath` 是可选的；省略它可在不保存 blend 文件的情况下渲染。通过 finalize 保存会拒绝已有目标。只有在意图覆盖且已获授权时，才使用独立保存。显式 `spatialRelations` 会在 finalize 时重新检查，失败的关系会阻止最终输出。诊断检查不能证明任意网格接触；请从能揭示问题的视角检查可疑区域。

便携网关让受信任的编码代理可以通过标准 MCP stdio 传输调用 ViperMesh Blender 工具，包括用于在本地测试期间测量回退行为的 `execute_code`。

它是受信任的本地连接器。已认证云服务和商业权益仍在公开插件和 MCP 包之外。

<a id="execution-paths"></a>
## 执行路径

便携网关是附加式的：

```text
External coding agent
  -> ViperMesh MCP stdio server
  -> process-lifetime serialized TCP client
  -> Blender addon at 127.0.0.1:9876
```

MCP 服务器会在进程生命周期内保留其 Blender socket，而不是每次工具调用后重新连接。

<a id="requirements"></a>
## 要求

- Node.js 和此仓库已安装的依赖。
- Blender 正在运行，已安装 ViperMesh 插件并启动其本地服务器。
- 插件可通过 `127.0.0.1:9876` 访问，除非用 `BLENDER_MCP_HOST` 和 `BLENDER_MCP_PORT` 覆盖。
本地签入的 tool-skill 搜索无需数据库或 embedding 凭据即可工作。

<a id="start-the-gateway"></a>
## 启动网关

从仓库根目录运行：

```bash
npm run mcp
```

该进程使用 MCP JSON-RPC 通过 stdin/stdout 通信。启动诊断会写入 stderr。

<a id="coding-agent-configuration"></a>
## 编码代理配置

使用绝对仓库路径指向构建后的入口点：

```json
{
  "mcpServers": {
    "vipermesh-blender": {
      "command": "node",
      "args": [
        "C:/absolute/path/to/vipermesh-blender/dist/public-portable-blender-mcp.js"
      ]
    }
  }
}
```

具体配置位置取决于编码代理。如果客户端不会动态重新加载 MCP 服务器，请在注册服务器后重启或打开新的代理会话。请参阅 [MCP 客户端设置](client-setup.md)，了解 Codex 和客户端兼容性细节。

<a id="available-mcp-tools"></a>
## 可用 MCP 工具

- `check_blender_connection`
- `bootstrap_vipermesh_session`
- `list_blender_tools`
- `call_blender_tool`
- `call_blender_tool_batch`
- `run_blender_scene_stage`
- `get_blender_agent_context`
- `search_3d_guidance`
- `get_3d_guidance_document`

`call_blender_tool` 只接受 ViperMesh 工具注册表中存在的命令。不同于面向生产的表面，此受信任本地网关会暴露 `execute_code`，以便测试能揭示代理仍在何处回退到自由形式 Blender Python。

示例请求：

```json
{
  "name": "get_scene_info",
  "params": {}
}
```

使用 `list_blender_tools` 检查可用命令及其参数说明。

`call_blender_tool_batch` 最多接受 32 个有序命令，默认在第一个失败响应后停止。将它用于已经决定的一组操作，例如创建多个 primitive 或应用多个独立材质赋值。不要跨越需要根据检查、落地或视觉反馈决定下一步的节点进行批处理。

`run_blender_scene_stage` 在同一持久 socket 上提供附加式紧凑工作流：

- `build` 运行有界的调用方提供构建批次。
- `inspect_preview` 检查落地情况和可选具名空间关系，取景并渲染轻量预览，然后检查工件。
- `finalize` 设置并验证展示相机，然后只在验证通过时渲染并保存。

请分别调用各阶段。代理必须在 `inspect_preview` 和 `finalize` 之间检查预览，并可使用任何独立 Blender 工具进行修复，然后重复检查。阶段响应有意返回紧凑的状态、计数和工件字段，而不是完整 Blender payload，以减少上下文和 token 开销。独立调用和通用批量调用仍然可用。

服务器保持一个 lazy Blender 连接打开，并通过它串行化所有单次和批量调用。如果 Blender 关闭 socket，客户端会在下一次调用时重新连接。MCP 宿主应在每个代理会话中启动一次 `npm run mcp`，而不是每个工具启动一次。

<a id="agent-context"></a>
## 代理上下文

`bootstrap_vipermesh_session` 是陌生代理的必需首次调用。它会检查 Blender，返回紧凑操作上下文，识别持久会话模型，并推荐后续调用。

`get_blender_agent_context` 返回用于检查、指导检索、直接工具优先、有界批处理、`execute_code` 回退、落地和视觉验收的公开紧凑操作规则。私有 ViperMesh 产品提示和编排不会由此连接器分发。

任意 MCP 代理应在会话开始时加载一个 profile，针对具体任务查询 `search_3d_guidance`，并只针对相关能力类别或搜索词使用 `list_blender_tools`。例如，重拓扑工作应先检索签入的 remesh 和 topology 指导，再在 decimation、voxel remesh、QuadriFlow 或自定义回退代码之间选择。

<a id="guidance-retrieval"></a>
## 指导检索

`search_3d_guidance` 支持：

- `source: "local"`，对 `skills/using-vipermesh-blender/references` 中的公开代理技能参考进行确定性搜索；
- `source: "semantic"`，用于已配置的私有 ViperMesh semantic adapter；
- `source: "all"`，组合两者。

Semantic retrieval 是可选的私有产品 adapter。公开连接器提供确定性的本地 tool-skill 检索，不需要数据库或 embedding 凭据。

`get_3d_guidance_document` 会从 `skills/using-vipermesh-blender/references` 读取 Markdown basename。任意文件系统路径和 traversal 都会被拒绝。

技能参考描述能力、取舍和验证模式。它们是建议，不是通用场景配方。私有 ViperMesh RAG 语料库不会在公开连接器中分发。

<a id="security-boundary"></a>
## 安全边界

此本地网关用于受信任的工作站。

- 它使用 stdio，且不打开额外网络监听器。
- Blender 插件应保持绑定到 loopback。
- 它暴露自由形式 Python 执行，用于受信任的本地回退测试。
- 它不强制订阅，也不保护本地插件实现。

未来的生产版本应使用已认证的远程 ViperMesh 控制平面，用于 premium orchestration、private guidance、provider access 和 signed action plans。仅靠本地身份验证无法让运行在用户控制机器上的软件防篡改。
