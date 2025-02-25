import { EMBEDDING_MODEL, VECTOR_STORE_DB_NAME, VECTOR_STORE_TABLE_NAME } from "../helper/config.js";
import { OpenAIEmbeddings } from "@langchain/openai";
import { ChatOpenAI } from "@langchain/openai";
import { AzionRetriever } from "../langchain-components/AzionRetriever";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { createRetrieverTool } from "langchain/tools/retriever";
import { MessagesAnnotation } from "@langchain/langgraph";

// Embeddings model - it should be the same as the one used with the vector store documents
const embeddingModel = new OpenAIEmbeddings({
  model: EMBEDDING_MODEL
})

// Entity Extractor - needed for the AzionRetriever to extract entities from the text
const entityExtractor = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0
})

// AzionRetriever - a tool that retrieves information from the vector database (Edge SQL)
const azionRetriever = new AzionRetriever(embeddingModel, entityExtractor,
  {dbName:VECTOR_STORE_DB_NAME,
   vectorTable:VECTOR_STORE_TABLE_NAME,
   ftsTable:VECTOR_STORE_TABLE_NAME+"_fts",
   ftsK:3,
   similarityK:3,
   searchType:"hybrid",
   promptEntityExtractor:'Extraia as entidades relevantes para a busca. Apenas responda com as entidades, sem explicações e pontuação.'
  });

const retrieverTool = createRetrieverTool(azionRetriever,{
  name: "AzionRetriever",
  description: "Ferramenta para buscar informacoes no banco de dados da Azion"
});

export const TOOLS = [retrieverTool];

export const toolNode = new ToolNode<typeof MessagesAnnotation.State>(TOOLS)