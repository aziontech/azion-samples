//@ts-ignore
import 'dotenv/config';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { getServer } from '@/core/server';
import { Hono } from 'hono';
import { toFetchResponse, toReqRes } from 'fetch-to-node';

const app = new Hono();

app.post('/mcp', async (c) => {
  try {

    const { req, res } = toReqRes(c.req.raw);

    const server = getServer();


    const transport: StreamableHTTPServerTransport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });

    await server.connect(transport);

    const body = await c.req.json()

    await transport.handleRequest(req, res, body)

    res.on('close', () => {
      transport.close();
      server.close();
    });

    return toFetchResponse(res);
  } catch (error) {
    const { req, res } = toReqRes(c.req.raw);
    console.error('Error handling MCP request:', error);
    if (!res.headersSent) {
      res.writeHead(500).end(JSON.stringify({
        jsonrpc: '2.0',
        error: {
          code: -32603,
          message: 'Internal server error',
        },
        id: null,
      }));
    }
  }
});

app.get('/mcp', async (c) => {
  const { req, res } = toReqRes(c.req.raw);
  console.log('Received GET MCP request');
  res.writeHead(405).end(JSON.stringify({
    jsonrpc: "2.0",
    error: {
      code: -32000,
      message: "Method not allowed."
    },
    id: null
  }));
});

app.delete('/mcp', async (c) => {
  const { req, res } = toReqRes(c.req.raw);
  console.log('Received DELETE MCP request');
  res.writeHead(405).end(JSON.stringify({
    jsonrpc: "2.0",
    error: {
      code: -32000,
      message: "Method not allowed."
    },
    id: null
  }));
});

app.fire()