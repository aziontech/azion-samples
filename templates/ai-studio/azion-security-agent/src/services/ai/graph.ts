import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { callModel } from "./nodes/callModel";
import { AIMessage } from "@langchain/core/messages";
import { BaseMessage } from "@langchain/core/messages";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { generateAsyncTools } from "./nodes/tools";
import { START, END ,Annotation} from "@langchain/langgraph";

export const GraphState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  })
});

export async function generateChatGraph() {

  const tools = await generateAsyncTools();

  const chatToolNode = new ToolNode<typeof GraphState.State>(tools);

  const chatWorkflow = new StateGraph(GraphState)
    .addNode('agent', callModel)
    .addNode('tools', chatToolNode)

  chatWorkflow.addEdge(START, 'agent');
  chatWorkflow.addConditionalEdges(
    'agent',
    routeModelOutput,
    {
      tools: 'tools',
      noTools: END
    }
  );

  chatWorkflow.addEdge('tools', 'agent');

  const chatGraph = chatWorkflow.compile({});
  chatGraph.name = 'chat'
  return chatGraph
}

/**
 * @param {typeof MessagesAnnotation.State} state - The state of the graph.
 * @returns {string} The next node to call.
 */
function routeModelOutput(state: typeof MessagesAnnotation.State): string {
    const messages = state.messages;
    const lastMessage = messages[messages.length - 1];
  
  
    if ((lastMessage as AIMessage)?.tool_calls?.length) {
      return "tools";
    }
  
    return "noTools";
}