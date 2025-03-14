# Langchain Azion Edge SQL

This is a Langchain integration for Azion Edge SQL, enabling vector search capabilities at the edge. The integration provides a vector store implementation that works with Azion's Edge SQL database service. (soon to be available on langchain-community)

## Features

- Vector similarity search
- Full-text search 
- Hybrid search (combining vector and full-text)
- Metadata filtering
- Built for edge computing with Azion's infrastructure


### Environment Setup

Before using the AzionVectorStore or AzionRetriever, you need to set up your environment variables:

1. Create a `.env` file in your project root directory
2. Add the following environment variables: AZION_TOKEN, OPENAI_API_KEY
3. Install the Azion CLI following the instructions at: https://www.azion.com/en/documentation/products/cli/overview/
4. Login to Azion CLI: `azion login`
5. Run Azion development environment: `azion dev`
6. Test the endpoints with cURL: `curl http://localhost:3333`

### AzionVectorStore
The `AzionVectorStore` is used to manage and search through a collection of documents using vector embeddings.

```typescript
import { AzionVectorStore } from "./src/function/AzionVectorStore";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";

// Initialize the vector store
const embeddingModel = new OpenAIEmbeddings({ model: EMBEDDING_MODEL });
const vectorStore = new AzionVectorStore(embeddingModel, { dbName: "mydb", tableName: "documents" });

// Setup database with hybrid search and metadata columns
await vectorStore.setupDatabase({
  columns: ["topic", "language"],
  mode: "hybrid"
});

//OR you can setup the database with the static method createDatabase
//const vectorStore = await AzionVectorStore.createDatabase(embeddingModel,{dbName:"mydb", tableName:"documents"}, {columns: ["topic", "language"], mode: "hybrid"});

// Add documents to the vector store
await vectorStore.addDocuments([
  new Document({ pageContent: "Australia is known for its unique wildlife", metadata: { topic: "nature", language: "en" } }),
  // Add more documents as needed
]);

// Perform a similarity search
const results = await vectorStore.AzionSimilaritySearch("Australia", { kvector: 1, metadataItems: ["topic"] });

// OR
// Perform a full text search
const results = await vectorStore.AzionFullTextSearch("Australia", { kfts: 1, metadataItems: ["topic"] });

// OR
// Perform a hybrid search
const results = await vectorStore.AzionHybridSearch("Australia", { kfts: 1, kvector: 1, metadataItems: ["topic"] });
console.log(results);
```

### AzionRetriever

The `AzionRetriever` is used to perform advanced search operations, including hybrid and similarity searches.

```typescript
import { AzionRetriever } from "./src/function/AzionRetriever";
import { OpenAIEmbeddings } from "@langchain/openai";
import { ChatOpenAI } from "@langchain/openai";

// Initialize the retriever
const embeddingModel = new OpenAIEmbeddings({ model: EMBEDDING_MODEL });
// Initialize the entity extractor model to extract the entities to perform Full Text Search operations
const entityExtractor = new ChatOpenAI({ model: OPENAI_MODEL });

// Initialize the retriever
const retriever = new AzionRetriever(embeddingModel, entityExtractor, {
  dbName: "mydb",
  similarityK: 2,
  ftsK: 2,
  searchType: "hybrid",
  // Filter documents by language = "en" AND topic IN ("nature", "biology")
  filters: [
    // Only return English language documents
    { column: "language", operator: "=", value: "en" },
    // Only return documents with topics of nature or biology
    { column: "topic", operator: "IN", value: "'nature', 'biology'" }
  ],
  // Return only the topic and language metadata
  metadataItems: ["topic", "language"],
});

// Perform a search
const documents = await retriever._getRelevantDocuments("Australia");
console.log(documents);
```

Using AzionRetriever as a tool in an agent requires the `createRetrieverTool` function to wrap the retriever:

```typescript
import {createRetrieverTool} from "@langchain/core/tools";
import {AzionRetriever} from "./src/function/AzionRetriever";

const retriever = new AzionRetriever(embeddingModel, entityExtractor, {
  dbName: "mydb",
  similarityK: 2,
  ftsK: 2,
});

const retrieverTool = createRetrieverTool(retriever, {
  name: "AzionRetriever",
  description: "A tool that retrieves documents from a vector database"
});

```

These examples demonstrate how to initialize and use the `AzionVectorStore` and `AzionRetriever` for managing and retrieving documents based on vector embeddings and full-text search capabilities.
