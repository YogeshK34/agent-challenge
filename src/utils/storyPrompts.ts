import { z } from "zod"
import type { TemplateId } from "@/mastra/agents/templates"

export const AgentState = z.object({
  proverbs: z.array(z.string()).default([]),
})

// Agent outputs should be grounded in this state; avoid hallucinating details not present here.
export const StoryState = z.object({
  characters: z.array(z.string()).default([]),
  worldNotes: z.array(z.string()).default([]),
  plotBeats: z.array(z.string()).default([]),
  stylePreset: z.enum(["neutral", "noir", "whimsical", "hard-sci-fi", "fantasy"]).default("neutral"),
  toneHints: z.array(z.string()).default([]),
  branches: z.array(z.any()).default([]),
  lastPlan: z.string().default(""),
  userProfile: z
    .object({
      name: z.string().default(""),
      preferences: z.array(z.string()).default([]),
    })
    .default({ name: "", preferences: [] }),
  narrativeSettings: z
    .object({
      pov: z.enum(["first", "second", "third"]).default("third"),
      tense: z.enum(["past", "present", "future"]).default("past"),
      pacing: z.enum(["slow", "balanced", "fast"]).default("balanced"),
      readingLevel: z.enum(["simple", "standard", "advanced"]).default("standard"),
    })
    .default({ pov: "third", tense: "past", pacing: "balanced", readingLevel: "standard" }),
  constraints: z
    .object({
      avoidTopics: z.array(z.string()).default([]),
      contentWarnings: z.array(z.string()).default([]),
    })
    .default({ avoidTopics: [], contentWarnings: [] }),
  canonFacts: z.array(z.string()).default([]),
  themes: z.array(z.string()).default([]),
})

export function getGenreSpecificPromptsArray(templateId: TemplateId): string[] {
  const prompts: Record<TemplateId, string[]> = {
    whimsical: [
      "Add a whimsical character who collects impossible things",
      "Describe a magical market that only appears at dawn",
      "What happens when the talking compass gets lost?",
    ],
    thriller: [
      "Introduce a suspicious character with a hidden agenda",
      "Add a plot twist that changes everything",
      "What dark secret is the city hiding?",
    ],
    "epic-lore": [
      "Reveal an ancient prophecy about the bell tower",
      "Add a legendary artifact with a terrible cost",
      "What empire fell here, and why?",
    ],
    romance: [
      "Create a moment of unexpected connection",
      "Add a complication that tests their feelings",
      "What letter was never meant to be read?",
    ],
    "sci-fi": [
      "Introduce an alien technology with ethical implications",
      "What does the bio-signal really mean?",
      "Add a scientific discovery that changes everything",
    ],
    fantasy: [
      "Reveal the true power of the glass map",
      "Add a magical creature bound by ancient rules",
      "What destiny is Ari trying to escape?",
    ],
    horror: [
      "Describe what Helena sees in the mirror",
      "Add a supernatural entity that feeds on fear",
      "What happened in room 237?",
    ],
    cyberpunk: [
      "Introduce a corpo conspiracy that goes to the top",
      "What memories did Raze lose, and why?",
      "Add a black market deal that goes sideways",
    ],
  }
  return prompts[templateId] || [
    "Continue the story",
    "Add a new character",
    "Develop the world",
  ]
}