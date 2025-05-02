import { AzionVectorStore } from "@langchain//community/vectorstores/azion_edgesql";
import { OpenAIEmbeddings } from "@langchain/openai";
import dotenv from "dotenv";

dotenv.config();

export default async function azionVectorStoreSetup() {
  const VECTOR_STORE_DB_NAME = process.env.VECTOR_STORE_DB_NAME
  const VECTOR_STORE_TABLE_NAME = "vectors"
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY
  const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL
  
  if (!VECTOR_STORE_DB_NAME || !VECTOR_STORE_TABLE_NAME) {
    throw new Error("VECTOR_STORE_DB_NAME and VECTOR_STORE_TABLE_NAME must be set")
  }

  // Setup embedding model. Any embeddings model can be used here. Ensure that your AzionRetrieverTool is using the same model.
  const embeddingModel = new OpenAIEmbeddings({
    model: EMBEDDING_MODEL,
    apiKey: OPENAI_API_KEY
  })

  // Setup vector store if database doesn't exist yet

  await AzionVectorStore.initialize(
    embeddingModel,
    {
      dbName: VECTOR_STORE_DB_NAME,
      tableName: VECTOR_STORE_TABLE_NAME
    },
    {
    mode: "hybrid",
    columns: ["*"]
    }
  );

  // OPTION 2: Create instance and setup database separately
  // 
  // const vectorStore = new AzionVectorStore(embeddingModel, {
  //   dbName: VECTOR_STORE_DB_NAME,
  //   tableName: VECTOR_STORE_TABLE_NAME
  // });
  // await vectorStore.setupDatabase({
  //   mode: "hybrid",
  //   columns: ["*"]
  // });
}

azionVectorStoreSetup()