import { SystemMessage } from "@langchain/core/messages";
import { RunnableConfig } from "@langchain/core/runnables";
import { MessagesAnnotation } from "@langchain/langgraph";
import { TOOLS } from "./tools.js";
import { ChatOpenAI } from "@langchain/openai";
import { SYSTEM_PROMPT_TEMPLATE } from "../helper/prompts.js";
import { OPENAI_API_KEY, OPENAI_MODEL } from "../helper/config.js";

/**
 * @param {typeof MessagesAnnotation.State} state - The state of the graph.
 * @param {RunnableConfig} config - The configuration of the graph.
 * @returns {Partial<typeof MessagesAnnotation.State>} The next state of the graph.
 */
export async function callModel(
  state: typeof MessagesAnnotation.State,
  config: RunnableConfig,
): Promise<Partial<typeof MessagesAnnotation.State>> {

  const { messages } = state
  
  messages.push(new SystemMessage({content: config.configurable?.systemPrompt || SYSTEM_PROMPT_TEMPLATE}))
  
  const model = new ChatOpenAI({
    model: OPENAI_MODEL,
    temperature: 0.3,
    streaming: false,
    verbose: false,
    tags: ['agent'],
    apiKey: OPENAI_API_KEY,
  }).bindTools(TOOLS);

  const response = await model.invoke(messages,{recursionLimit:3});
  
  return { messages: [response] };
}

