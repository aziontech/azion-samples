import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { EMBEDDING_MODEL, TAVILY_API_KEY, VECTOR_STORE_DB_NAME, VECTOR_STORE_TABLE_NAME } from "../helper/config.js";
import { OpenAIEmbeddings } from "@langchain/openai";
import { ChatOpenAI } from "@langchain/openai";
import { AzionRetriever } from "../langchain-components/AzionRetriever";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { createRetrieverTool } from "langchain/tools/retriever";
import { MessagesAnnotation } from "@langchain/langgraph";

// TavilySearchResults - a tool that searches the web for information
const searchTavily = new TavilySearchResults({
  maxResults: 3,
  apiKey: TAVILY_API_KEY,
});

// Embeddings model - it should be the same as the one used with the vector store documents
const embeddingModel = new OpenAIEmbeddings({
  model: EMBEDDING_MODEL
})

// Entity Extractor - needed for the AzionRetriever to extract entities from the text
const entityExtractor = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0
})

// AzionRetriever - a tool that retrieves information about panvel products (medicamentos)
const azionRetriever = new AzionRetriever(embeddingModel, entityExtractor,
  {dbName:VECTOR_STORE_DB_NAME,
   vectorTable:VECTOR_STORE_TABLE_NAME,
   ftsTable:VECTOR_STORE_TABLE_NAME+"_fts",
   ftsK:1,
   similarityK:1,
   searchType:"hybrid",
   metadataItems:['product_short_name','product_description'],
   promptEntityExtractor:'Extraia as entidades relevantes para a busca. Apenas responda com as entidades, sem explicações e pontuação.'
  });

const retrieverTool = createRetrieverTool(azionRetriever,{
  name: "AzionRetriever",
  description: "Ferramenta para buscar informacoes no banco de dados da Azion"
});

export const TOOLS = [retrieverTool, searchTavily];

export const toolNode = new ToolNode<typeof MessagesAnnotation.State>(TOOLS)