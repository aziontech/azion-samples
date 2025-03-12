import { ChatCompletionInvokeResponse, ChatCompletionStreamResponse, StreamEvent } from "../types";
import { AIMessageChunk } from "@langchain/core/messages";
import { RequestChatBodySchema } from "./constants";
import { z } from "zod";

// 
// HELPER TO VALIDATE REQUEST BODIES
// 

/**
 * Validates the request body against the RequestChatBodySchema.
 * @param {Request} request - The request object to validate.
 * @returns {Promise<object>} An object containing the parsed body or an error.
 */
export async function validateRequestBody(
  request: Request
): Promise<{ parsedBody: z.infer<typeof RequestChatBodySchema>, 
      error: any }> {
  try {
    const body = await request.json();
    const parsedBody = RequestChatBodySchema.parse(body);
    return { parsedBody, error: null };
  } catch (error) {
    return { parsedBody: null as any, error };
  }
}

// 
// HELPERS TO PROCESS STREAMS
// 

/**
 * Processes the event stream for streaming responses.
 * @param {ReadableStream<StreamEvent>} eventStream - The stream of events to process.
 * @param {WritableStreamDefaultWriter<any>} writer - The writer to write encoded data.
 * @param {TextEncoder} encoder - The encoder to encode the data.
 */
export async function processEventStream(
  eventStream: ReadableStream<StreamEvent>,
  writer: WritableStreamDefaultWriter<any>,
  encoder: any, // TODO: fix this
  runId: string
): Promise<void> {

  const writeEncodedData = async (chunk: AIMessageChunk, isFinal = false) => {
    const chatCompletions = transformToChatCompletions(chunk, runId, true, isFinal);
    await writer.write(encoder.encode(`data: ${JSON.stringify(chatCompletions)}\n\n`));
  };

  const processStreamEvent = async ({ event, data, tags }: StreamEvent) => {

    if (event === 'on_chat_model_stream' && data.chunk.content && (tags?.includes('agent'))) {
      await writeEncodedData(data.chunk, false);
    }
  };
  
  try {
    for await (const streamEvent of eventStream) {
      try {
        await processStreamEvent(streamEvent);
      } catch(streamError) {
        console.error(streamError);
        await writer.write(encoder.encode(`error: {"exception": "${streamError}"}\n\n`));
      }
    }

    await writeEncodedData(new AIMessageChunk(''), true);
 
    await writer.write(encoder.encode('data: [DONE]\n\n'));
  } catch (error) {
    console.error("Error streaming graph:",error);
    await writer.write(encoder.encode(`error: {"exception": "${error}"}\n\n`));
  } finally {
    await writer.close();
  }
}

/**
 * Creates a transform stream with a writer and encoder.
 * @returns {Object} An object containing the readable stream, writer, and encoder.
 */
export function createTransformStream(
): {
  readable: ReadableStream,
  writer: WritableStreamDefaultWriter,
  encoder: any // TODO: fix this
} {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();
  return { readable, writer, encoder };
}

/**
 * Checks if a ReadableStream contains an error message and returns the original stream
 * @param {ReadableStream} stream - The stream to check for errors
 * @returns {Promise<ReadableStream>} The original stream
 * @throws {Error} If an error message is found in the stream
 */
export async function validateStreamForErrors(
  stream: ReadableStream
): Promise<ReadableStream> {
  try {
    // Split the stream into two so we don't consume the original
    const [checkStream, originalStream] = stream.tee();
    
    const reader = checkStream.getReader();
    const { value } = await reader.read();
    
    // Convert the stream chunk to string
    const text = new TextDecoder().decode(value);
    
    // Throw error if error message found
    if (text.toLowerCase().includes('error: {"exception": ')) {
      throw new Error(text);
    }

    return originalStream;
  } catch (error) {
    console.error('Error validating stream for errors:', error);
    throw error;
  }
}

// 
// HELPERS TO TRANSFORM RESPONSES INTO OPENAI CHAT COMPLETIONS
// 

/**
 * Transforms the AI response into a format compatible with OpenAI's chat completions.
 * @param {AIMessageChunk | undefined} invokeResponse - The AI response to transform.
 * @param {boolean} stream - Whether the response is part of a stream.
 * @param {boolean} finalMessage - Whether this is the final message in the stream.
 * @returns {ChatCompletionInvokeResponse | ChatCompletionStreamResponse} A transformed chat completion object.
 */
export function transformToChatCompletions(
  invokeResponse: AIMessageChunk,
  runId: string,
  stream: boolean,
  finalMessage: boolean = false
): ChatCompletionInvokeResponse | ChatCompletionStreamResponse {
  if (!stream) {
    return transformToInvokeResponse(invokeResponse, runId);
  } else if (finalMessage) {
    return transformToLastMessage(runId);
  } else {
    return transformToStreamResponse(invokeResponse, runId);
  }
}

/**
 * Transforms the AI response into a chat completion stream response.
 * @param {AIMessageChunk} aiResponse - The AI response to transform.
 * @returns {ChatCompletionStreamResponse} A transformed chat completion stream response.
 */
function transformToStreamResponse(
  aiResponse: AIMessageChunk,
  runId: string,
): ChatCompletionStreamResponse {
  const created = Math.floor(Date.now() / 1000);
  return {
    choices: [
      {
        finish_reason: null,
        index: 0,
        delta: {content: aiResponse.content || ''},
        logprobs: null,
      },
    ],
    created: created,
    id: runId,
    model: 'azion',
    system_fingerprint: 'fp_'+runId.slice(-10),
    object: 'chat.completion.chunk'
  };
}

/**
 * Transforms the last message into a chat completion stream response.
 * @returns {ChatCompletionStreamResponse} A transformed chat completion stream response.
 */
export function transformToLastMessage(
  runId: string
): ChatCompletionStreamResponse {
  const created = Math.floor(Date.now() / 1000);
  return {
    choices: [
      {
        finish_reason: 'stop',
        index: 0,
        delta: {},
        logprobs: null,
      },
    ],
    created: created,
    id: runId,
    model: 'azion',
    system_fingerprint: 'fp_'+runId.slice(-10),
    object: 'chat.completion.chunk'
  };
}

/**
 * Transforms the AI response into a chat completion invoke response.
 * @param {AIMessageChunk} aiResponse - The AI response to transform.
 * @returns {ChatCompletionInvokeResponse} A transformed chat completion invoke response.
 */
export function transformToInvokeResponse(
  aiResponse: AIMessageChunk,
  runId: string,
): ChatCompletionInvokeResponse {
  const created = Math.floor(Date.now() / 1000);
  return {
    choices: [
      {
        finish_reason:'stop',
        index: 0,
        message: {
              content: aiResponse.content || '',
               role: 'assistant' ,
            },
        logprobs: null,
      },
    ],
    created: created,
    id: runId,
    model: 'azion',
    object:'chat.completion',
    system_fingerprint: aiResponse.response_metadata.system_fingerprint,
    usage: {
      completion_tokens:aiResponse.response_metadata.completion_tokens,
      prompt_tokens:aiResponse.response_metadata.prompt_tokens,
      total_tokens: aiResponse.response_metadata.total_tokens,
      completion_tokens_details: {reasoning_tokens: 0},
    },
  };
}

