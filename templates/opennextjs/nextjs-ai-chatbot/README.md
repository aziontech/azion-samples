# Next.js AI Chatbot (Azion Edition)

A high-performance, server-rendered Next.js App Router AI Chatbot application optimized for deployment on the Azion Platform.

## Prerequisites

### 1. Neon Postgres Database

Create a free Neon Postgres database to store chat history and user data:

1. Sign up at [Neon](https://neon.tech)
2. Create a new project
3. Copy the connection string from your project dashboard
4. Add it to your `.env` file as `POSTGRES_URL`

**Reference:** [Neon Documentation](https://neon.tech/docs/get-started-with-neon/signing-up)

### 2. OpenAI API Token

Get your OpenAI API key to enable AI chat functionality:

1. Create an account at [OpenAI Platform](https://platform.openai.com)
2. Navigate to [API Keys](https://platform.openai.com/api-keys)
3. Click "Create new secret key"
4. Copy the key and add it to your `.env` file as `OPENAI_API_KEY`

**Reference:** [OpenAI API Documentation](https://platform.openai.com/docs/quickstart)

### 3. NextAuth URL

Set the URL of your Next.js application to enable authentication and authorization:

1. Add it to your `.env` file as `NEXTAUTH_URL`

**Reference:** [NextAuth Documentation](https://next-auth.js.org)

### 4. NextAuth Secret

Set a secret key to enable authentication and authorization:

1. Add it to your `.env` file as `AUTH_SECRET`

**Reference:** [NextAuth Documentation](https://next-auth.js.org)

### 5. Azion Sanitize Worker

Set `AZ_ENABLE_SANITIZE_WORKER=true` to enable the sanitize worker.

Or use with command line:

```bash
AZ_ENABLE_SANITIZE_WORKER=true azion deploy --local
```

> This is required for deploy on Azion.

## Running locally

> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control your AI Chatbot.

```bash
pnpm install
pnpm dev
```

Your app should now be running on [localhost:3000](http://localhost:3000/).

## Deploying to Azion

Deploy your own Next.js AI Chatbot with Azion.

[![Deploy Button](https://www.azion.com/button.svg)](https://console.azion.com/create/azion-community/nextjs-ai-chatbot "Deploy with Azion")

For a more detailed step-by-step on using templates via Azion Console, check the [documentation](https://www.azion.com/en/documentation/products/use-a-template-via-azion-console/).
