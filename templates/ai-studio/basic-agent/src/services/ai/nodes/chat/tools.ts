import { getRagTools } from '../../tools/rag';
import { GraphState } from './agent';

/**
 * Generates a list of tools based on the mcp server
 * @returns {Promise<any[]>} - A promise that resolves to an array of tools. Type must be set here.
 * 
  */
export async function generateAsyncTools(toolsRequested?: any[]): Promise<any[]> {
  // Filter and forward only active RAG tools (if provided)
  const ragConfigs = Array.isArray(toolsRequested)
    ? toolsRequested.filter((t) => t?.type === 'RAG' && (t?.active ?? true))
    : undefined;
  return getRagTools(ragConfigs);
}

/**
 * Decides whether the agent should retrieve more information or end the process.
 * This function checks the last message in the state for a function call. If a tool call is
 * present, the process continues to retrieve information. Otherwise, it ends the process.
 * @param {typeof GraphState.State} state - The current state of the agent, including all messages.
 * @returns {string} - A decision to either "continue" the retrieval process or "end" it.
 */
export function toolRouter(state: typeof GraphState.State): string | string[] {
  const { messages } = state;
  const lastMessage = messages.at(-1);
  try {
    const role = (lastMessage && 'role' in (lastMessage as any))
      ? (lastMessage as any).role
      : (lastMessage && typeof (lastMessage as any).getType === 'function')
        ? (lastMessage as any).getType()
        : undefined;
    console.log('[ToolRouter] Message meta:', {
      messagesCount: messages?.length ?? 0,
      lastMessageRoleOrType: role,
    });
  } catch { }

  if (
    !lastMessage ||
    !('tool_calls' in lastMessage) ||
    !Array.isArray(lastMessage.tool_calls) ||
    !lastMessage.tool_calls.length
  ) {
    console.log('---DECISION: NO TOOLS---');
    return 'noTools';
  }
  console.log('---DECISION: USE TOOLS---');
  const toolNames = lastMessage.tool_calls.map(tool => tool.name);

  // Detailed tool-call logs with safe argument previews
  try {
    const details = (lastMessage as any).tool_calls.map((tool: any) => {
      let preview: string | undefined;
      try {
        const args = ('args' in tool) ? tool.args : (('arguments' in tool) ? tool.arguments : undefined);
        const str = typeof args === 'string' ? args : (args !== undefined ? JSON.stringify(args) : undefined);
        preview = str ? String(str).slice(0, 200) : undefined;
      } catch { }
      return { name: tool.name, argsPreview: preview };
    });
    console.log('[ToolRouter] Tool call details:', details);
  } catch { }

  return 'tools'
}
