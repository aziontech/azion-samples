import { AIMessage, SystemMessage } from "@langchain/core/messages";
import { RunnableConfig } from "@langchain/core/runnables";
import { MessagesAnnotation } from "@langchain/langgraph";
import { generateAsyncTools } from "./tools";
import { ChatOpenAI } from "@langchain/openai";
import { SYSTEM_PROMPT } from "@/helpers/constants";
import { OPENAI_API_KEY, OPENAI_MODEL } from "@/helpers/constants";

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
  const tools = await generateAsyncTools()
  
  const model = new ChatOpenAI({
    model: OPENAI_MODEL,
    temperature: 0.3,
    streaming: false,
    verbose: false,
    tags: ['agent'],
    apiKey: OPENAI_API_KEY,
  }).bindTools(tools);

  const response = new AIMessage(await model.invoke([new SystemMessage(SYSTEM_PROMPT),...messages],{recursionLimit:3}))
  
  return { messages: [response] };
}

