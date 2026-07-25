#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"

import { checkMcpConnection, createMcpClient } from "../lib/mcp/client"
import { createPortableBlenderMcpServer } from "../lib/portable-mcp/server"
import { createPortableMcpService } from "../lib/portable-mcp/service"

async function main() {
  const service = createPortableMcpService({
    checkConnection: checkMcpConnection,
    createClient: createMcpClient,
    semanticSearch: async () => [],
  })
  const server = createPortableBlenderMcpServer(service)
  const transport = new StdioServerTransport()

  await server.connect(transport)
  console.error("ViperMesh for Blender MCP server running on stdio")

  let shutdownPromise: Promise<void> | undefined
  const shutdown = () => {
    shutdownPromise ??= service.close()
    return shutdownPromise
  }
  process.stdin.once("end", shutdown)
  process.stdin.once("close", shutdown)
  process.once("beforeExit", shutdown)
  process.once("SIGINT", () => void shutdown().finally(() => process.exit(0)))
  process.once("SIGTERM", () => void shutdown().finally(() => process.exit(0)))
}

main().catch((error) => {
  console.error(
    error instanceof Error
      ? `ViperMesh for Blender MCP startup failed: ${error.message}`
      : "ViperMesh for Blender MCP startup failed"
  )
  process.exit(1)
})
