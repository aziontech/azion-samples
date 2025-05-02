import { AzionVectorStore } from "@langchain//community/vectorstores/azion_edgesql";
import { OpenAIEmbeddings } from "@langchain/openai";
import { getDocsFromFolder } from "./helpers/documentLoaders";
import { DocumentChunker } from "./helpers/documentChunker";
import dotenv from "dotenv";

dotenv.config();

// This script is used to setup the vector store and add the product documents to it.
// It is used to create the database and the tables if they don't exist yet.
// It is also used to add the product documents to the vector store.

export default async function uploadDocs() {
  const VECTOR_STORE_DB_NAME = process.env.VECTOR_STORE_DB_NAME
  const VECTOR_STORE_TABLE_NAME = "vectors"
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY
  const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL

  if (!VECTOR_STORE_DB_NAME || !VECTOR_STORE_TABLE_NAME) {
    throw new Error("VECTOR_STORE_DB_NAME and VECTOR_STORE_TABLE_NAME must be set")
  }

  // Currently supported file types: .txt, .pdf, .csv, .json, .html
  const docs = await getDocsFromFolder("migrations/files")

  const chunker = new DocumentChunker("recursive", 1000, 200)

  const chunkedDocs = await chunker.chunkDocuments(docs)

  // Setup embedding model. Any embeddings model can be used here. 
  // Ensure that your AzionRetrieverTool is using the same model.
  // If you have a database already, ensure that it was created to support the same dimension as the embedding model.
  const embeddingModel = new OpenAIEmbeddings({
    model: EMBEDDING_MODEL,
    apiKey: OPENAI_API_KEY
  })

  const vectorStore = new AzionVectorStore(embeddingModel, {dbName:VECTOR_STORE_DB_NAME, tableName:VECTOR_STORE_TABLE_NAME})
  
  // Add documents to the vector store
  if(chunkedDocs.length > 0){
    await vectorStore.addDocuments(chunkedDocs)
    return
  }

  console.log("No documents found in the folder")
}

uploadDocs()