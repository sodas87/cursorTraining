# MCP Architecture Setup

## What is MCP and Why It Matters

**Model Context Protocol (MCP)** is an open protocol that standardizes how AI assistants like Cursor connect to external data sources and tools. Think of it as a universal adapter that lets your AI access:

- File systems
- Databases
- APIs
- Version control systems
- Custom business logic

### Why MCP Matters for Cursor

- **Extensibility**: Add custom tools without changing Cursor's core
- **Standardization**: One protocol for all integrations
- **Security**: Controlled access to external resources
- **Context**: Give AI access to real-time data and capabilities

### MCP Architecture

```
┌─────────────────┐
│  Cursor IDE     │
│  (MCP Client)   │
└────────┬────────┘
         │
         │ JSON-RPC over stdio/HTTP
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼────┐
│ MCP   │ │ MCP   │
│Server1│ │Server2│
└───┬───┘ └──┬────┘
    │        │
┌───▼───┐ ┌──▼────┐
│ Files │ │GitHub │
└───────┘ └───────┘
```

## Exercise 1: Configure the Filesystem MCP Server

The filesystem MCP server allows Cursor to read/write files with explicit permission.

### Step 1: Create MCP Configuration

Create `.cursor/mcp.json` in your project root:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/YOUR_USERNAME/Documents/Learn/cursorTraining"
      ]
    }
  }
}
```

**Replace `YOUR_USERNAME`** with your actual username.

### Step 2: Restart Cursor

Close and reopen Cursor to load the MCP configuration.

### Step 3: Test the Integration

Open Cursor chat and try:
```
Can you list the files in the labs directory using MCP?
```

### Expected Behavior

Cursor should now be able to:
- List directory contents
- Read files
- Create/modify files with permission
- Search across your codebase

## Exercise 2: Configure the GitHub MCP Server

The GitHub MCP server lets Cursor interact with GitHub repositories, issues, and PRs.

### Step 1: Generate GitHub Personal Access Token

1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes: `repo`, `read:org`, `read:user`
4. Copy the token

### Step 2: Update MCP Configuration

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/YOUR_USERNAME/Documents/Learn/cursorTraining"
      ]
    },
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

**Security Note**: In production, use environment variables or secure secret management instead of hardcoding tokens.

### Step 3: Test GitHub Integration

Try in Cursor chat:
```
Can you list the open issues in the repository owner/repo?
```

## Exercise 3: Build a Custom MCP Server

Let's build a custom MCP server that provides a "product search" tool for the ShopCursor e-commerce app.

### Architecture

```
Cursor → Custom MCP Server → ShopCursor API
```

### Step 1: Review the Demo Server Code

Navigate to `labs/day2/session3-mcp-architecture/exercises/demo-mcp-server/` and examine:
- `package.json` - Dependencies
- `index.js` - MCP server implementation

### Step 2: Install Dependencies

```bash
cd labs/day2/session3-mcp-architecture/exercises/demo-mcp-server/
npm install
```

### Step 3: Test the Server Locally

```bash
node index.js
```

The server communicates via stdio, so you'll see JSON-RPC messages.

### Step 4: Add to MCP Configuration

Update `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "filesystem": { ... },
    "github": { ... },
    "shopcursor": {
      "command": "node",
      "args": [
        "/Users/YOUR_USERNAME/Documents/Learn/cursorTraining/labs/day2/session3-mcp-architecture/exercises/demo-mcp-server/index.js"
      ],
      "env": {
        "API_BASE_URL": "http://localhost:8080"
      }
    }
  }
}
```

### Step 5: Restart and Test

Restart Cursor and try:
```
Use the shopcursor MCP server to search for "laptop" products
```

### How It Works

1. **Client Request**: Cursor sends a tool call request via JSON-RPC
2. **Server Processing**: MCP server receives `search_products` tool call
3. **API Call**: Server queries ShopCursor API
4. **Response**: Results returned to Cursor
5. **AI Processing**: Cursor's AI uses results to answer your question

## Challenge: Extend the MCP Server

Add a new tool to the demo server:

**Tool**: `get_product_details`
- **Input**: `productId` (string)
- **Output**: Full product details including description, price, inventory

**Hints**:
- Follow the pattern in `index.js`
- Add a new tool to the `ListToolsResultSchema`
- Implement the tool handler in `CallToolResultSchema`
- Use the ShopCursor API endpoint: `GET /api/products/{id}`

## Key Takeaways

1. **MCP is a bridge** between AI and external systems
2. **Security**: Always control what MCP servers can access
3. **Custom servers**: Extend Cursor with domain-specific tools
4. **JSON-RPC**: Standard protocol for AI-tool communication
5. **Real-time data**: MCP enables AI to work with live systems

## Troubleshooting

### Server Not Loading
- Check `.cursor/mcp.json` syntax (valid JSON)
- Verify file paths are absolute
- Restart Cursor after config changes

### Tool Not Available
- Check server logs (run manually to debug)
- Verify tool schema matches MCP specification
- Ensure server exposes tools in `tools/list` response

### Connection Errors
- Verify command and args are correct
- Check environment variables are set
- Ensure server process has necessary permissions

## Resources

- [MCP Specification](https://modelcontextprotocol.io)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/sdk)
- [Official MCP Servers](https://github.com/modelcontextprotocol/servers)
