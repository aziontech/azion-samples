import type { ZodRawShape } from 'zod'

/**
 * Interface for a MCP tool
 */
export interface McpTool {
    name: string;
    description: string;
    inputSchema: ZodRawShape
    execute: (args: Record<string, any>) => Promise<ToolResponse>;
}

type ToolResponse = {
    content: {
        type: 'text';
        text: string;
    }[]
}