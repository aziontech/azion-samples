# Vue3 AI Chatbot Widget

The **Vue3 AI Chatbot Widget** is the frontend application for the **LangGraph AI Agent Boilerplate**. It consists of the graphic interface to interact with the Artificial Intelligence agent created by that template.

This repository is an example of the new GitHub repository created during the deployment. For a more detailed step-by-step to deploy the **LangGraph AI Agent Boilerplate** through Azion's platform, check the [How to deploy the LangGraph AI Agent Boilerplate](https://www.azion.com/en/documentation/products/guides/langgraph-ai-agent-boilerplate/) guide.

This template uses Vue version `3.3.4`.

---

## Requirements

Before using this template, you need to:

- Have a [GitHub account](https://github.com/signup).
  - Every push will be deployed automatically to the main branch in this repository to keep your project updated.
- Have an [OpenAI](https://platform.openai.com/) API Key.

> **Note**: this template uses [Application Accelerator](https://www.azion.com/en/documentation/products/build/edge-application/application-accelerator/), [Edge Functions](https://www.azion.com/en/documentation/products/build/edge-application/edge-functions/), and [Edge SQL](https://www.azion.com/en/documentation/products/store/edge-sql/), and it could generate usage-related costs. Check the [pricing page](https://www.azion.com/en/pricing/) for more information.

---

## Deploy your own

This application is designed to work together with the backend application for the **LangGraph AI Agent Boilerplate**. You can use the button below to deploy this template with both applications:

[![Deploy Button](https://www.azion.com/button.svg)](https://console.azion.com/create/langgraph-ai-agent-boilerplate "Deploy with Azion")


---

## Configuring the template

After the deployment, the template creates two databases, one for conversation history and another for reference documents. The **Vue3 AI Chatbot Widget** provides a graphic interface to chat with your AI agent; the databases must be correctly configured to store the chat messages and provide the documents that will serve as the agent's reference.

To start using your own documents, you must set the appropriate database by following these steps:

1. Access the Github repository for the **backend application** created during the deployment. Its name will be similar to `<your-agent-name>-backend-agent`.

2. You must have a `.env` file with your environment variables in it. If you want to create a new one, it must follow the structure below:

```dotenv
AZION_TOKEN=
OPENAI_API_KEY=
OPENAI_MODEL=
EMBEDDING_MODEL=

LANGSMITH_API_KEY=
LANGCHAIN_PROJECT=
LANGCHAIN_TRACING_V2=false

MESSAGE_STORE_DB_NAME=
MESSAGE_STORE_TABLE_NAME=

VECTOR_STORE_DB_NAME=
VECTOR_STORE_TABLE_NAME=
```

Note that not all environment variables are required. Check details on the table below.

| Environment variable      | Description                                                                 | Required |
|---------------------------|-----------------------------------------------------------------------------|----------|
| AZION_TOKEN               | The token for authenticating with Azion's platform. | Yes |
| OPENAI_API_KEY            | Your API key for accessing OpenAI services. | Yes |
| OPENAI_MODEL              | The OpenAI model to be used for processing. If not set, defaults to `gpt-4o`. | No |
| EMBEDDING_MODEL           | The model used for generating embeddings. If not set, defaults to `text-embedding-3-small`. To use a different model, you must create a database with columns configured for the same model. | No |
| LANGSMITH_API_KEY         | API key for accessing Langsmith services. | No |
| LANGCHAIN_PROJECT         | The Langchain project identifier. | No |
| LANGCHAIN_TRACING_V2      | Enables or disables Langchain tracing (set to true or false). | No |
| MESSAGE_STORE_DB_NAME     | The database name for storing conversation history messages. Default name: `<agent-name>-messagestore`. | Yes |
| MESSAGE_STORE_TABLE_NAME  | The table name within the messages database for storing the conversation history. Default name: `messages`. | Yes |
| VECTOR_STORE_DB_NAME      | The database name for storing your documents as vector embeddings. Default name: `<agent-name>-vectorstore`. | Yes |
| VECTOR_STORE_TABLE_NAME   | The table name within the documents database for storing embeddings. Default name: `vectors`. | Yes |

:::tip
You can use the [Azion EdgeSQL Shell](/en/documentation/products/store/sql/edge-sql-shell-commands/) to interact with your databases. This shell provides a command-line interface that allows you to better visualize your databases and tables and execute SQL commands directly from the terminal.
:::

3. Open the file `setup/setup.ts`. This file contains the function that sets up the databases, and you can edit it to match your requirements:
  - You can change the names of environment variables to match your `.env` file if needed, or even pass some of them directly in the code.
  - Edit the value of the constant `productDocs`. It uses by default the return of the function `getDocs`, which is configured in the boilerplate to process data from an example file. You can add your own documents file in the `setup` folder.
  - The template automatically creates the databases during the deployment, but you can configure the function to create your database according to the environment variables. There are two options available in the code for doing this. They are written as commentaries and you can uncomment the one you prefer.

    The first option uses a static factory method:

```ts
const vectorStore = await AzionVectorStore.createVectorStore(
     embeddingModel,
     {
       dbName: VECTOR_STORE_DB_NAME,
       tableName: VECTOR_STORE_TABLE_NAME
     },
     {
       columns,
       mode: "hybrid"
     }
   );
```

  Alternatively, you can choose to create the instance and setup the database separately:

```ts 
 const vectorStore = new AzionVectorStore(embeddingModel, {
     dbName: VECTOR_STORE_DB_NAME,
     tableName: VECTOR_STORE_TABLE_NAME
   });
   await vectorStore.setupDatabase({
     columns,
     mode: "hybrid"
   }); 
```

4. Run the following command in the root directory of the project to run the function that sets up the database:

```bash
yarn setup
```

The reference documents database is now set and ready for your application to access it. Read the [backend application documentation](https://github.com/aziontech/azion-samples/tree/3cf53a690ac7f40508bc020adcfc61ba553d0b2f/templates/typescript/azion-react-agent) to see more details about configuring the project.

:::note
The template also creates a database for storing the messages exchanged with the agent. By default, it'll store messages for *14 days*.
:::

For a more detailed step-by-step, check the [documentation](https://www.azion.com/en/documentation/products/guides/langgraph-ai-agent-boilerplate/).