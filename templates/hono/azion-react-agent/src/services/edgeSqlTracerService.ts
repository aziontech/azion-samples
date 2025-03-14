import { Message, StreamEvent } from "../types";
import { createDatabase, useExecute } from "azion/sql";

/**
 * EdgeSQLTracerService
 * 
 * A service class that traces and persists agent interactions in an Edge SQL database.
 * Handles both streaming and invoke-mode message storage, with support for automatic
 * database/table creation and error recovery.
 * 
 * @class
 */
export class EdgeSQLTracerService {
  /**
   * @property {string} [runId] - Unique identifier for the current execution run
   * @property {string[]} [runMetadata] - Array of metadata messages for the current run
   * @property {string[]} inputMessages - Array of serialized input messages from the agent
   * @property {string} outputMessages - Concatenated output messages from the agent
   * @property {number} retryCount - Number of save retry attempts performed
   */
  databaseName: string
  tableName: string
  runId?: string
  runMetadata?: string[]
  inputMessages: string[]
  outputMessages: string
  mode: 'stream' | 'invoke'
  sessionId: string
  shouldHandleError: boolean
  retryCount: number

  /**
   * Creates a new instance of EdgeSQLTracerService to trace and store agent messages
   * @param {string} mode - Whether to run in 'stream' or 'invoke' mode
   * @param {string} databaseName - Name of the Edge SQL database to store messages in
   * @param {string} sessionId - Unique session ID for the conversation
   * @param {string} [tableName='messages'] - Name of table to store messages in
   * @param {boolean} [shouldHandleError=false] - Whether to handle database/table creation errors
   */
  constructor(
    mode: 'stream' | 'invoke',
    databaseName: string,
    sessionId: string,
    tableName?: string,
    shouldHandleError?: boolean
  ) {
    this.databaseName = databaseName
    this.tableName = tableName || 'messages'
    this.runId = ''
    this.runMetadata = []
    this.inputMessages = []
    this.outputMessages = ''
    this.mode = mode
    this.sessionId = sessionId
    this.shouldHandleError = shouldHandleError || false
    this.retryCount = 0
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
        this.handleErrors(error)
      })
    }
  }

  /**
   * Remove the single quotes from input, output and run metadata
   */
  removeSingleQuotesFromStrings(): void {
    this.inputMessages = this.inputMessages.map((message:string) => message.replace(/'/g, ""))
    this.outputMessages = this.outputMessages.replace(/'/g, "")
    this.runMetadata = this.runMetadata?.map((message:string) => message.replace(/'/g, ""))
  }

  /**
   * Create the insert statement
   * @returns {string[]} The insert statement
   */
  createInsertStatement(): string[] {
    const createdAt = new Date().toISOString()
    this.removeSingleQuotesFromStrings()
    const statements = [`INSERT INTO ${this.tableName} (session_id, run_id, input_messages, output_messages, run_metadata, created_at) VALUES ('${this.sessionId}', '${this.runId}', '${this.inputMessages}', '${this.outputMessages}', '${this.runMetadata}', '${createdAt}')`]
    return statements
  }

  /**
   * Create the setup table statement
   * @returns {string[]} The setup table statement
   */
  createSetupTableStatement(): string[] {
    const statements = [`CREATE TABLE IF NOT EXISTS ${this.tableName} (id INTEGER PRIMARY KEY AUTOINCREMENT, session_id TEXT, run_id TEXT, input_messages TEXT, output_messages TEXT, run_metadata TEXT, created_at TEXT)`]
    return statements
  }

  /**
   * Save the trace into the database
   */
  async save() {

      console.log("Saving trace into ", this.databaseName, "for session ", this.sessionId)

      const { data, error } = await useExecute(this.databaseName,this.createInsertStatement())
    
      if (error) {
        throw error
      }
      
      if (data) {
        console.log("Trace saved successfully")
        return
      }
  }

  /**
   * Handle errors
   * @param {any} error - The error to handle
   */
  async handleErrors(
    error: any
  ){
    if (!this.shouldHandleError) {
      return
    }

    if (error.message.includes("not found")) {
      console.log("Database not found, creating it...")
      const {error: createDbError } = await createDatabase(this.databaseName)
      if (createDbError) {
        console.error("Error creating database:", createDbError)
        throw createDbError
      }
    }
 
    if (error.message.includes("no such table")) {
      console.log("Table not found, creating it...")
      const {error: createTableError } = await useExecute(this.databaseName,this.createSetupTableStatement())
      if (createTableError) {
        console.error("Error creating table:", createTableError)
        throw createTableError
      }
    }

    this.retrySave()
  }

  /**
   * Retry the save method
   */
  async retrySave() {
    if (this.retryCount >= 1) {
      throw new Error("Failed to save trace after 3 retries")
    }
    this.retryCount++
    console.log(`Retrying save...${this.retryCount}`)
    await new Promise(resolve => setTimeout(resolve, 20000))
    await this.save()
    
  }
}
