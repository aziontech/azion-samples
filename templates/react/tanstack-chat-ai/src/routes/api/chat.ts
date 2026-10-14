import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import {
  chat,
  chatParamsFromRequest,
  toServerSentEventsResponse,
} from "@tanstack/ai";
import { createOpenaiChatCompletions } from "@tanstack/ai-openai";

type AzionStreamChunk =
  | { type: "RUN_STARTED"; threadId: string; runId: string; timestamp: number }
  | {
      type: "TEXT_MESSAGE_START";
      messageId: string;
      role: "assistant";
      timestamp: number;
    }
  | {
      type: "TEXT_MESSAGE_CONTENT";
      messageId: string;
      delta: string;
      timestamp: number;
    }
  | { type: "TEXT_MESSAGE_END"; messageId: string; timestamp: number }
  | {
      type: "RUN_FINISHED";
      threadId: string;
      runId: string;
      timestamp: number;
      finishReason: string;
    }
  | {
      type: "RUN_ERROR";
      threadId: string;
      runId: string;
      timestamp: number;
      error: { message: string; code?: string };
    };

type AnthropicStreamChunk =
  | { type: "RUN_STARTED"; threadId: string; runId: string; timestamp: number }
  | {
      type: "TEXT_MESSAGE_START";
      messageId: string;
      role: "assistant";
      timestamp: number;
    }
  | {
      type: "TEXT_MESSAGE_CONTENT";
      messageId: string;
      delta: string;
      timestamp: number;
    }
  | { type: "TEXT_MESSAGE_END"; messageId: string; timestamp: number }
  | {
      type: "RUN_FINISHED";
      threadId: string;
      runId: string;
      timestamp: number;
      finishReason: string;
    }
  | {
      type: "RUN_ERROR";
      threadId: string;
      runId: string;
      timestamp: number;
      error: { message: string; code?: string };
    };

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function* anthropicStream(
  messages: Array<{ role: string; content: string }>,
  model: string,
  apiKey: string,
  threadId: string,
  runId: string,
): AsyncIterable<AnthropicStreamChunk> {
  const msgId = generateId();

  yield { type: "RUN_STARTED", threadId, runId, timestamp: Date.now() };

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({ model, max_tokens: 4096, messages, stream: true }),
  });

  if (!response.ok) {
    const err = await response.text();
    yield {
      type: "RUN_ERROR",
      threadId,
      runId,
      timestamp: Date.now(),
      error: { message: err, code: String(response.status) },
    };
    return;
  }

  yield {
    type: "TEXT_MESSAGE_START",
    messageId: msgId,
    role: "assistant",
    timestamp: Date.now(),
  };

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      try {
        const chunk = JSON.parse(line.slice(6));
        if (
          chunk.type === "content_block_delta" &&
          chunk.delta?.type === "text_delta"
        ) {
          yield {
            type: "TEXT_MESSAGE_CONTENT",
            messageId: msgId,
            delta: chunk.delta.text,
            timestamp: Date.now(),
          };
        }
      } catch {
        /* skip malformed chunks */
      }
    }
  }

  yield { type: "TEXT_MESSAGE_END", messageId: msgId, timestamp: Date.now() };
  yield {
    type: "RUN_FINISHED",
    threadId,
    runId,
    timestamp: Date.now(),
    finishReason: "stop",
  };
}

async function* azionCopilotStream(
  messages: Array<{ role: string; content: string }>,
  credential: string,
  authType: "cookie" | "token",
  threadId: string,
  runId: string,
): AsyncIterable<AzionStreamChunk> {
  const msgId = generateId();

  yield { type: "RUN_STARTED", threadId, runId, timestamp: Date.now() };

  const response = await fetch(
    "https://ai.azion.com/copilot/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authType === "cookie"
          ? { Cookie: `azsid=${credential}` }
          : { Authorization: `Token ${credential}` }),
      },
      body: JSON.stringify({ messages, stream: true }),
    },
  );

  if (!response.ok) {
    const err = await response.text();
    yield {
      type: "RUN_ERROR",
      threadId,
      runId,
      timestamp: Date.now(),
      error: { message: err, code: String(response.status) },
    };
    return;
  }

  yield {
    type: "TEXT_MESSAGE_START",
    messageId: msgId,
    role: "assistant",
    timestamp: Date.now(),
  };

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;

      const raw = trimmed.slice(5).trim();
      if (raw === "[DONE]") break;

      try {
        const chunk = JSON.parse(raw);
        const delta = chunk?.choices?.[0]?.delta?.content;
        if (delta) {
          yield {
            type: "TEXT_MESSAGE_CONTENT",
            messageId: msgId,
            delta,
            timestamp: Date.now(),
          };
        }
        if (chunk?.choices?.[0]?.finish_reason === "stop") break;
      } catch {
        /* skip malformed chunks */
      }
    }
  }

  yield { type: "TEXT_MESSAGE_END", messageId: msgId, timestamp: Date.now() };
  yield {
    type: "RUN_FINISHED",
    threadId,
    runId,
    timestamp: Date.now(),
    finishReason: "stop",
  };
}

function toApiMessages(
  messages: Array<{ role: string; content: unknown }>,
): Array<{ role: string; content: string }> {
  return messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({
      role: m.role,
      content:
        typeof m.content === "string"
          ? m.content
          : (m.content as Array<{ type: string; text?: string }>)
              .filter((c) => c.type === "text")
              .map((c) => c.text ?? "")
              .join(""),
    }));
}

async function chatHandler(request: Request): Promise<Response> {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, X-Api-Key, X-Provider, X-Model, X-Azion-Auth-Type",
      },
    });
  }

  const apiKey = request.headers.get("X-Api-Key")?.trim();
  const provider = request.headers.get("X-Provider")?.trim() ?? "openai";
  const model = request.headers.get("X-Model")?.trim();

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "X-Api-Key header required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const params = await chatParamsFromRequest(request);
  const threadId = params.threadId ?? generateId();
  const runId = params.runId ?? generateId();
  const resolvedModel =
    model ?? (provider === "anthropic" ? "claude-haiku-4-5" : "gpt-4o-mini");

  if (provider === "copilot-azion") {
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "X-Api-Key header required (azsid cookie)" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }
    const azionAuthType = (request.headers.get("X-Azion-Auth-Type")?.trim() ??
      "cookie") as "cookie" | "token";
    const apiMessages = toApiMessages(
      params.messages as Array<{ role: string; content: unknown }>,
    );
    const stream = azionCopilotStream(
      apiMessages,
      apiKey,
      azionAuthType,
      threadId,
      runId,
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return toServerSentEventsResponse(stream as AsyncIterable<any>, {
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }

  if (provider === "anthropic") {
    const apiMessages = toApiMessages(
      params.messages as Array<{ role: string; content: unknown }>,
    );
    const stream = anthropicStream(
      apiMessages,
      resolvedModel,
      apiKey,
      threadId,
      runId,
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return toServerSentEventsResponse(stream as AsyncIterable<any>, {
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adapter = createOpenaiChatCompletions(resolvedModel as any, apiKey);
  const stream = chat({
    adapter,
    messages: params.messages,
    threadId,
    runId,
  });

  return toServerSentEventsResponse(stream, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: ({ request }) => chatHandler(request),
      OPTIONS: ({ request }) => chatHandler(request),
    },
  },
});
