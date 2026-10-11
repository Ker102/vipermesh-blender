---
name: using-vipermesh-blender
description: 通过持久 ViperMesh MCP 连接器操作 Blender。用于场景检查、结构化 Blender 编辑、验证、渲染、绑定、动画、重拓扑、资产和导出。
---

<a id="using-vipermesh-for-blender"></a>
# 使用 ViperMesh For Blender

在完整代理会话中使用一个 MCP 服务器进程。MCP 客户端应启动服务器；不要为单个 Blender 操作启动 `npm`、`npx`、`tsx` 或另一个服务器进程。

<a id="start-a-session"></a>
## 启动会话

1. 调用 `bootstrap_vipermesh_session`。
2. 在修改前检查现有场景状态。
3. 当任务语义或不熟悉的操作需要澄清时，使用 `search_3d_guidance`。
4. 使用带有相关类别或搜索词的 `list_blender_tools`，而不是加载完整注册表。

当确定性工具能表达预期操作时，优先使用它们。保留 `execute_code`，用于自定义几何、程序化效果、非常规节点图，以及结构化工具覆盖不佳的其他工作。

只有在输入已知且没有中间结果会改变下一步决策时，才批处理操作。在有意义的阶段之间保留检查和修复节点。

完成前，检查请求的输出并验证此任务中重要的关系。成功的工具调用或健康的图像文件不是质量结论。报告未解决缺陷。只将请求的工件保存到已批准路径；当某个阶段会替换艺术家的相机、灯光或构图时，请选择独立工具。

<a id="references"></a>
## 参考

- 场景变更和生命周期：[references/scene-operations.md](references/scene-operations.md)
- 接触、朝向和间隙：[references/spatial-validation.md](references/spatial-validation.md)
- 相机、灯光、预览和验收：[references/visual-presentation.md](references/visual-presentation.md)
- 几何、材质和资产：[references/geometry-materials-assets.md](references/geometry-materials-assets.md)
- 角色、动画和导出：[references/character-animation-export.md](references/character-animation-export.md)

这些参考提供有用模式和检查，而不是强制配方。请根据用户目标、当前场景、活动渲染引擎和可用证据进行调整。
