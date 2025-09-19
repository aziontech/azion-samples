import { handleSystemPrompt } from '@/helpers/utils';
import { GraphState, toolsAnnouncer } from '@/services/ai/nodes/chat/agent';
import { generateAsyncTools, toolRouter } from '@/services/ai/nodes/chat/tools';
import { LangGraphContext } from '@/types';
import { AIMessage, BaseMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';
import { END, START, StateGraph } from '@langchain/langgraph';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { ChatOpenAI } from '@langchain/openai';

// Resolve AI Studio base URL from environment (supports both hyphen and underscore var names)
const AI_STUDIO_BASE_URL = process.env['AI-STUDIO-URL'] || process.env.AI_STUDIO_URL;

// Helper to post a message to the thread API
async function postToThreadAPI(
  context: Record<string, any> | LangGraphContext,
  payload: any
) {
  try {
    const meta = (context as any)?.metadata || {};
    const threadId: string | undefined = meta.thread_id;
    const runId: string | undefined = meta.run_id;
    const model: string | undefined = meta.model;
    const tokenFromConfig: string | undefined = meta.token;

    if (!threadId || !tokenFromConfig) return;

    const origin = process.env.AI_STUDIO_URL || AI_STUDIO_BASE_URL || '';
    if (!origin) return;

    let token = tokenFromConfig;
    if (process.env.USE_LOCAL_TOKEN === 'true' && process.env.LOCAL_TOKEN) {
      token = process.env.LOCAL_TOKEN as string;
    }

    const endpoint = `${origin}/v4/workspace/ai/threads/${threadId}/messages`;
    const body = {
      ...payload,
      // Always enrich with model/run_id if available
      metadata: { ...(payload?.metadata || {}), model, run_id: runId },
    };

    await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then(async (res) => {
      const text = await res.text().catch(() => '');
      console.log('[thread-api] tool payload ->', { status: res.status, ok: res.ok, body: text });
    }).catch((err) => {
      console.error('[thread-api] error posting tool payload ->', err);
    });
  } catch (err) {
    console.error('[thread-api] unexpected error posting tool payload ->', err);
  }
}

/**
 * Build a minimal chat graph with a single agent node and no tools.
 * Model and system prompt are provided at runtime via context/configurable.
 */
export async function generateAgentOnlyGraph(
  model: string,
  toolsRequested?: Array<any>
) {
  // Determine if we should enable tools (RAG)
  const wantsRag = Array.isArray(toolsRequested) && toolsRequested.some(t => t?.type === 'RAG');
  const tools = wantsRag ? await generateAsyncTools(toolsRequested) : [];

  // Single agent node (no tools)
  const agentNoTools = async (
    state: typeof GraphState.State,
    context: Record<string, any> | LangGraphContext
  ): Promise<Partial<typeof GraphState.State>> => {
    try {
      const { messages } = state;

      // Normalize incoming messages into LangChain BaseMessage instances
      const lcMessages: BaseMessage[] = (messages as any[]).map((m: any) => {
        // Already a BaseMessage
        if (m && typeof m._getType === 'function') return m as BaseMessage;
        const role = m?.role;
        const content = typeof m?.content === 'string' ? m.content : JSON.stringify(m?.content ?? '');
        if (role === 'assistant' || role === 'ai') return new AIMessage(content);
        if (role === 'system') return new SystemMessage(content);
        return new HumanMessage(content);
      });

      const systemPrompt = handleSystemPrompt(context as any, '');

      console.log('Calling:', model, systemPrompt);

      const chatBase = new ChatOpenAI({
        model,
        temperature: 0.3,
        streaming: false,
        verbose: false,
        tags: ['agent'],
        configuration: {
          baseURL: process.env.EDGEAI_ENDPOINT
        },
        apiKey: process.env.EDGE_AI_TOKEN,
      })
      console.log('Chat base created');
      // If tools are requested and include RAG, bind tools
      let chat = chatBase as any;
      if (wantsRag) {
        chat = chatBase.bindTools(tools);
        console.log('Tools bound to chat');
      }

      const response = await chat.invoke(
        [new SystemMessage(systemPrompt), ...lcMessages],
        wantsRag ? { recursionLimit: 5, tool_choice: 'auto' } : undefined
      );

      // If the assistant produced tool calls, persist the tool_call message to the thread
      try {
        const calls = (response as any)?.tool_calls;
        if (Array.isArray(calls) && calls.length) {
          const normalizedCalls = calls.map((c: any) => ({
            id: c?.id,
            type: 'function',
            function: {
              name: c?.name,
              arguments: typeof c?.args === 'string' ? c.args : JSON.stringify(c?.args ?? {}),
            },
          }));
          await postToThreadAPI(context, {
            name: 'assistant',
            description: `Chamada de ferramenta - ${normalizedCalls[0]?.function?.name || 'tool'}`,
            message: {
              role: 'assistant',
              content: '',
              tool_calls: normalizedCalls,
            },
          });
        }
      } catch (e) {
        console.error('Error persisting assistant tool_calls:', e);
      }

      return {
        messages: [response]
      };
    } catch (error) {
      console.error('Error in agentNoTools:', error);
      throw error;
    }
  };

  // Node to report tool results (ToolMessage) to the thread API
  const toolsReporter = async (
    state: typeof GraphState.State,
    context: Record<string, any> | LangGraphContext
  ): Promise<Partial<typeof GraphState.State>> => {
    try {
      const { messages } = state;
      const last = messages.at(-1) as any;
      // ToolMessage in LC typically has tool_call_id and content
      const toolCallId = last?.tool_call_id || last?.additional_kwargs?.tool_call_id;
      const name = last?.name || 'tool';
      const rawContent = last?.content;
      let content: any = rawContent;
      try {
        if (typeof rawContent === 'string') {
          content = JSON.parse(rawContent);
        }
      } catch { /* keep as string */ }

      if (toolCallId && rawContent !== undefined) {
        await postToThreadAPI(context, {
          name,
          description: 'Resultado da ferramenta',
          message: {
            role: 'tool',
            tool_call_id: toolCallId,
            name,
            content,
          },
        });
      }
    } catch (e) {
      console.error('Error persisting tool result:', e);
    }
    // Do not alter state
    return {} as any;
  };

  const workflow = new StateGraph(GraphState)
    .addNode('agent', agentNoTools);

  if (wantsRag) {
    const toolNode = new ToolNode(tools as any);
    workflow
      .addNode('tools', toolNode)
      .addNode('toolsReporter', toolsReporter)
      .addNode('toolsAnnouncer', toolsAnnouncer as any)
      .addEdge(START, 'agent')
      .addConditionalEdges('agent', (state) => toolRouter(state as any), {
        noTools: END,
        tools: 'tools',
        toolsAnnouncer: 'toolsAnnouncer',
      })
      .addEdge('tools', 'toolsReporter')
      .addEdge('toolsReporter', 'agent')
      .addEdge('toolsAnnouncer', 'agent');
  } else {
    workflow
      .addEdge(START, 'agent')
      .addEdge('agent', END);
  }

  const graph = workflow.compile({});
  graph.name = 'chat';
  return graph;
}
