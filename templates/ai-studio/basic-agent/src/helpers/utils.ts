import { AIMessage, AIMessageChunk, BaseMessage } from '@langchain/core/messages';
import { LangChainTracer, LangChainTracerFields, Run } from '@langchain/core/tracers/tracer_langchain';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import {
    AzionSchema,
    ChatCompletionInvokeResponse, ChatCompletionStreamResponse,
    ChatParameters,
    Configurable,
    CustomRequest,
    DocsResponse,
    ExtractRequestParamsResult,
    LangGraphContext,
    Message,
    RequestChatBody,
    StreamEvent,
    ValidateRequestBodyResult,
} from '../types';
import { RequestChatBodySchema } from './schema';

/**
 * Validates the request body against the RequestChatBodySchema.
 * @param {any} body - The request body to validate.
 * @returns {Promise<object>} An object containing the parsed body or an error.
 f*/
export async function validateRequestBody(
    body: unknown,
    schema: z.ZodTypeAny = RequestChatBodySchema
): Promise<ValidateRequestBodyResult> {
    try {
        const parsedBody = schema.parse(body);

        return { parsedBody, error: null };

    } catch (error) {
        console.log("Error validating request body: ", error)
        return { parsedBody: null, error };
    }
}

/**
 * Extracts chat parameters and validates them.
 * @param {RequestChatBody} parsedBody - The parsed request body to extract parameters from.
 * @returns An object containing extracted and validated chat parameters.
 */
export function extractChatParameters(
    parsedBody: RequestChatBody
): ChatParameters {

    const { azion, stream, messages, variables } = parsedBody;

    const sessionId = azion?.session_id || uuidv4();

    return { errors: null, azion, sessionId, messages, stream: stream || false, variables };
}

/**
 * Generates a fingerprint value based on an input string.
 * @param {string} input - The input string to generate the value from.
 * @param {string} prefix - The prefix to add to the generated value.
 * @param {number} length - The desired length of the generated value.
 * @returns {string} A fingerprint string value.
 */
function generateFingerprintValue(
    input: string,
    prefix: string,
    length: number
): string {
    const hash = Array.from(input).reduce(
        (acc, char) => ((acc << 5) - acc + char.charCodeAt(0)) | 0,
        0
    );
    const hashString = Math.abs(hash).toString(36);
    const paddedHash = hashString.padEnd(length - prefix.length, hashString);
    return `${prefix}${paddedHash.slice(0, length - prefix.length)}`;
}

/**
 * Transforms the AI response into a format compatible with chat completions.
 * @param {AIMessageChunk | undefined} invokeResponse - The AI response to transform.
 * @param {boolean} stream - Whether the response is part of a stream.
 * @param {boolean} finalMessage - Whether this is the final message in the stream.
 * @returns {ChatCompletionInvokeResponse | ChatCompletionStreamResponse} A transformed chat completion object.
 */
function transformToChatCompletions(
    invokeResponse: AIMessageChunk,
    runId: string,
    stream: boolean,
    finalMessage: boolean = false
): ChatCompletionInvokeResponse | ChatCompletionStreamResponse | null {
    try {
        if (!stream) {
            return transformToInvokeResponse(invokeResponse, runId);
        } else if (finalMessage) {
            return transformToLastMessage(runId);
        } else {
            return transformToStreamResponse(invokeResponse, runId);
        }
    } catch (error) {
        console.error('Error transforming to chat completions:', error);
        return null;
    }
}

/**
 * Handles the system prompt based on the context provided.
 * @param {Record<string, any> | LangGraphContext} context - The context object containing metadata.
 * @param {string} systemPrompt - The default system prompt to use if no context is provided.
 * @returns {string} The resolved system prompt. If the context contains a system_prompt, it will be used instead of the default one.
 */
function handleSystemPrompt(context: Record<string, any> | LangGraphContext, systemPrompt: string): string {
    if (context.metadata.system_prompt) {
        return context.metadata.system_prompt;
    }
    return systemPrompt;
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
                delta: { content: aiResponse.content || '' },
                logprobs: null,
            },
        ],
        created: created,
        id: runId,
        model: 'azion',
        system_fingerprint: generateFingerprintValue(created.toString(), 'fp_', 10),
        object: 'chat.completion.chunk'
    };
}

/**
 * Transforms the AI response into a chat completion invoke response.
 * @param {AIMessageChunk} aiResponse - The AI response to transform.
 * @returns {ChatCompletionInvokeResponse} A transformed chat completion invoke response.
 */
function transformToInvokeResponse(
    aiResponse: AIMessageChunk,
    runId: string,
): ChatCompletionInvokeResponse {
    const created = Math.floor(Date.now() / 1000);
    return {
        choices: [
            {
                finish_reason: 'stop',
                index: 0,
                message: {
                    content: aiResponse.content || '',
                    role: 'assistant',
                },
                logprobs: null,
            },
        ],
        created: created,
        id: runId,
        model: 'azion',
        object: 'chat.completion',
        system_fingerprint: generateFingerprintValue(created.toString(), 'fp_', 10),
        usage: {
            completion_tokens: aiResponse.response_metadata?.estimatedTokenUsage?.completionTokens || 0,
            prompt_tokens: aiResponse.response_metadata?.estimatedTokenUsage?.promptTokens || 0,
            total_tokens: aiResponse.usage_metadata?.total_tokens || 0,
            completion_tokens_details: { reasoning_tokens: 0 },
        },
    };
}

function transformToDocsResponse(
    aiResponse: any[], // TODO: fix this type
): DocsResponse[] {
    try {
        const result = aiResponse
            .filter(msg => msg.tool_call_id && msg.content)
            .map(msg => ({
                tool: msg.name,
                response: msg.content
            }));

        return result;
    } catch (error) {
        console.error("Error in transformToDocsResponse", error)
        return [];
    }
}

/**
 * Transforms the last message into a chat completion stream response.
 * @returns {ChatCompletionStreamResponse} A transformed chat completion stream response.
 */
function transformToLastMessage(
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
        system_fingerprint: generateFingerprintValue(created.toString(), 'fp_', 10),
        object: 'chat.completion.chunk'
    };
}

/**
 * Resolves the token from the content of each message or from the request headers.
 * @param {Message[]} content - The messages to extract the token from.
 * @param {Request} request - The request object to extract the token from.
 * @returns {string | undefined} The extracted token or undefined if no token is found.
 */
function resolveToken(
    request: Request,
    url: string
): string | undefined {

    if (request.headers.get('Authorization')) {
        return request.headers.get('Authorization')?.split(' ')[1];
    }

    let cookieName = 'azsid'

    if (url.includes('stage-ai')) {
        cookieName = cookieName + '_stg'
    }

    if (request.headers.get('Cookie')) {

        const cookieHeader = request.headers.get('Cookie')

        const cookie = cookieHeader?.split(cookieName + '=')[1].split(';')[0]

        return cookie
    }

    return undefined;
}


/**
 * Returns a string with the error message from the API.
 * @param {number} status - The status code of the error.
 * @param {any} data - The data of the error.
 * @returns {string} A string with the error message from the API.
 */
function apiErrorMessage(
    status: number,
    data: any
): string {
    if (status === 401) {
        return 'ERROR: The token is invalid or expired. Please, try again.';
    } else if (status === 400) {
        return 'ERROR: You are not authorized to access this resource. Please, try again.';
    } else {
        return `ERROR: ${status}`;
    }
}

/**
 * Creates input messages for the AI model from the given messages.
 * @param {Message[]} messages - The messages to transform into input messages.
 * @returns {Message[]} An array containing the transformed input messages.
 */
function createInputMessages(
    messages: Message[]
): Message[] {
    return messages.map((msg: Message) => {
        // Handle string content
        if (typeof msg.content === 'string' && msg.role === 'user') {
            return {
                ...msg,
                content: `${msg.content} (current date and time: ${new Date().toISOString()})`
            };
        }

        if (Array.isArray(msg.content) && msg.role === 'user') {

            const textContents = msg.content.filter(c => c.type === 'text');

            if (textContents.length > 0) {
                const lastTextIndex = msg.content.lastIndexOf(textContents[textContents.length - 1]);

                const updatedContent = [...msg.content];

                if (lastTextIndex !== -1) {
                    updatedContent[lastTextIndex] = {
                        ...updatedContent[lastTextIndex],
                        text: `${updatedContent[lastTextIndex].text} (current date and time: ${new Date().toISOString()})`
                    };
                }

                return {
                    ...msg,
                    content: updatedContent
                };
            }
        }

        return msg;
    });
}

/**
 * Defines the project based on the requested URL.
 * @param {string} url - The URL to evaluate.
 * @returns {string | undefined} The appropriate project name based on the URL.
 */
function defineProject(
    url: string,
    app: string | undefined
): string {
    let projectName = '';
    if (url.includes('stage-ai')) {
        projectName = 'azion-copilot-stage';
    } else if (url.includes('ai')) {
        projectName = 'azion-copilot-production';
    } else if (url.includes('localhost')) {
        projectName = 'azion-copilot-local';
    } else {
        throw new Error('different url requested');
    }

    return projectName;
}

/**
 * Creates a configurable object for the chat session.
 * @param {AzionSchema | undefined} azion - The Azion parameters to identify the users.
 * @param {unknown} variables - Variables from the client (e.g., OpenWebUI).
 * @param {Record<string, any> | undefined} args - Arbitrary arguments provided by the caller.
 * @param {string} url - The URL to evaluate.
 * @param {string} sessionId - The session ID.
 * @param {string | undefined} ip - The IP address.
 * @param {string | undefined} token - The token.
 * @param {string} accountId - The authenticated account id.
 * @returns {Configurable} The configurable object.
 */
function createConfigurable(
    variables: unknown,
    args: Record<string, any> | undefined,
    url: string,
    sessionId: string,
    ip: string | undefined,
    token: string | undefined,
    accountId: string
): Configurable {
    let userName = ''
    if (variables && Object.prototype.hasOwnProperty.call(variables, '{{USER_NAME}}')) {
        // Type assertion because variables is unknown
        userName = (variables as Record<string, any>)['{{USER_NAME}}'];
    }

    return {
        thread_id: sessionId,
        user_name: userName,
        token: token,
        ip: ip,
        account_id: accountId,
        // Generic arguments exposed to the graph via context.metadata.args
        args: args
    }
}

/**
 * Extracts the URL and body from the request.
 * @param {Request} request - The incoming request object.
 * @returns {Promise<{url: string, body: any}>} A promise that resolves to an object containing the URL and body.
 */
async function extractRequestParams(
    request: CustomRequest
): Promise<ExtractRequestParamsResult> {
    try {
        const url = request.url;
        let ip: string | undefined;

        if (request.metadata) {
            ip = request.metadata["remote_addr"]
        } else {
            ip = undefined
        }

        const body = await request.json();

        const token = resolveToken(request, url);

        return { requestParams: { url, body, ip, token }, error: null };
    } catch (error) {
        console.error('Error extracting request params:', error);
        return { requestParams: null, error: error };
    }
}

/**
 * Processes the event stream for streaming responses.
 * @param {ReadableStream<StreamEvent>} eventStream - The stream of events to process.
 * @param {WritableStreamDefaultWriter<any>} writer - The writer to write encoded data.
 * @param {TextEncoder} encoder - The encoder to encode the data.
 */
async function processEventStream(
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
        if (event === 'on_chat_model_stream' && data.chunk.content && ((tags?.includes('agent')) || (tags?.includes('announcer')))) {
            await writeEncodedData(data.chunk, false);
        }
    }

    try {
        for await (const streamEvent of eventStream) {
            try {
                await processStreamEvent(streamEvent);
            } catch (streamError) {
                console.error(streamError);
                await writer.write(encoder.encode(`error: {"exception": "${streamError}"}\n\n`));
            }
        }

        await writeEncodedData(new AIMessageChunk(''), true);

        await writer.write(encoder.encode('data: [DONE]\n\n'));
    } catch (error) {
        console.error("Error streaming graph:", error);
        await writer.write(encoder.encode(`error: {"exception": "${error}"}\n\n`));
    } finally {
        await writer.close();
    }
}

/**
 * @returns {Object} An object containing the readable stream, writer, and encoder.
 */
function createTransformStream(
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
async function validateStreamForErrors(
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

/**
 * Returns the descriptions of the tools that were called in the last message.
 * @param {any} lastMessage - The last message to process.
 * @param {any} tools - The tools to process.
 * @returns {string} The descriptions of the tools that were called in the last message.
 */
export function getCalledToolsDescriptions(
    lastMessage: any,
    tools: any
): string {
    try {
        const calledTools = lastMessage.tool_calls.map((tool: any) => tool.name);

        const toolsDescriptions = tools
            .filter((tool: any) => calledTools.includes(tool.name))
            .map((tool: any) => `${tool.name}: ${tool.description}`);

        return toolsDescriptions.join('\n\n');
    } catch (error) {
        console.error("Error generating called tools descriptions:", error);
        return ""
    }
}

/**
 * Returns the last 6 messages from the given array of messages.
 * @param {any} messages - The array of messages to process.
 * @param {number} n - The number of messages to return.
 * @returns {string} The last 6 messages in the format "Role: \nContent".
 */
export function getPastMessages(
    messages: any,
    n: number = 6
): string {
    return messages.slice(-n).map((message: any) => {
        try {
            if (('role' in message && (message.role == 'assistant' || message.role == 'ai' || message.role == 'system')) || (typeof message.getType == 'function' && (message.getType() == 'system' || message.getType() == 'ai'))) {
                return "Assistant: \n" + message.content
            }

            if (('role' in message && message.role == 'user') || (typeof message.getType == 'function' && message.getType() == 'human')) {
                return "User: \n" + message.content
            }
        }
        catch (error) {
            console.error("Error processing message:", error);
            return "";
        }
    }).join('\n\n')
}

export {
    createConfigurable, createInputMessages, createTransformStream, defineProject, extractRequestParams,
    handleSystemPrompt, processEventStream, resolveToken,
    transformToChatCompletions, transformToDocsResponse, transformToInvokeResponse,
    transformToLastMessage, transformToStreamResponse, validateStreamForErrors
};

