# AI Studio – Basic Agent

Deploy an AI Studio chat agent using TypeScript on Azion. This template exposes a small Hono API, builds a basic LangGraph agent, and uses OpenAI Models. Soon, the version with AI Inference will be available

## Setup

### Prerequisites
- **Azion** account and CLI: https://www.azion.com/en/documentation/products/azion-cli/overview/
- **OpenAI** API key: https://platform.openai.com/

### Install
```bash
git clone git@github.com:aziontech/azion-samples.git
cd azion-samples/templates/ai-studio/basic-agent
yarn install
```

### Environment variables
Create a local environment (e.g., via your IDE/run configuration or system env). At minimum:

- **OPENAI_API_KEY** (required)
- **AI_STUDIO_URL** or **AI-STUDIO-URL** (optional) to persist thread messages to AI Studio
- **USE_LOCAL_TOKEN** (optional, 'true' to use LOCAL_TOKEN)
- **LOCAL_TOKEN** (optional, used if USE_LOCAL_TOKEN is true)

## Run locally
```bash
azion build
azion dev
```

The API only accepts POST/OPTIONS. Main endpoint: `POST /ai/chat`.

## Deploy
```bash
azion deploy
```

## API usage
Only POST is allowed; non-POST methods return 405. CORS/headers are handled by Azion rules.

### Endpoint
`POST /ai/chat`

### Authentication
`src/middlewares/authMiddleware.ts` currently returns success for all requests. Adjust as needed.

If you want to persist thread messages to AI Studio, pass an Authorization header and a `thread_id` in the body. The server extracts the token from `Authorization: Token <your_token>` (or `Bearer <token>`) and posts messages to `${AI_STUDIO_URL}/v4/workspace/ai/threads/{thread_id}/messages`.

### Request formats
Validated in `src/helpers/schema.ts`.

- **Short format (agent by name):**
```json
{
  "messages": [
    { "role": "user", "content": "Olá" }
  ],
  "agent": "agente-basico",
  "stream": false,
  "thread_id": "<uuid-optional>",
  "variables": {}
}
```

- **Args-based format (full agent):**
```json
{
  "messages": [
    { "role": "user", "content": "Olá" }
  ],
  "stream": false,
  "thread_id": "<uuid-optional>",
  "args": {
    "agent": {
      "agent_id": "00000000-0000-0000-0000-000000000001",
      "account_id": "00000000-0000-0000-0000-000000000000",
      "name": "agente-basico",
      "system_prompt": "Você é um assistente técnico.",
      "goal": "Responder curto e objetivamente.",
      "llm_model": "gpt-4o",
      "tools": [
        {
          "name": "test",
          "type": "RAG",
          "kb": [
            { "kb_id": "1", "edgesql_db_id": "banco", "embedding_model": "text-embedding-3-small" }
          ]
        }
      ]
    }
  }
}
```

If you pass just the agent name (short format), it is resolved via `src/agentsCatalog.ts`. You may also override the catalog by passing `args.agents` in the short format.

### Streaming vs non-streaming
- Set `stream: true` to receive `text/event-stream` chunks.
- Set `stream: false` (default) to receive an OpenAI-style `chat.completion` JSON.

### Examples
- **Non-streaming (local):**
```bash
curl -X POST 'http://localhost:3333/ai/chat' \
  -H 'Content-Type: application/json' \
  --data-raw '{
    "messages":[{"role":"user","content":"Hello"}],
    "agent":"agente-basico",
    "stream":false
  }'
```

- **Streaming (local):**
```bash
curl -N -X POST 'http://localhost:3333/ai/chat' \
  -H 'Content-Type: application/json' \
  --data-raw '{
    "messages":[{"role":"user","content":"Hello"}],
    "agent":"agente-basico",
    "stream":true
  }'
```

- **With thread persistence (requires AI_STUDIO_URL and Authorization):**
```bash
curl -X POST 'http://localhost:3333/ai/chat' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Token <your_token>' \
  --data-raw '{
    "messages":[{"role":"user","content":"Hello"}],
    "agent":"agente-basico",
    "thread_id":"11111111-1111-1111-1111-111111111111",
    "stream":false
  }'
```

## Project structure
- **src/main.ts**: Hono app and routes (`/ai/chat`).
- **src/handlers/aiChatHandler.ts**: Validates input, resolves/loads agent, builds graph, streams or returns JSON.
- **src/services/ai/agentOnlyGraph.ts**: Builds a minimal LangGraph agent using `ChatOpenAI` (uses `OPENAI_API_KEY`). Optional RAG tools binding.
- **src/services/graphService.ts**: Streaming/invoke helpers and OpenAI-style response shaping.
- **src/helpers/schema.ts**: Zod schemas for requests and agent payload.
- **src/helpers/utils.ts**: Utilities for request parsing, SSE transform, token extraction, etc.
- **src/agentsCatalog.ts**: Default agent catalog used by short format.
- **src/middlewares/authMiddleware.ts**: Authentication stub.

## Notes
- The template uses `azion.config.ts` with entrypoint `src/main.ts` and exports a single Edge Function.
- Adjust auth and agent catalog for your use case.