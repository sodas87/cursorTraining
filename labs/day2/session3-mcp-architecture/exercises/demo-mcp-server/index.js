#!/usr/bin/env node

/**
 * ShopCursor MCP Server
 *
 * A custom Model Context Protocol server that provides tools for searching
 * and retrieving product information from the ShopCursor e-commerce API.
 *
 * This server demonstrates:
 * - How to create an MCP server using the official SDK
 * - How to define custom tools that AI assistants can use
 * - How to integrate with external APIs
 * - How to handle tool calls and return results
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ErrorCode,
  McpError
} from '@modelcontextprotocol/sdk/types.js';

// Configuration: Get API base URL from environment or use default
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';

/**
 * Helper function to make HTTP requests to the ShopCursor API
 */
async function fetchFromAPI(endpoint) {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching from API: ${error.message}`);
    throw error;
  }
}

/**
 * Search for products by query string
 */
async function searchProducts(query, category = null, minPrice = null, maxPrice = null) {
  // Build query parameters
  const params = new URLSearchParams();
  params.append('q', query);

  if (category) {
    params.append('category', category);
  }
  if (minPrice !== null) {
    params.append('minPrice', minPrice);
  }
  if (maxPrice !== null) {
    params.append('maxPrice', maxPrice);
  }

  const endpoint = `/api/products/search?${params.toString()}`;
  return await fetchFromAPI(endpoint);
}

/**
 * Initialize the MCP server
 */
const server = new Server(
  {
    name: 'shopcursor-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * Handler for the "tools/list" request
 *
 * This tells the AI assistant what tools are available from this server.
 * Each tool has:
 * - name: Unique identifier for the tool
 * - description: What the tool does (helps AI decide when to use it)
 * - inputSchema: JSON Schema defining the tool's parameters
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'search_products',
        description: 'Search for products in the ShopCursor e-commerce store. ' +
                     'Returns a list of products matching the search query. ' +
                     'Supports filtering by category and price range.',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query (product name, description, or keywords)',
            },
            category: {
              type: 'string',
              description: 'Optional: Filter by category (e.g., "Electronics", "Books", "Clothing")',
            },
            minPrice: {
              type: 'number',
              description: 'Optional: Minimum price filter',
            },
            maxPrice: {
              type: 'number',
              description: 'Optional: Maximum price filter',
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'get_product_by_id',
        description: 'Get detailed information about a specific product by its ID. ' +
                     'Returns full product details including description, price, inventory, and images.',
        inputSchema: {
          type: 'object',
          properties: {
            productId: {
              type: 'string',
              description: 'The unique identifier of the product',
            },
          },
          required: ['productId'],
        },
      },
    ],
  };
});

/**
 * Handler for the "tools/call" request
 *
 * This is called when the AI assistant wants to execute a tool.
 * We receive:
 * - name: Which tool to execute
 * - arguments: The parameters for the tool
 *
 * We return:
 * - content: Array of content blocks (text, images, etc.)
 * - isError: Whether an error occurred
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    // Route to the appropriate tool handler
    switch (name) {
      case 'search_products': {
        const { query, category, minPrice, maxPrice } = args;

        // Validate required parameters
        if (!query || typeof query !== 'string') {
          throw new McpError(
            ErrorCode.InvalidParams,
            'query parameter is required and must be a string'
          );
        }

        // Call the API
        const results = await searchProducts(query, category, minPrice, maxPrice);

        // Format the response
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(results, null, 2),
            },
          ],
        };
      }

      case 'get_product_by_id': {
        const { productId } = args;

        // Validate required parameters
        if (!productId || typeof productId !== 'string') {
          throw new McpError(
            ErrorCode.InvalidParams,
            'productId parameter is required and must be a string'
          );
        }

        // Call the API
        const product = await fetchFromAPI(`/api/products/${productId}`);

        // Format the response
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(product, null, 2),
            },
          ],
        };
      }

      default:
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${name}`
        );
    }
  } catch (error) {
    // Handle errors gracefully
    if (error instanceof McpError) {
      throw error;
    }

    // Wrap other errors in McpError
    throw new McpError(
      ErrorCode.InternalError,
      `Tool execution failed: ${error.message}`
    );
  }
});

/**
 * Start the server
 *
 * The server communicates via stdio (standard input/output).
 * This allows it to be launched as a subprocess by Cursor.
 */
async function main() {
  // Create stdio transport (communicates via stdin/stdout)
  const transport = new StdioServerTransport();

  // Connect the server to the transport
  await server.connect(transport);

  // Log to stderr (stdout is reserved for MCP protocol)
  console.error('ShopCursor MCP Server running on stdio');
  console.error(`API Base URL: ${API_BASE_URL}`);
}

// Run the server
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
