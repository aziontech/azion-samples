import { Message, StreamEvent } from "../types";
import { createDatabase, useExecute } from "azion/sql";

/**
 * Tracer class for AzionEdgeSQL. It's used to store the all the messages of the agent.
 */
export class AzionEdgeTracer {
  /** Database name for storing messages */
  databaseName: string
  /** Table name for storing messages */
  tableName: string
  /** Unique identifier for the current run */
  runId?: string
  /** Array of metadata messages for the run */
  runMetadata?: string[]
  /** Array of input messages */
  inputMessages: string[]
  /** Output message content */
  outputMessages: string
  /** Mode flag indicating stream vs invoke */
  mode: 'stream' | 'invoke'
  /** Session id */
  sessionId: string
  constructor(
    mode: 'stream' | 'invoke',
    databaseName: string,
    tableName: string,
    sessionId: string
  ) {
    this.databaseName = databaseName
    this.tableName = tableName
    this.runId = ''
    this.runMetadata = []
    this.inputMessages = []
    this.outputMessages = ''
    this.mode = mode
    this.sessionId = sessionId
  }

  /**
   * Update the input messages and run id
   * @param {any} messages - The messages to update the input messages and run id
   * @param {string} runId - The run id to update the run id
   */
  updateInput(
    messages:Message[],
    runId:string
  ): void {
    this.inputMessages = messages.map((message:Message) => JSON.stringify(message))
    this.runId = runId
  }

  /**
   * Update the output messages and metadata - Stream mode
   * @param {ReadableStream<StreamEvent>} eventStream - The event stream to update the output messages and metadata
   */
  async updateStreamOutput(
    eventStream: ReadableStream<StreamEvent>
  ): Promise<void> {
    let metadata = []
    for await (const streamEvent of eventStream) {
      // Check if the event is a chat model stream, if has a chunk with content and if belongs to the agent
      if (streamEvent.event === 'on_chat_model_stream' && streamEvent.data.chunk.content && (streamEvent.tags?.includes('agent'))) {
        this.outputMessages += streamEvent.data.chunk.content
      }

      // Check if the event is a chain end and if it has output messages
      if (streamEvent.event === 'on_chain_end' && streamEvent.data) {
        metadata.push(streamEvent.data.output.messages)
      }
    }
    // Collect the last message, that contains all the run metadata
    this.runMetadata = metadata.at(-1).map((message:any) => JSON.stringify(message))
  }

  /**
   * Update the output messages and metadata - Invoke mode
   * @param {any} messages - The messages to update the output messages and metadata
   */
  updateInvokeOutput(
    messages:Message[]
  ): void {
    this.outputMessages = messages.at(-1)?.content || ''
    this.runMetadata = messages.map(message => JSON.stringify(message))
  }

  /**
   * Run the tracer
   * @param {any | ReadableStream<StreamEvent>} outputMessages - The output messages to update the output messages and metadata
   */
  async run(
    outputMessages: any | ReadableStream<StreamEvent>
  ): Promise<void> {
    try {
      if (this.mode === 'stream') {
        await this.updateStreamOutput(outputMessages)
      } else {
        this.updateInvokeOutput(outputMessages)
      }
    } catch (error) {
      console.error("Error processing stream:", error)
      throw error
    } finally {
      this.save().catch(error => {
        console.error("Error saving trace:", error)
      })
    }
  }

  /**
   * Save the trace into the database
   */
  async save() {
    console.log("Saving trace into ", this.databaseName, "for session ", this.sessionId)
    const createdAt = new Date().toISOString()
    const statements = [`INSERT INTO ${this.tableName} (session_id, run_id, input_messages, output_messages, run_metadata, created_at) VALUES ('${this.sessionId}', '${this.runId}', '${this.inputMessages}', '${this.outputMessages}', '${this.runMetadata}', '${createdAt}')`]
    const { data, error } = await useExecute(this.databaseName,statements)
    if (error) {
      console.error("Error saving trace:", error)
      if (error.message.includes("not found")) {
        console.log("Database not found, creating it...")
        const {error: createDbError } = await createDatabase(this.databaseName)
        if (createDbError) {
          console.error("Error creating database:", createDbError)
        }
        await new Promise(resolve => setTimeout(resolve, 15000))
        const createTableStatements = [`CREATE TABLE IF NOT EXISTS ${this.tableName} (id INTEGER PRIMARY KEY AUTOINCREMENT, session_id TEXT, run_id TEXT, input_messages TEXT, output_messages TEXT, run_metadata TEXT, created_at TEXT)`]
        const { data, error: createTableError } = await useExecute(this.databaseName,createTableStatements)
        if (createTableError) {
          console.error("Error creating table:", createTableError)
        }
        await this.save()
      }
    }
    console.log("Trace saved successfully")
  }
}
