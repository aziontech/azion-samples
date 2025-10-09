import { z } from 'zod';


const TextMessageSchema = z.object({
  role: z.enum(['system', 'assistant', 'user']),
  content: z.string().max(64000)
});

const ImageMessageSchema = z.object({
  role: z.enum(['system', 'assistant', 'user']),
  content: z.array(z.object({
    type: z.enum(['text', 'image_url']),
    text: z.string().optional(),
    image_url: z.object({
      url: z.string().url(),
    }).optional(),
  })),
});

const InputMessageSchema = z.array(z.union([TextMessageSchema, ImageMessageSchema]))

const DocsOptionsSchema = z.object({
  amountPerSearch: z.number().int().optional(),
  metadataItems: z.array(z.string()).optional(),
  filters: z.array(
    z.object({
      operator: z.enum(['=', '!=', '>', '<>', '<', '>=', '<=', 'LIKE', 'NOT LIKE', 'IN', 'NOT IN', 'IS NULL', 'IS NOT NULL']),
      column: z.enum(['id', 'content', 'metatags', 'collection', 'title', 'description', 'tags', 'source', 'language', 'scope']),
      value: z.string()
    })
  ).optional(),
});

const ToolTypeSchema = z.enum(['RAG']);
const ToolKBItemSchema = z.object({
  kb_id: z.string(),
  name: z.string().optional(),
  edgesql_db_id: z.string(),
  embedding_model: z.string().optional(),
});
const ToolItemSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  type: ToolTypeSchema,
  active: z.boolean().default(true).optional(),
  kb: z.array(ToolKBItemSchema).min(1).optional(),
});

// Support request schemas
const SupportRequestBodySchema = z.object({
  ticket_id: z.string(),
  subject: z.string(),
  description: z.string(),
})

export const SupportRequestSchema = z.object({
  support_request: SupportRequestBodySchema.optional(),
})

// Agent payload schema for /ai/chat endpoint
const AgentSchema = z.object({
  agent_id: z.string().uuid(),
  account_id: z.string().uuid(),
  created_by: z.string().uuid().optional(),
  updated_by: z.string().uuid().optional(),
  name: z.string(),
  description: z.string().optional(),
  system_prompt: z.string(),
  goal: z.string().optional(),
  // For now we accept a string model identifier; callers may pass the provider model name directly
  llm_model: z.string(),
  // Tools can be optionally provided inside the agent object in args.agent.tools
  tools: z.array(ToolItemSchema).optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

// Minimal agent catalog item schema allowed if client passes agents in args
const AgentCatalogAgentSchema = z.object({
  agent_id: z.string().uuid(),
  name: z.string(),
  system_prompt: z.string(),
  goal: z.string().optional(),
  llm_model: z.string(),
});

// Args for /ai/chat: agent and tools are primary; 'agents' catalog is optional override source
const AIChatArgsSchema = z.object({
  agent: AgentSchema,
  tools: z.array(ToolItemSchema).optional(),
  agents: z.array(AgentCatalogAgentSchema).optional(),
}).strict();

// Short request format: top-level agent name (string), optional args.agents override catalog
const AIChatShortRequestSchema = z.object({
  messages: InputMessageSchema,
  agent: z.string(),
  variables: z.unknown().optional(),
  stream: z.boolean().default(false).optional(),
  thread_id: z.string().uuid().optional(),
  args: z.object({
    agents: z.array(AgentCatalogAgentSchema).optional(),
  }).optional(),
});

// Request body for /ai/chat accepts either args-based or short format
const AIChatRequestBodySchema = z.union([
  z.object({
    messages: InputMessageSchema,
    variables: z.unknown().optional(),
    stream: z.boolean().default(false).optional(),
    thread_id: z.string().uuid().optional(),
    args: AIChatArgsSchema,
  }),
  AIChatShortRequestSchema,
]);

const RequestChatBodySchema = z.object({
  messages: InputMessageSchema,
  variables: z.unknown().optional(),
  args: z.record(z.any()).optional(),
  docs_options: DocsOptionsSchema.optional(),
  support_request: SupportRequestBodySchema.optional(),
  stream: z.boolean().default(false).optional(),
  stream_options: z
    .object({
      include_usage: z.boolean().optional(),
    })
    .nullable()
    .optional(),
  frequency_penalty: z.number().nullable().optional(),
  logit_bias: z.record(z.number()).optional(),
  logprobs: z.boolean().nullable().optional(),
  top_logprobs: z.number().int().nullable().optional(),
  max_completion_tokens: z.number().int().nullable().optional(),
  n: z.number().int().nullable().optional(),
  presence_penalty: z.number().nullable().optional(),
  response_format: z
    .object({
      type: z.enum(['text', 'json_object', 'json_schema']).optional(),
    })
    .optional(),
  seed: z.number().nullable().optional(),
  service_tier: z.string().nullable().optional(),
  stop: z.string().array().nullable().optional(),
  temperature: z.number().nullable().optional(),
  top_p: z.number().nullable().optional(),
  tools: z
    .array(
      z.object({
        type: z.enum(['function']).optional(),
        function: z
          .object({
            name: z.string().optional(),
            description: z.string().optional(),
          })
          .optional(),
      })
    )
    .optional(),
  tool_choice: z
    .union([z.string(), z.object({})])
    .nullable()
    .optional(),
  parallel_tool_calls: z.boolean().nullable().optional(),
  user: z.string().nullable().optional(),
});

const FeedbackSchema = z.object({
  feedback: z.boolean(),
  comments: z.string().optional(),
  runId: z.string()
});


export { RequestChatBodySchema, FeedbackSchema, InputMessageSchema, DocsOptionsSchema };
export { AgentSchema, AIChatRequestBodySchema };