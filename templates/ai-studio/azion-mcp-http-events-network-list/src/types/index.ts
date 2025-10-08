import { ZodObject, ZodRawShape } from 'zod'
import { ZodAny } from 'zod/v4';

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