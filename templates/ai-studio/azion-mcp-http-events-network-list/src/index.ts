//@ts-ignore
import 'dotenv/config';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { getServer } from '@/core/server';
import { Hono, type Context } from 'hono';
import { fire } from 'hono/service-worker';

const app = new Hono();

app.post('/mcp', async (c) => {
  try {
    const server = getServer();
    const transport = new WebStandardStreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });

    await server.connect(transport);

    return await transport.handleRequest(c.req.raw);
  } catch (error) {
    console.error('Error handling MCP request:', error);
    return c.json({
      jsonrpc: '2.0',
      error: {
        code: -32603,
        message: 'Internal server error',
      },
      id: null,
    }, 500);
  }
});

const methodNotAllowed = (c: Context) => {
  console.log(`Received ${c.req.method} MCP request`);
  return c.json({
    jsonrpc: '2.0',
    error: {
      code: -32000,
      message: 'Method not allowed.',
    },
    id: null,
  }, 405);
};

app.get('/mcp', methodNotAllowed);
app.delete('/mcp', methodNotAllowed);

fire(app);
