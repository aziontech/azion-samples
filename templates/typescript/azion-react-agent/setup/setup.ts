import { AzionVectorStore } from "../src/langchain-components/AzionVectorStore";
import { OpenAIEmbeddings } from "@langchain/openai";
import dotenv from "dotenv";
import { getDocs } from "./helpers";
import { useQuery } from "azion/sql";
dotenv.config()

// This script is used to setup the vector store and add the product documents to it.
// It is used to create the database and the tables if they don't exist yet.
// It is also used to add the product documents to the vector store.

export default async function azionVectorStoreSetup() {

  if (!process.env.VECTOR_STORE_DB_NAME || !process.env.VECTOR_STORE_TABLE_NAME) {
    throw new Error("VECTOR_STORE_DB_NAME and VECTOR_STORE_TABLE_NAME must be set")
  }

  // Get product documents and setup columns
  const productDocs = getDocs("products.json")
  const columns = Object.keys(productDocs[0].metadata)

  // Setup embedding model. Any embeddings model can be used here. Ensure that your AzionRetrieverTool is using the same model.
  const embeddingModel = new OpenAIEmbeddings({
    model: process.env.EMBEDDING_MODEL
  })

  // Setup vector store if database doesn't exist yet
  // 
  // Option 1: Use static factory method
  // const vectorStore = await AzionVectorStore.createVectorStore(
  //   embeddingModel,
  //   {
  //     dbName: VECTOR_STORE_DB_NAME,
  //     tableName: VECTOR_STORE_TABLE_NAME
  //   },
  //   {
  //     columns,
  //     mode: "hybrid"
  //   }
  // );
  // 
  // OPTION 2: Create instance and setup database separately
  // 
  // const vectorStore = new AzionVectorStore(embeddingModel, {
  //   dbName: VECTOR_STORE_DB_NAME,
  //   tableName: VECTOR_STORE_TABLE_NAME
  // });
  // await vectorStore.setupDatabase({
  //   columns,
  //   mode: "hybrid"
  // });

  //If you have already setup the database, only instantiate the vector store
  const vectorStore = new AzionVectorStore(embeddingModel, {dbName:process.env.VECTOR_STORE_DB_NAME, tableName:process.env.VECTOR_STORE_TABLE_NAME})
  
  // Add documents to the vector store
  // await vectorStore.addDocuments(productDocs)

  // Use the vector store as retriever
  const docs = await vectorStore.AzionHybridSearch("what is good for headache?",{kfts:1,kvector:1})
  console.log(JSON.stringify(docs, null, 2))
}

azionVectorStoreSetup()