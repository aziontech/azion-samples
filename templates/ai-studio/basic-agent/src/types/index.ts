import { AzionFilter } from "@langchain/community/vectorstores/azion_edgesql";
import { AIMessageChunk, BaseMessage, HumanMessage, MessageContent } from "@langchain/core/messages";
import { LangChainTracerFields } from "@langchain/core/tracers/tracer_langchain";

/**
 * Custom Event type to include request and args.
 */
export type CustomEvent = Partial<Event> & {
  request: CustomRequest;
  args: Record<string, any>;
}

/**
 * Custom Request type to include metadata.
 */
export type CustomRequest = Request & {
  metadata?: Record<string, string>;
}

/**
 * Interface representing the authentication request.
 */
export interface RequestAuth {
  urlAuthenticate: string,
  options: RequestInit
}

/**
 * Represents the response from a graph service.
 */
export type GraphResponse = ReadableStream | string

/**
 * Represents the response from a graph service.
 */
export interface GraphServiceResponse {
  success: boolean
  data?: GraphResponse
  error?: string
}

export interface GraphServiceDocsResponse {
  success: boolean
  data?: DocsResponse[]
  error?: string
}

/**
 * Represents the response from an authentication request.
 */
export interface AuthSuccessResponse {
  success: true
  data: AuthData
}

/**
 * Represents the response from an authentication request.
 */
export interface AuthErrorResponse {
  success: false
  error: { message: string, status: number }
}

/**
 * Represents the response from an authentication request.
 */
export type AuthResponse = AuthSuccessResponse | AuthErrorResponse

/**
 * Represents the data from an authentication request.
 */
export interface AuthData {
  accountId: string
}

export interface SSOResponse {
  results: {
    id: string
  }
}

/**
 * Interface representing the response from a chat completion.
 */
export interface ChatCompletionInvokeResponse {
  choices: {
    finish_reason: string | null;
    index: number;
    message: {
      content: MessageContent | string;
      role: string;
    };
    logprobs: null;
  }[];
  created: number;
  id: string;
  model: string;
  object: string;
  system_fingerprint: string;
  usage: {
    completion_tokens: number;
    prompt_tokens: number;
    total_tokens: number;
    completion_tokens_details: {
      reasoning_tokens: number;
    };
  };
}

/**
 * Interface representing the response from a chat completion stream.
 */
export interface ChatCompletionStreamResponse {
  choices: {
    finish_reason: string | null;
    index: number;
    delta: {
      content: MessageContent | string;
    } | {};
    logprobs: null;
  }[];
  created: number;
  id: string;
  model: string;
  system_fingerprint: string;
  object: string;
}

/**
 * Interface representing the input messages for a chat.
 */
export interface InputMessages {
  /** Array of messages in the chat */
  messages: BaseMessage[]
}

/**
 * Defines the structure of the config object for LangGraph.
 */
export interface LangGraphConfig {
  /** Unique identifier for the thread */
  thread_id: string;
  /**Azion Schema */
  azionParams: AzionSchema;
  /** Version of the LangGraph configuration */
  version: string;
  /** System prompt */
  system_prompt: string;
  /** OpenAI API Key */
  key: string;
}

/**
 * Defines the structure of the context object for LangGraph.
 */
export interface LangGraphContext {
  /** Metadata containing LangGraph configuration */
  metadata: LangGraphConfig;
}

/**
 * Configuration interface for the application.
 */
export interface Config {
  /** Configurable options */
  configurable: Configurable;
  /** Optional LangChain tracer for logging and debugging */
  tracer?: LangChainTracerFields[];
  /** Unique identifier for the run */
  run_id: string;
  /** Additional configuration parameters */
  [key: string]: any;
}

export interface Configurable {
  /** Unique identifier for the thread */
  thread_id: string
  /** Optional Azion parameters to identify the users and any additional metadata (e.g., args) */
  [key: string]: any;
};

/**
 * Represents a message in the chat conversation.
 * It can be a text message or an image message.
 */
export type Message = TextMessage | ImageMessage

/**
 * Represents a text message in the chat conversation.
 */
export interface TextMessage {
  role: 'system' | 'assistant' | 'user';
  content: string;
}

/**
 * Represents an image message in the chat conversation.
 */
export interface ImageMessage {
  role: 'system' | 'assistant' | 'user';
  content: {
    type: 'text' | 'image_url';
    text?: string;
    image_url?: {
      url: string;
    };
  }[];
}
/**
 * Represents Azion-specific configuration for the chat.
 */
export interface AzionSchema {
  /** Optional unique identifier for the session */
  session_id?: string;
  /** Optional URL associated with the chat */
  url?: string;
  /** The application context for the chat */
  app?: string;
  /** Optional name of the user */
  user_name?: string;
  /** Optional client identifier */
  client_id?: string;
  /** Optional system prompt to guide the conversation */
  system_prompt?: string;
  /** Optional user-specific prompt */
  user_prompt?: string;
  /** Optional unique identifier for the user */
  id?: number;
  /** Optional first name of the user */
  first_name?: string;
  /** Optional last name of the user */
  last_name?: string;
  /** Optional email of the user */
  email?: string;
  /** Optional support plan of the user */
  support_plan?: string;
}

/**
 * Represents the structure of a chat request body.
 */
export interface RequestChatBody {
  /** Array of messages in the conversation */
  messages: Message[];
  /** Optional Azion-specific configuration */
  azion?: AzionSchema;
  /** Optional variables from openwebui */
  variables: unknown
  /** Optional generic arguments to parameterize the chat */
  args?: Record<string, any>
  /** Optional docs options */
  docs_options?: DocsOptionsSchema;
  /** Optional support request */
  support_request?: SupportRequestBodySchema;
  /** Optional flag to enable streaming responses */
  stream?: boolean;
  /** Optional configuration for streaming */
  stream_options?: {
    /** Optional flag to include usage information */
    include_usage?: boolean;
  } | null;
  /** Optional parameter to adjust frequency of token generation */
  frequency_penalty?: number | null;
  /** Optional parameter to influence token selection */
  logit_bias?: Record<string, number>;
  /** Optional flag to include log probabilities */
  logprobs?: boolean | null;
  /** Optional number of top log probabilities to return */
  top_logprobs?: number | null;
  /** Optional maximum number of tokens to generate */
  max_completion_tokens?: number | null;
  /** Optional number of chat completion choices to generate */
  n?: number | null;
  /** Optional parameter to adjust presence of tokens */
  presence_penalty?: number | null;
  /** Optional parameter to specify response format */
  response_format?: {
    /** Optional type of response format */
    type?: 'text' | 'json_object' | 'json_schema';
  };
  /** Optional seed for deterministic sampling */
  seed?: number | null;
  /** Optional service tier specification */
  service_tier?: string | null;
  /** Optional array of sequences to stop generation */
  stop?: string[] | null;
  /** Optional sampling temperature */
  temperature?: number | null;
  /** Optional cumulative probability for top-p sampling */
  top_p?: number | null;
  /** Optional array of tools available to the model */
  tools?: Array<{
    /** Optional type of the tool */
    type?: 'function';
    /** Optional function details if the tool is a function */
    function?: {
      /** Optional name of the function */
      name?: string;
      /** Optional description of the function */
      description?: string;
    };
  }>;
  /** Optional specification for tool choice */
  tool_choice?: string | Record<string, never> | null;
  /** Optional flag to enable parallel tool calls */
  parallel_tool_calls?: boolean | null;
  /** Optional user identifier for the conversation */
  user?: string | null;
}

/**
 * Interface representing Azion messages.
 */
export interface AzionMessages {
  /** Array of messages, either human or AI-generated */
  messages: (HumanMessage | AIMessageChunk)[]
}

/**
 * Data associated with a StreamEvent.
 */
export interface StreamEventData {
  /**
   * The input passed to the runnable that generated the event.
   * Inputs will sometimes be available at the *START* of the runnable, and
   * sometimes at the *END* of the runnable.
   * If a runnable is able to stream its inputs, then its input by definition
   * won't be known until the *END* of the runnable when it has finished streaming
   * its inputs.
   */
  input?: any;
  /**
   * The output of the runnable that generated the event.
   * Outputs will only be available at the *END* of the runnable.
   * For most runnables, this field can be inferred from the `chunk` field,
   * though there might be some exceptions for special cased runnables (e.g., like
   * chat models), which may return more information.
   */
  output?: any;
  /**
   * A streaming chunk from the output that generated the event.
   * chunks support addition in general, and adding them up should result
   * in the output of the runnable that generated the event.
   */
  chunk?: any;
};
/**
 * A streaming event.
 *
 * Schema of a streaming event which is produced from the streamEvents method.
 */
export interface StreamEvent {
  /**
   * Event names are of the format: on_[runnable_type]_(start|stream|end).
   *
   * Runnable types are one of:
   * - llm - used by non chat models
   * - chat_model - used by chat models
   * - prompt --  e.g., ChatPromptTemplate
   * - tool -- LangChain tools
   * - chain - most Runnables are of this type
   *
   * Further, the events are categorized as one of:
   * - start - when the runnable starts
   * - stream - when the runnable is streaming
   * - end - when the runnable ends
   *
   * start, stream and end are associated with slightly different `data` payload.
   *
   * Please see the documentation for `EventData` for more details.
   */
  event: string;
  /** The name of the runnable that generated the event. */
  name: string;
  /**
   * An randomly generated ID to keep track of the execution of the given runnable.
   *
   * Each child runnable that gets invoked as part of the execution of a parent runnable
   * is assigned its own unique ID.
   */
  run_id: string;
  /**
   * Tags associated with the runnable that generated this event.
   * Tags are always inherited from parent runnables.
   */
  tags?: string[];
  /** Metadata associated with the runnable that generated this event. */
  metadata: Record<string, any>;
  /**
   * Event data.
   *
   * The contents of the event data depend on the event type.
   */
  data: StreamEventData;
}

export interface ChatParameters {
  errors: string | null,
  azion: AzionSchema | undefined,
  sessionId: string,
  messages: Message[],
  stream: boolean,
  variables: unknown
}

export interface RequestParams {
  url: string,
  body: unknown,
  ip: string | undefined,
  token?: string
}

export interface ExtractRequestParamsSuccess {
  requestParams: RequestParams,
  error: null
}

export interface ExtractRequestParamsError {
  requestParams: null,
  error: any
}

export type ExtractRequestParamsResult = ExtractRequestParamsSuccess | ExtractRequestParamsError


export type ValidateRequestBodyResult = ValidateRequestBodySuccess | ValidateRequestBodyError

export interface ValidateRequestBodySuccess {
  parsedBody: RequestChatBody | null,
  error: null
}

export interface ValidateRequestBodyError {
  parsedBody: null,
  error: any
}

export interface ValidateDocsRequestBodySuccess {
  parsedBody: DocsOptionsSchema | null,
  error: null
}

export interface ValidateDocsRequestBodyError {
  parsedBody: null,
  error: any
}

export type ValidateDocsRequestBodyResult = ValidateDocsRequestBodySuccess | ValidateDocsRequestBodyError

export interface DocsOptionsSchema {
  amountPerSearch?: number,
  metadataItems?: string[],
  filters?: AzionFilter[]
}

export interface DocsResponse {
  tool: string,
  response: string
}

export interface SupportRequestBodySchema {
  ticket_id: string,
  subject: string,
  description: string
}

export interface SupportRevisorOutput {
  response_is_good: boolean;
  feedback: string;
  analysis: string;
}

export type GraphInputs = GraphInput[]

export type GraphInput = ChatGraphInput | SupportGraphInput

export interface ChatGraphInput {
  messages: Message[]
}

export interface SupportGraphInput {
  ticket_id: string,
  subject: string,
  description: string
}

export interface SupportParametersExtractionSuccess {
  ticket_id: string,
  subject: string,
  description: string,
  url: string,
  error: null
}

export interface SupportParametersExtractionError {
  ticket_id: null,
  subject: null,
  description: null,
  url: null,
  error: Error
}

export type SupportParametersExtractionResult = SupportParametersExtractionSuccess | SupportParametersExtractionError

