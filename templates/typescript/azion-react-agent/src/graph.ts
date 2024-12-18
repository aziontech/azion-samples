import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { callModel } from "./nodes/callModel";
import { AIMessage } from "@langchain/core/messages";
import { toolNode } from "./nodes/tools";

/**
 * @returns {StateGraph} The compiled graph.
 */
const workflow = new StateGraph(MessagesAnnotation)
  .addNode("callModel", callModel)
  .addNode("tools", toolNode)
  .addEdge("__start__", "callModel")
  .addConditionalEdges(
    "callModel",
    routeModelOutput,
  )
  .addEdge("tools", "callModel");

/**
 * @returns {Runnable} The compiled graph.
 */
export const graph = workflow.compile({
  interruptBefore: [],
  interruptAfter: [],
});

/**
 * @param {typeof MessagesAnnotation.State} state - The state of the graph.
 * @returns {string} The next node to call.
 */
function routeModelOutput(state: typeof MessagesAnnotation.State): string {
    const messages = state.messages;
    const lastMessage = messages[messages.length - 1];
  
  
    if ((lastMessage as AIMessage)?.tool_calls?.length) {
      console.log("TOOL CALLED: ", (lastMessage as AIMessage)?.tool_calls?.[0].name)
      return "tools";
    }
  
    return "__end__";
}