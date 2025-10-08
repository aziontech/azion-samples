import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { tools } from './tools'

export const getServer = () => {

    const server = new McpServer({
        name: 'azion-mcp-server',
        version: '1.0.0',
    }, { capabilities: { logging: {} } });

    for (const tool of tools) {

        const { name, description, inputSchema, execute } = tool;

        server.registerTool(name, { description, inputSchema }, execute);
    }

    return server;
}