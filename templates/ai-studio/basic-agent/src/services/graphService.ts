import { AIMessageChunk } from "@langchain/core/messages";
import { v4 as uuidv4 } from 'uuid';
import { createTransformStream, processEventStream, transformToChatCompletions, transformToDocsResponse, validateStreamForErrors } from "../helpers/utils";
import { Config, GraphServiceDocsResponse, GraphServiceResponse, Message } from "../types";

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
   */
  private graph: any
  private messages: Message[]
  private runId: string
  private stream: boolean
  private configs: Config

  /**
   * Constructor for the GraphService class
   * 
   * @param {Message[]} messages - The messages to be processed by the graph
   * @param {boolean} stream - Whether to run in streaming mode. Default is false
   * @param {Configurable} configs - The configurable object
   */
  constructor(
    messages: Message[],
    stream: boolean = false,
    configs: Config,
    graph: any //TODO: fix type
  ) {
    this.graph = graph
    this.messages = messages
    this.runId = uuidv4();
    this.stream = stream
    this.configs = configs
  }

  /**
   * Runs the graph.
   * 
   * @returns {Promise<GraphServiceResponse>} A Promise that resolves to a GraphServiceResponse object.
   */
  async run(): Promise<GraphServiceResponse> {
    if (this.stream) {
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

      const eventStreams = this.graph.streamEvents({ messages: this.messages },
        {
          version: "v2",
          configurable: { ...this.configs.configurable },
          runId: this.configs.run_id
        });

      const [userEventStream, dbStream] = eventStreams.tee();

      const { readable, writer, encoder } = createTransformStream();

      processEventStream(userEventStream, writer, encoder, this.runId);

      const validStream = await validateStreamForErrors(readable);

      return { success: true, data: validStream }
    } catch (error) {
      return { success: false, error: "Error streaming graph: " + error }
    }
  }

  /**
   * Invokes the graph.
   * 
   * @returns {Promise<GraphServiceResponse>} A Promise that resolves to a GraphServiceResponse object.
   */
  async invokeGraph(): Promise<GraphServiceResponse> {
    try {
      const invokeResponse = await this.graph.invoke({ messages: this.messages },
        {
          configurable: { ...this.configs.configurable },
          callbacks: this.configs.tracer,
          runId: this.configs.run_id
        });

      return { success: true, data: JSON.stringify(transformToChatCompletions(invokeResponse.messages.at(-1), this.runId, false)) }
    } catch (error) {
      console.error("Error invoking graph: " + error)
      return { success: false, error: "Error invoking graph: " + JSON.stringify(error) }
    }
  }
}