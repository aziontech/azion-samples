import { BaseMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';
import { Annotation } from '@langchain/langgraph';
import { ChatOpenAI } from '@langchain/openai';
import config from '../../../../helpers/constants';
import { getCalledToolsDescriptions, getPastMessages } from '../../../../helpers/utils';
import { LangGraphContext } from '../../../../types';
import { generateAsyncTools } from './tools';

// Resolve AI Studio base URL from environment (supports both hyphen and underscore var names)
const AI_STUDIO_BASE_URL = process.env['AI-STUDIO-URL'] || process.env.AI_STUDIO_URL;

export const GraphState = Annotation.Root({
  toolsAnnouncement: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  })
});


export async function toolsAnnouncer(
  state: typeof GraphState.State,
  context: Record<string, any> | LangGraphContext
) {
  try {
    const { messages } = state;
    const lastMessage = messages.at(-1);

    if (!lastMessage || !('tool_calls' in lastMessage) || !Array.isArray(lastMessage.tool_calls)) {
      throw new Error("No last message found");
    }

    // Resolve model strictly from args context (no fallback). Fail fast if missing.
    const announcerModelName = (context as any)?.metadata?.model;
    if (!announcerModelName) {
      throw new Error('Missing model for toolsAnnouncer: context.metadata.model must be provided');
    }

    const model = new ChatOpenAI({
      model: announcerModelName,
      temperature: 0.3,
      apiKey: process.env.EDGE_AI_TOKEN,
      streaming: true,
      tags: ['announcer'],
      configuration: {
        baseURL: process.env.EDGEAI_ENDPOINT
      },
    });

    const tools = await generateAsyncTools();

    const toolsDescriptionText = getCalledToolsDescriptions(lastMessage, tools)

    const pastMessages = getPastMessages(messages)

    const response = await model.invoke([
      new SystemMessage(config.ANNOUNCER_SYSTEM_PROMPT),
      new SystemMessage(`Tool descriptions:\n${toolsDescriptionText}`),
      new SystemMessage(`This is the past chat history. Use to understand the context of the conversation and do not repeat previous responses.:${pastMessages}`),
      new HumanMessage(`Last user question: ${messages[messages.length - 2]?.content}`)
    ])

    return {
      toolsAnnouncement: [response],
    };
  } catch (error) {
    console.error("Error calling tools announcer:", error);
    throw error;
  }
}