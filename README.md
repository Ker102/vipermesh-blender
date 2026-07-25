# ViperMesh for Blender

[![CI](https://github.com/Ker102/vipermesh-blender/actions/workflows/ci.yml/badge.svg)](https://github.com/Ker102/vipermesh-blender/actions/workflows/ci.yml)
[![GitHub release](https://img.shields.io/github/v/release/Ker102/vipermesh-blender?display_name=tag)](https://github.com/Ker102/vipermesh-blender/releases)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![MCP](https://img.shields.io/badge/Model_Context_Protocol-server-1f6feb)](https://modelcontextprotocol.io/)

**A persistent Model Context Protocol server and deterministic Blender addon
for AI agents.**

ViperMesh for Blender gives MCP-compatible agents structured scene inspection,
reusable Blender operations, bounded batches, local 3D workflow guidance, and
an explicit Python fallback. It is designed to reduce repeated Blender API
code without preventing genuinely custom geometry or scene work.

## Why ViperMesh for Blender?

Many Blender agent integrations expose a small set of inspection calls plus
arbitrary Python execution. ViperMesh keeps that escape hatch while adding a
broad deterministic tool surface for common operations.

| Capability | What it provides |
| --- | --- |
| Persistent session | One MCP process and one serialized Blender connection per agent session |
| Deterministic tools | Structured operations for assembly, materials, cameras, lighting, rendering, rigging, UVs, retopology, export, and inspection |
| Scene validation | Grounding, support, clearance, spatial-relation, file-health, and render-artifact checks |
| Compact workflows | Bounded batch calls plus separate build, inspect/repair, and finalize stages |
| Agent onboarding | Session bootstrap, MCP resources, concise operating rules, and local task guides |
| Custom fallback | `execute_code` remains available when a deterministic operation is not the right tool |

## Architecture

```text
MCP-compatible agent
        |
        | stdio, one long-lived process
        v
ViperMesh MCP server
        |
        | serialized loopback connection
        v
ViperMesh Blender addon (127.0.0.1:9876)
        |
        v
Blender scene
```

The MCP server opens no network listener. The Blender addon listens on
loopback by default and reports **Stopped**, **Ready**, **Agent connected**, or
**Error** in the ViperMesh sidebar.

## Requirements

- Blender 5.2 for the currently tested release target
- Node.js 20 or newer
- An MCP-compatible client that supports stdio servers

## Install

### 1. Install the Blender addon

Download `vipermesh-addon.py` from the
[latest release](https://github.com/Ker102/vipermesh-blender/releases/latest).
In Blender:

1. Open **Edit > Preferences > Add-ons**.
2. Choose **Install from Disk** and select the downloaded Python file.
3. Enable **ViperMesh for Blender**.
4. Open the 3D Viewport sidebar, select **ViperMesh**, and click
   **Start Local Bridge**.

Keep the bridge running for the complete agent session.

### 2. Install the MCP server

Until the npm package is published, clone the repository and install it:

```bash
git clone https://github.com/Ker102/vipermesh-blender.git
cd vipermesh-blender
npm install
npm run build
```

### 3. Configure your MCP client

Use the absolute repository path:

```json
{
  "mcpServers": {
    "vipermesh-blender": {
      "command": "npm",
      "args": ["run", "mcp"],
      "cwd": "C:/absolute/path/to/vipermesh-blender"
    }
  }
}
```

Start this command once through the MCP client. Do not invoke `npm`, `npx`, or
`tsx` again for each Blender operation.

## First Agent Calls

1. Call `bootstrap_vipermesh_session`.
2. Inspect the scene with `call_blender_tool(name="get_scene_info")`.
3. Search task guidance with `search_3d_guidance`.
4. Discover only the relevant capabilities with `list_blender_tools`.
5. Build, inspect and repair, then finalize and save.

The public MCP surface includes:

- `bootstrap_vipermesh_session`
- `check_blender_connection`
- `list_blender_tools`
- `call_blender_tool`
- `call_blender_tool_batch`
- `run_blender_scene_stage`
- `get_blender_agent_context`
- `search_3d_guidance`
- `get_3d_guidance_document`

Read the [complete connector manual](docs/portable-blender-mcp.md) for request
shapes, batching rules, staged workflows, local guidance, and troubleshooting.

## Security

This connector is intended for a trusted local workstation. `execute_code`
can run arbitrary Python in Blender. Only connect trusted MCP clients, keep the
bridge on loopback, and review high-impact or destructive operations.

See [SECURITY.md](SECURITY.md) for the trust boundary and private vulnerability
reporting process.

## Public Connector Scope

This repository contains the open-source Blender addon, portable MCP server,
local operating guidance, and connector tests. It does not include the
ViperMesh application, authentication, billing, private prompts, private RAG
data, cloud model routing, private assets, or benchmark evidence.

The connector does not bundle a commercial 3D generation provider. Neural
generation can be added later through provider-neutral authenticated services
without embedding third-party credentials in Blender.

## Frequently Asked Questions

### Does ViperMesh replace `execute_code`?

No. It reduces unnecessary generated Blender Python by providing structured
operations, but keeps `execute_code` for custom geometry, procedural effects,
unusual node graphs, and uncovered workflows.

### Why must the MCP process stay running?

The process retains a serialized connection to Blender. Relaunching it for
every call adds avoidable startup, transport, and agent-tool overhead.

### Does the public connector require ViperMesh cloud authentication?

No. The public addon and local MCP server work without ViperMesh authentication.
Future hosted models and proprietary orchestration are separate product
capabilities.

### Can it use installed Blender addons?

The connector can inspect installed addons and supports trusted local
automation. Unknown addon operations should be reviewed before being exposed
as callable agent capabilities.

## Development

```bash
npm install
npm run check
python -m py_compile addon/vipermesh-addon.py
```

See [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## License and Attribution

ViperMesh for Blender is released under the [MIT License](LICENSE). It includes
work derived from [BlenderMCP](https://github.com/ahujasid/blender-mcp) by
Siddharth Ahuja. See [NOTICE.md](NOTICE.md) for attribution and trademark
notices.
