<a id="characters-animation-and-export"></a>
# 角色、动画和导出

<a id="character-work"></a>
## 角色工作

将重拓扑、UV、rig 生成、绑定、权重清理和动画就绪性视为独立关注点，并在它们之间进行明确检查。成功的 operator 调用并不能证明变形质量或生产就绪性。

根据源网格和目标用途选择 decimation、voxel remesh、QuadriFlow 或自定义拓扑工作。在破坏性拓扑变更前保留源修订。

对于 rigging，请验证比例、transform、网格完整性、armature 对齐、deform groups、权重归一化和代表性变形。自动权重是起点，其充分性取决于网格和动作。

<a id="animation"></a>
## 动画

编辑前检查帧范围、actions、constraints、drivers、root motion 和目标 rig 兼容性。Retargeting 和 baking 可能有损，因此请保留可恢复的源，并验证代表性 pose 或动作片段。

<a id="export"></a>
## 导出

根据目标 pipeline 选择格式和选项，而不是使用通用 preset。导出前，检查：

- 预期对象和 collection 包含情况
- transform 和 scale
- topology 和 normals
- UV、materials 和 texture dependencies
- armature、weights、actions 和 animation range
- 必须应用或保留的 modifiers 或 constraints

在可能时验证导出的工件。保存文件本身不足以证明另一个应用可以正确使用它。
