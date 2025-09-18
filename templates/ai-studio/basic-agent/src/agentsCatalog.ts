// Minimal agent catalog used as default when the request does not provide args.agents
// Fields must match the minimal schema: agent_id (uuid), name, system_prompt, goal?, llm_model
// This catalog also supports optional tools (kept via .passthrough() in agentService)

export type CatalogAgent = {
  agent_id: string;
  name: string;
  system_prompt: string;
  goal?: string;
  llm_model: string;

  tools?: Array<{
    name: string;
    description?: string;
    type: 'RAG';
    active?: boolean;
    kb: Array<{
      kb_id: string;
      name?: string;
      edgesql_db_id: string;
      embedding_model?: string;
    }>;
  }>;
};

export const AGENTS_CATALOG: CatalogAgent[] = [
  {
    agent_id: '00000000-0000-0000-0000-000000000001',
    name: 'agente-de-teste',
    system_prompt: 'Você é um assistente técnico. Sempre use suas tools para buscar informacoes.',
    goal: 'Responder curto e objetivamente.',
    llm_model: 'Qwen/Qwen3-30B-A3B-Instruct-2507-FP8',
    tools: [
      {
        name: 'test',
        description: 'tool de teste para RAG',
        type: 'RAG',
        active: true,
        kb: [
          {
            kb_id: '750',
            name: 'kbdoseuale',
            edgesql_db_id: 'kbdoseuale',
            embedding_model: 'Qwen/Qwen3-Embedding-4B',
          },
          {
            kb_id: '762',
            name: 'bancodocopilot',
            edgesql_db_id: 'bancodocopilot',
            embedding_model: 'Qwen/Qwen3-Embedding-4B',
          }
        ],
      },
    ],
  },
];
