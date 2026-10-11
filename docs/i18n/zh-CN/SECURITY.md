<a id="security-policy"></a>
# 安全政策

<a id="supported-versions"></a>
## 支持的版本

安全修复会提供给最新发布版本。

<a id="reporting"></a>
## 报告

不要为漏洞创建公开 issue。请使用仓库 Security 标签页中的 GitHub 私有 **Report a vulnerability** 流程。

请包含受影响版本、复现步骤、影响以及任何建议的缓解措施。请在披露前给维护者留出调查时间。

<a id="trust-boundary"></a>
## 信任边界

ViperMesh for Blender 是一个受信任的本地工作站连接器：

- 插件默认绑定到 `127.0.0.1`。
- MCP 服务器通过 stdio 与客户端通信。
- `execute_code` 可以在 Blender 内部运行任意 Python。
- 连接器不提供远程身份验证边界。

只连接受信任的 MCP 客户端。不要把 Blender 桥接端口暴露到 LAN 或公共互联网，也不要在未经审查的情况下使用该连接器打开不受信任的 `.blend` 文件或执行不受信任的提示。
