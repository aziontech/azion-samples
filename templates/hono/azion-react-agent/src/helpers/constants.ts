import { z } from 'zod'

export const AZION_TOKEN = process.env.AZION_TOKEN;
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
export const EMBEDDING_MODEL = 'text-embedding-3-small'
export const OPENAI_MODEL = 'gpt-4o'

export const VECTOR_STORE_DB_NAME = process.env.VECTOR_STORE_DB_NAME || 'vectorstore'
export const VECTOR_STORE_TABLE_NAME = 'vectors'
export const MESSAGE_STORE_DB_NAME = process.env.MESSAGE_STORE_DB_NAME || 'messagestore'
export const MESSAGE_STORE_TABLE_NAME = 'messages'

export const SYSTEM_PROMPT = "You are a helpful assistant."

export const AUTHENTICATION_TYPE = process.env.AUTHENTICATION_TYPE
export const AUTHENTICATION_TOKEN = process.env.AUTHENTICATION_TOKEN
export const CLERK_PUBLISHABLE_KEY = process.env.CLERK_PUBLISHABLE_KEY
export const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY

export const MessageSchema = z.object({
    role: z.enum(['system', 'assistant', 'user']),
    content: z.string().max(64000),
  });
  
export const RequestChatBodySchema = z.object({
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
