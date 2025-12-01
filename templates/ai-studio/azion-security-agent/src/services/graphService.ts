import { MESSAGE_STORE_DB_NAME, MESSAGE_STORE_TABLE_NAME } from "../helpers/constants";
import { GraphServiceResponse, Message } from "../types";
import { createTransformStream, validateStreamForErrors, transformToChatCompletions, processEventStream } from "../helpers/utils";
import { EdgeSQLTracerService } from "./edgeSqlTracerService";
import { v4 as uuidv4 } from 'uuid';

/**
 * GraphService
 * 
 * Service to run the graph from the agent
 * 
 * @class
 */

export class GraphService {

  /**
   * @property {any} graph - The graph instance
   * @property {string} runId - The run id
   * @property {EdgeSQLTracerService} tracer - The tracer service
   */
  private graph: any
  private messages: Message[]
  private runId: string
  private args: Record<string, any>
  private tracer: EdgeSQLTracerService
  private stream: boolean

  /**
   * Constructor for the GraphService class
   * 
   * @param {Message[]} messages - The messages to be processed by the graph
   * @param {Record<string, any>} args - The arguments for the graph
   * @param {boolean} stream - Whether to run in streaming mode. Default is false
   */
  constructor(
      messages: Message[],
      args: Record<string, any>,
      stream: boolean = false,
      graph?: any
  ) {
      this.graph =  graph
      this.messages = messages
      this.runId = uuidv4();
      this.args = args
      this.stream = stream
      this.tracer = new EdgeSQLTracerService(stream ? 'stream' : 'invoke', MESSAGE_STORE_DB_NAME, this.args.session_id)
  }

  /**
   * Runs the graph.
   * 
   * @returns {Promise<GraphServiceResponse>} A Promise that resolves to a GraphServiceResponse object.
   */
  async run(): Promise<GraphServiceResponse> {
      if(this.stream) {
          return await this.streamGraph()
      }
      return await this.invokeGraph()
  }

  /**
   * Streams the graph.
   * 
   * @returns {Promise<GraphServiceResponse>} A Promise that resolves to a GraphServiceResponse object.
   */
  async streamGraph(): Promise<GraphServiceResponse> {
      try {
        this.tracer.updateInput(this.messages, this.runId)

        const eventStreams = this.graph.streamEvents({ messages: this.messages }, { version: "v2", configurable: {
            systemPrompt: this.args.systemPromptTemplate
        } });
    
        const [userEventStream, dbStream] = eventStreams.tee();
    
        const { readable, writer, encoder } = createTransformStream();
    
        processEventStream(userEventStream, writer, encoder, this.runId);
    
        const validStream = await validateStreamForErrors(readable);
    
        // this.tracer.run(dbStream);

        return {success: true, data: validStream}
      } catch (error) {
        return {success: false, error: "Error streaming graph: " + error}
      }
    }

  /**
   * Invokes the graph.
   * 
   * @returns {Promise<GraphServiceResponse>} A Promise that resolves to a GraphServiceResponse object.
   */
  async invokeGraph(): Promise<GraphServiceResponse> {
      try {
        this.tracer.updateInput(this.messages, this.runId)
    
        const invokeResponse = await this.graph.invoke({ messages: this.messages }, { configurable: {
          systemPrompt: this.args.systemPromptTemplate
        } });
    
        // this.tracer.run(invokeResponse.messages)
        
        const chatCompletions = transformToChatCompletions(invokeResponse.messages.at(-1), this.runId, false);
        
        return {success: true, data: JSON.stringify(chatCompletions)}
        
      } catch (error) {
        return {success: false, error: "Error invoking graph: " + JSON.stringify(error)}
      }
    }

}


