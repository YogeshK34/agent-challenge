export type AgentId = "story";

export const agentCatalog: Record<
  AgentId,
  { id: AgentId; label: string; description: string }
> = {
  story: {
    id: "story",
    label: "Storyteller",
    description: "Interactive narrative generation with continuity.",
  },
};

export const defaultAgentId: AgentId = "story";
export const currentAgentInfo = agentCatalog[defaultAgentId];
