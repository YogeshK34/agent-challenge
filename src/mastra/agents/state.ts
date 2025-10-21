import { z } from "zod";

export const AgentState = z.object({
  proverbs: z.array(z.string()).default([]),
});

export const StoryState = z.object({
  characters: z.array(z.string()).default([]),
  worldNotes: z.array(z.string()).default([]),
  plotBeats: z.array(z.string()).default([]),
});
