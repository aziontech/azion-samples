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
    name: 'agente-basico',
    system_prompt: 'Você é um assistente técnico. Sempre use suas tools para buscar informacoes.',
    goal: 'Responder curto e objetivamente.',
    llm_model: 'gpt-4o',
    tools: [
      {
        name: 'test',
        description: 'tool para RAG',
        type: 'RAG',
        active: true,
        kb: [
          {
            kb_id: '1',
            name: 'banco',
            edgesql_db_id: 'banco',
            embedding_model: 'text-embedding-3-small',
          }
        ],
      },
    ],
  },
];
