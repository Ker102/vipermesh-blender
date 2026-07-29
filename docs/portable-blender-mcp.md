# Portable Blender MCP Gateway

The portable gateway lets trusted coding agents call ViperMesh Blender tools
through standard MCP stdio transport, including `execute_code` for measuring
fallback behavior during local testing.

It is a trusted local connector. Authenticated cloud services and commercial
entitlements remain outside the public addon and MCP package.

## Execution Paths

The portable gateway is additive:

```text
External coding agent
  -> ViperMesh MCP stdio server
  -> process-lifetime serialized TCP client
  -> Blender addon at 127.0.0.1:9876
```

The MCP server retains its Blender socket for the lifetime of the process
instead of reconnecting after every tool call.

## Requirements

- Node.js and this repository's installed dependencies.
- Blender running with the ViperMesh addon installed and its local server
  started.
- The addon reachable at `127.0.0.1:9876`, unless overridden with
  `BLENDER_MCP_HOST` and `BLENDER_MCP_PORT`.
Local checked-in tool-skill search works without database or embedding
credentials.

## Start The Gateway

From the repository root:

```bash
npm run mcp
```

The process communicates over stdin/stdout using MCP JSON-RPC. Startup
diagnostics are written to stderr.

## Coding Agent Configuration

Use the built entry point from an absolute repository path:

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

The exact configuration location depends on the coding agent. Restart or open a
new agent session after registering the server if the client does not reload MCP
servers dynamically. See [MCP client setup](client-setup.md) for Codex and
client compatibility details.

## Available MCP Tools

- `check_blender_connection`
- `bootstrap_vipermesh_session`
- `list_blender_tools`
- `call_blender_tool`
- `call_blender_tool_batch`
- `run_blender_scene_stage`
- `get_blender_agent_context`
- `search_3d_guidance`
- `get_3d_guidance_document`

`call_blender_tool` accepts only commands present in the ViperMesh tool
registry. Unlike production-facing surfaces, this trusted local gateway exposes
`execute_code` so testing can reveal where the agent still falls back to
freeform Blender Python.

Example request:

```json
{
  "name": "get_scene_info",
  "params": {}
}
```

Use `list_blender_tools` to inspect available commands and their parameter
descriptions.

`call_blender_tool_batch` accepts up to 32 ordered commands and defaults to
stopping after the first failed response. Use it for an already-decided cluster
such as creating several primitives or applying several independent material
assignments. Do not batch across a point where the next action depends on
inspection, grounding, or visual feedback.

`run_blender_scene_stage` provides an additive compact workflow over the same
persistent socket:

- `build` runs a bounded caller-supplied construction batch.
- `inspect_preview` checks grounding and optional named spatial relations,
  frames and renders a lightweight preview, and inspects the artifact.
- `finalize` sets up and validates the presentation camera, then renders and
  saves only when validation passes.

Call the stages separately. The agent must inspect the preview between
`inspect_preview` and `finalize`, and may use any standalone Blender tool for
repairs before repeating inspection. Stage responses intentionally return
compact status, count, and artifact fields instead of full Blender payloads to
reduce context and token overhead. Standalone and generic batch calls remain
available.

The server keeps one lazy Blender connection open and serializes all single
and batch calls through it. If Blender closes the socket, the client reconnects
on the next call. MCP hosts should start `npm run mcp` once per agent
session, not once per tool.

## Agent Context

`bootstrap_vipermesh_session` is the required first call for an unfamiliar
agent. It checks Blender, returns the compact operating context, identifies the
persistent session model, and recommends the next calls.

`get_blender_agent_context` returns the public compact operating rules for
inspection, guidance retrieval, direct-tool preference, bounded batching,
`execute_code` fallback, grounding, and visual acceptance. The private
ViperMesh product prompt and orchestration are not distributed by this
connector.

An arbitrary MCP agent should load one profile at session start, query
`search_3d_guidance` for the concrete task, and use `list_blender_tools` only
for the relevant capability category or search term. For example, retopology
work should retrieve the checked-in remesh and topology guidance before choosing
between decimation, voxel remesh, QuadriFlow, or custom fallback code.

## Guidance Retrieval

`search_3d_guidance` supports:

- `source: "local"` for deterministic search over the public agent skill
  references in `skills/using-vipermesh-blender/references`;
- `source: "semantic"` for a configured private ViperMesh semantic adapter;
- `source: "all"` to combine both.

Semantic retrieval is an optional private-product adapter. The public connector
ships deterministic local tool-skill retrieval and does not require database or
embedding credentials.

`get_3d_guidance_document` reads a Markdown basename from
`skills/using-vipermesh-blender/references`. Arbitrary filesystem paths and
traversal are rejected.

The skill references describe capabilities, tradeoffs, and validation patterns.
They are recommendations, not universal scene recipes. The private ViperMesh
RAG corpus is not distributed in the public connector.

## Security Boundary

This local gateway is for use on a trusted workstation.

- It uses stdio and opens no additional network listener.
- The Blender addon should remain bound to loopback.
- It exposes freeform Python execution for trusted local fallback testing.
- It does not enforce subscriptions or protect local addon implementation.

A future production version should use an authenticated remote ViperMesh
control plane for premium orchestration, private guidance, provider access, and
signed action plans. Local authentication alone cannot make software running on
a user-controlled machine tamper-proof.
