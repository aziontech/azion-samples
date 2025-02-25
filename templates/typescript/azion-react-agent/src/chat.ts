import type { Message } from "./types";
import { graph } from "./graph";
import {
  processEventStream, 
  createTransformStream, 
  transformToChatCompletions, 
  validateRequestBody, 
  validateStreamForErrors} from "./helper/utils";
import { v4 as uuidv4 } from 'uuid';
import { AzionEdgeTracer } from "./helper/tracer";
import { MESSAGE_STORE_DB_NAME, MESSAGE_STORE_TABLE_NAME } from "./helper/config";

/**
 * @param {Request} request - The request object.
 * @returns {Promise<Response>} A Promise that resolves to a Response object.
 */
async function handleChatRequest(
    request: Request
  ): Promise<Response> {
    const args = {
      session_id: uuidv4(),
    }
  
    // Validate the request body
    const { parsedBody, error } = await validateRequestBody(request);
  
    // Return error response if validation failed
    if (error) {
      console.error("Error parsing body: ", error)
      return new Response(JSON.stringify(error), { status: 400 })
    }
  
    // Extract messages and stream flag from parsed body
    const { messages, stream, session_id } = parsedBody;
  
    // If session_id is provided, use it
    if (session_id) {
      args.session_id = session_id
    }
  
    // Generate unique run ID
    const runId = uuidv4();
  
    // Handle streaming vs non-streaming responses
    if (stream) {
      return streamGraph(messages, runId, args);
    } 
  
    return invokeGraph(messages, runId, args);
  }
  
  /**
   * @param {string[]} messages - The messages to stream the graph with.
   * @returns {Promise<Response>} A Promise that resolves to a Response object.
   */
  async function streamGraph(
    messages: Message[],
    runId: string,
    args: Record<string, any>
  ): Promise<Response> {
    let tracer = new AzionEdgeTracer('stream', MESSAGE_STORE_DB_NAME, MESSAGE_STORE_TABLE_NAME, args.session_id)
    try {
      // Update the tracer with the input messages
      tracer.updateInput(messages, runId)
  
      // Stream the events from the graph
      const eventStreams = graph.streamEvents({ messages }, { version: "v2", configurable: {
        systemPrompt: args.systemPromptTemplate
      } });
  
      // Since the response body cannot be consumed more than once, we need to split the stream into two streams
      const [userEventStream, dbStream] = eventStreams.tee();
  
      // Process the user stream to ensure the response in the wanted format
      const { readable, writer, encoder } = createTransformStream();
  
      processEventStream(userEventStream, writer, encoder, runId);
  
      // Check if the stream contains an error
      const validStream = await validateStreamForErrors(readable);
  
      // Process the db stream to update the tracer
      tracer.run(dbStream);
  
      // Return the response to the user
      return new Response(validStream, { status: 200 });
    } catch (error) {
      const errorMessage = "Error streaming graph: " + error
      console.error(errorMessage)
      return new Response(errorMessage, { status: 500 });
    }
  }
  
  /**
   * @param {string[]} messages - The messages to invoke the graph with.
   * @returns {Promise<Response>} A Promise that resolves to a Response object.
   */
  async function invokeGraph(
    messages: Message[],
    runId: string,
    args: Record<string, any>
  ): Promise<Response> {
    let tracer = new AzionEdgeTracer('invoke', MESSAGE_STORE_DB_NAME, MESSAGE_STORE_TABLE_NAME, args.session_id)
    try {
      // Update the tracer with the input messages
      tracer.updateInput(messages, runId)
  
      // Invoke the graph
      const invokeResponse = await graph.invoke({ messages }, { configurable: {
        systemPrompt: args.systemPromptTemplate
      } });
  
      // Update the tracer with the output messages
      tracer.run(invokeResponse.messages)
      
      // Transform the output messages to the wanted format
      const chatCompletions = transformToChatCompletions(invokeResponse.messages.at(-1), runId, false);
  
      // Return the response to the user
      return new Response(`${JSON.stringify(chatCompletions)}`, { status: 200 });
      
    } catch (error) {
      const errorMessage = "Error invoking graph: " + JSON.stringify(error)
      console.error(errorMessage)
      return new Response(errorMessage, { status: 500 });
    }
  }

  export { handleChatRequest }