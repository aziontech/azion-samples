import { z } from 'zod';
import { AgentSchema } from '@/helpers/schema';
import { AGENTS_CATALOG } from '@/agentsCatalog';
import { v4 as uuidv4 } from 'uuid';

export type Agent = z.infer<typeof AgentSchema>;

// Minimal schema expected for catalog agents (TS file and request override)
const AgentCatalogAgentSchema = z.object({
  agent_id: z.string().uuid(),
  name: z.string(),
  system_prompt: z.string(),
  goal: z.string().optional(),
  llm_model: z.string(),
}).passthrough();

const AgentCatalogSchema = z.object({
  agents: z.array(AgentCatalogAgentSchema)
});

type CatalogAgent = z.infer<typeof AgentCatalogAgentSchema>;

function loadAgentsFromTsCatalog(): CatalogAgent[] {
  try {
    // Validate the imported catalog to ensure runtime safety
    const parsed = AgentCatalogSchema.parse({ agents: AGENTS_CATALOG });
    return parsed.agents;
  } catch (err) {
    console.error('Failed to validate agents from TS catalog:', err);
    return [];
  }
}

export async function resolveAgentByName(name: string, accountId: string, overrideAgents?: CatalogAgent[]): Promise<Agent | null> {
  const agents = Array.isArray(overrideAgents) ? overrideAgents : loadAgentsFromTsCatalog();
  const found = agents.find(a => a.name === name);
  if (!found) return null;
  // Construct a full Agent (AgentSchema) by injecting the current accountId
  const accountIdStr = typeof accountId === 'string' ? accountId : String(accountId);
  const validAccountId = z.string().uuid().safeParse(accountIdStr).success ? accountIdStr : uuidv4();
  const fullAgentCandidate = {
    ...found,
    account_id: validAccountId,
  };
  return AgentSchema.parse(fullAgentCandidate);
}
