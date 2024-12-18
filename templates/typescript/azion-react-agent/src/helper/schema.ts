import { z } from 'zod';

const MessageSchema = z.object({
  role: z.enum(['system', 'assistant', 'user']),
  content: z.string().max(64000),
});

const RequestChatBodySchema = z.object({
  messages: z.array(MessageSchema),
  stream: z.boolean().default(false).optional(),
  session_id: z.string().optional(),
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

export { MessageSchema, RequestChatBodySchema };
