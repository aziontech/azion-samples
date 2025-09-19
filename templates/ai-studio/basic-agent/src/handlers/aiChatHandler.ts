import { AIChatRequestBodySchema } from '@/helpers/schema';
import { createConfigurable, createInputMessages, extractRequestParams, resolveLangChainTracer, validateRequestBody } from '@/helpers/utils';
import { resolveAgentByName } from '@/services/agentService';
import { generateAgentOnlyGraph } from '@/services/ai/agentOnlyGraph';
import { GraphService } from '@/services/graphService';
import { Config } from '@/types';
import { Context } from 'hono';
import { v4 as uuidv4 } from 'uuid';

/**
 * Handles /ai/chat requests. Validates the body with AIChatRequestBodySchema,
 * builds a minimal agent-only LangGraph (no tools), and returns the completion.
 */
export async function aiChatRequestHandler(context: Context): Promise<Response> {
  try {
    const request = context.req.raw;

    // 1) Extrai params do Request
    const { requestParams, error: extractError } = await extractRequestParams(request);
    if (extractError || !requestParams) {
      return new Response(JSON.stringify(extractError), { status: 400 });
    }

    let { url, body, ip, token } = requestParams;
    const accountId = context.get('accountId');

    // 2) Valida o body (aceita formato curto ou args-based)
    const { parsedBody, error } = await validateRequestBody(body, AIChatRequestBodySchema);
    if (error || !parsedBody) {
      return new Response(`Error parsing body: ${error}`, { status: 400 });
    }

    // 3) Normaliza: se vier formato curto (agent: string), resolve agent e monta args
    let messages: any[];
    let stream: boolean | undefined;
    let azion: any;
    let variables: any;
    let args: any;
    let threadId: string | undefined;

    if (typeof (parsedBody as any).agent === 'string') {
      const agentName = (parsedBody as any).agent as string;
      messages = (parsedBody as any).messages;
      stream = (parsedBody as any).stream;
      azion = (parsedBody as any).azion;
      variables = (parsedBody as any).variables;
      threadId = (parsedBody as any).thread_id;
      const overrideAgents = (parsedBody as any).args?.agents;

      const resolvedAgent = await resolveAgentByName(agentName, accountId, overrideAgents);
      if (!resolvedAgent) {
        return new Response(JSON.stringify({ message: `Agent not found: ${agentName}` }), { status: 404 });
      }
      // No tools on short format; keep tools only inside args.agent in args-based format
      args = { agent: resolvedAgent };
    } else {
      // formato args-based
      const bodyWithArgs = parsedBody as any;
      messages = bodyWithArgs.messages;
      stream = bodyWithArgs.stream;
      azion = bodyWithArgs.azion;
      variables = bodyWithArgs.variables;
      args = bodyWithArgs.args;
      threadId = bodyWithArgs.thread_id;
    }

    const agent = args.agent;      // obrigatório
    // Tools priority: args.agent.tools > args.tools (backward compatibility)
    const tools = (agent && Array.isArray(agent.tools) ? agent.tools : undefined) ?? args.tools ?? [];

    // Ex.: usar system_prompt/goal do agent
    const goal = agent.goal ? `\nGoal: ${agent.goal}` : '';
    const systemPrompt = `${agent.system_prompt}${goal}`;
    const tracer = resolveLangChainTracer(url, azion?.app);

    const inputs = createInputMessages(messages);

    // Build configurable (metadata) e sobrescreve com system prompt do agent
    const configurable = createConfigurable(azion, variables, args, url, azion?.session_id || uuidv4(), ip, token, accountId);
    // Override thread id if provided at top-level input
    if (threadId) {
      // @ts-ignore augment configurable with thread id
      configurable.thread_id = threadId;
    }
    if (agent.system_prompt) {
      // @ts-ignore augments configurable with system prompt from agent
      configurable.system_prompt = systemPrompt;
    }

    const config: Config = {
      configurable,
      tracer,
      run_id: uuidv4(),
    };

    // Persist the user message BEFORE running the graph to ensure correct chronological order
    try {
      if (threadId && token) {
        const origin = process.env.AI_STUDIO_URL
        const endpoint = `${origin}/v4/workspace/ai/threads/${threadId}/messages`;
        if (process.env.USE_LOCAL_TOKEN === 'true') {
          token = process.env.LOCAL_TOKEN
          console.warn('USANDO TOKEN LOCAL');
        }
        const authHeader = `Token ${token}`;
        const firstUser = (Array.isArray(messages) ? messages.find((m: any) => m.role === 'user') : undefined) || messages?.[0];
        if (firstUser?.content) {
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Authorization': authHeader,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: 'user',
              description: 'Mensagem do usuário',
              message: { role: 'user', content: firstUser.content },
              metadata: { locale: 'pt-BR' },
            })
          });
          const text = await res.text().catch(() => '');
          console.log('[thread-api] user message ->', {
            endpoint,
            status: res.status,
            ok: res.ok,
            body: text,
          });
        }
      }
    } catch (persistErr) {
      console.error('Error persisting user thread message:', persistErr);
    }

    // Build minimal agent graph com ferramentas opcionais
    const model = agent.llm_model;
    // Propagate the selected model into the graph context so all nodes (agent, toolsAnnouncer) use the same LLM
    // @ts-ignore augment configurable with runtime model selection
    config.configurable.model = model;
    // Also expose run_id to nodes (toolsAnnouncer/toolsReporter) via context
    // @ts-ignore augment configurable with run_id for thread message persistence
    config.configurable.run_id = config.run_id;
    const chatGraph = await generateAgentOnlyGraph(model, tools);

    const graphService = new GraphService(inputs, stream || false, config, chatGraph);
    const gsResponse = await graphService.run();

    if (gsResponse.success) {
      // Fire-and-forget: persist final assistant message if requested and token available
      try {
        if (threadId && token) {
          const origin = process.env.AI_STUDIO_URL
          const endpoint = `${origin}/v4/workspace/ai/threads/${threadId}/messages`;
          if (process.env.USE_LOCAL_TOKEN === 'true') {
            token = process.env.LOCAL_TOKEN
            console.warn('USANDO TOKEN LOCAL');
          }
          const authHeader = `Token ${token}`;
          const assistantPayload = !stream && typeof gsResponse.data === 'string' ? JSON.parse(gsResponse.data) : undefined;
          const assistantContent = assistantPayload?.choices?.[0]?.message?.content;

          // Post assistant message only for non-streaming responses (we have the final content)
          if (!stream && assistantContent) {
            fetch(endpoint, {
              method: 'POST',
              headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name: 'assistant',
                description: 'Resposta final ao usuário',
                message: { role: 'assistant', content: assistantContent },
                metadata: { model, run_id: config.run_id },
              })
            })
              .then(async (res) => {
                const text = await res.text().catch(() => '');
                console.log('[thread-api] assistant message ->', {
                  endpoint,
                  status: res.status,
                  ok: res.ok,
                  body: text,
                });
              })
              .catch((err) => {
                console.error('[thread-api] assistant message error ->', err);
              });
          }
        }
      } catch (persistErr) {
        console.error('Error persisting thread messages:', persistErr);
      }

      return new Response(gsResponse.data as any, {
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream',
        },
      });
    }

    return new Response(JSON.stringify(gsResponse.error), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    console.error('Unhandled error on /ai/chat:', err);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}

