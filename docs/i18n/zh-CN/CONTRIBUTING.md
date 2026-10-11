<a id="contributing"></a>
# 贡献指南

感谢你改进 ViperMesh for Blender。

<a id="development"></a>
## 开发

要求：

- Node.js 20 或更新版本
- Python 3.11 或更新版本
- Blender 5.2，用于实时兼容性检查

```bash
npm install
npm run check
```

通过 Blender 的 **Install from Disk** 工作流安装 `addon/vipermesh-addon.py`，启动本地桥接，并运行 `npm run mcp` 进行实时测试。

<a id="pull-requests"></a>
## Pull Request

- 保持变更聚焦，并说明用户可见的行为。
- 对协议和打包变更添加或更新一致性覆盖。
- 在一次性场景中测试 Blender 变更操作。
- 切勿提交凭据、私有资产目录、基准证据或专有 ViperMesh 产品代码。
- 保留 deterministic-tool-first 设计，并保持 `execute_code` 可用于尚未覆盖的自定义工作。

在可行时使用 Conventional Commit 风格的主题，例如 `feat(addon): add mesh validation`。

贡献即表示你同意你的贡献按 MIT License 授权。
