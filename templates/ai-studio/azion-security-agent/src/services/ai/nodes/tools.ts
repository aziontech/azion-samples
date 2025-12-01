import { EMBEDDING_MODEL, VECTOR_STORE_DB_NAME, VECTOR_STORE_TABLE_NAME, MCP_SERVER_URL } from "@/helpers/constants";
import { OpenAIEmbeddings } from "@langchain/openai";
import { ChatOpenAI } from "@langchain/openai";
import { AzionRetriever } from "@langchain/community/retrievers/azion_edgesql";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { createRetrieverTool } from "langchain/tools/retriever";
import { MessagesAnnotation } from "@langchain/langgraph";
import { MultiServerMCPClient } from "@langchain/mcp-adapters";




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
// const azionRetriever = new AzionRetriever(embeddingModel,
//   {entityExtractor,
//    dbName:VECTOR_STORE_DB_NAME,
//    vectorTable:VECTOR_STORE_TABLE_NAME,
//    ftsTable:VECTOR_STORE_TABLE_NAME+"_fts",
//    ftsK:3,
//    similarityK:3,
//    searchType:"hybrid",
//    promptEntityExtractor:'Extraia as entidades relevantes para a busca. Apenas responda com as entidades, sem explicações e pontuação.'
//   });

  export async function generateAsyncTools(): Promise<any[]> {
    const toolsList: any[] = []
  
    // Create client and connect to server
    const mcpClient = new MultiServerMCPClient({
      throwOnLoadError: true,
      prefixToolNameWithServerName: true,
      additionalToolNamePrefix: "mcp",
      useStandardContentBlocks: true,
      mcpServers: {
        queryHttpEvents: {
          transport: "http",
          url: MCP_SERVER_URL,
        } 
            // You can put more MCP servers here
      },
    });
  
    const toolsMcp = await mcpClient.getTools();
  
    toolsList.push(...toolsMcp)
  
    return toolsList;
  }

// const retrieverTool = createRetrieverTool(azionRetriever,{
//   name: "AzionRetriever",
//   description: "Ferramenta para buscar informacoes no banco de dados da Azion"
// });

// 
