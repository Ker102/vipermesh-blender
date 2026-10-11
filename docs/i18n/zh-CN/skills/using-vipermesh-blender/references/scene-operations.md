<a id="scene-operations"></a>
# 场景操作

<a id="choose-the-smallest-useful-surface"></a>
## 选择最小的有用表面

- 修改现有场景前先检查。
- 围绕当前任务搜索或过滤注册表。
- 当具名确定性操作匹配请求的变更时，优先使用它。
- 当自定义 Blender 逻辑明显比组合可用工具更清晰或更有能力时，使用 `execute_code`。

<a id="group-calls-deliberately"></a>
## 有意识地组合调用

`call_blender_tool_batch` 适用于独立或已决定的操作，例如创建已知 blockout 或应用若干已知 transform。当下一步取决于尺寸、接触、拓扑、viewport 反馈或渲染时，请保持调用分离。

`run_blender_scene_stage` 可以压缩常见的构建、预览和 finalize 工作。其阶段仍是可选的，并且可能配置相机和灯光。在 finalize 上设置 `preservePresentation: true` 以保留活动展示。独立工具适合目标明确的修复，以及不适合分阶段形态的工作流。

<a id="preserve-user-work"></a>
## 保留用户工作

将现有对象、collections、modifiers、materials、animation 和 file paths 视为用户拥有的状态。优先使用可逆编辑；当恢复代价较高时，在破坏性操作前复制或保存一个修订。

当后续操作依赖身份时，使用描述性对象和 collection 名称。不要仅为了让场景匹配某个偏好的层级而重组场景。

<a id="finish-with-evidence"></a>
## 用证据完成

报告完成前，确认请求的对象和变更存在，并检查高风险结构关系。只有在用户请求时才保存 blend 文件，并使用其批准的目标。对于仅渲染工作，省略 `blendPath`；检查和导出工作流可以使用独立工具，而不保存或覆盖 blend 文件。在声称准备就绪前，生成并检查请求的视觉或导出工件。
