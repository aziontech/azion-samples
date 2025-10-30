import { BaseMessage } from '@langchain/core/messages';
import { Annotation } from '@langchain/langgraph';

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