# MCP (Model Context Protocol) Cheat Sheet

## What is MCP?

MCP is an open protocol that lets AI assistants connect to external tools and data sources. Think of it as "plugins for AI" - it gives Cursor access to your databases, APIs, file systems, and more.

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│  Cursor IDE  │────▶│  MCP Client  │────▶│   MCP Server    │
│  (AI Model)  │◀────│  (built-in)  │◀────│  (your tools)   │
└─────────────┘     └──────────────┘     └─────────────────┘
                                               │
                                          ┌────┴────┐
                                          │ External │
                                          │ Services │
                                          └─────────┘
```

## Configuration (.cursor/mcp.json)

```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "package-name"],
      "env": {
        "API_KEY": "your-key"
      }
    }
  }
}
```

## Common MCP Servers

| Server | Package | Purpose |
|--------|---------|---------|
| Filesystem | `@modelcontextprotocol/server-filesystem` | Read/write files |
| GitHub | `@modelcontextprotocol/server-github` | Issues, PRs, repos |
| Playwright | `@anthropic/mcp-playwright` | Browser automation & testing |
| Postgres | `@modelcontextprotocol/server-postgres` | Database queries |
| Memory | `@modelcontextprotocol/server-memory` | Persistent knowledge graph |

## MCP Server Concepts

- **Tools**: Functions the AI can call (e.g., `search_products`, `run_query`)
- **Resources**: Data the AI can read (e.g., file contents, database schemas)
- **Prompts**: Pre-built prompt templates

## Building a Custom MCP Server

```javascript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new McpServer({ name: "my-server", version: "1.0.0" });

// Register a tool
server.tool("my_tool", { param: z.string() }, async ({ param }) => {
  return { content: [{ type: "text", text: `Result: ${param}` }] };
});

// Start the server
const transport = new StdioServerTransport();
await server.connect(transport);
```

## Debugging MCP

1. Check Cursor's MCP status: `Cmd+Shift+P` → "MCP: Show Status"
2. Server logs appear in Cursor's output panel
3. Test servers standalone: `node your-server.js` (should wait for stdin)
