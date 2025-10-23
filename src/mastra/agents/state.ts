import { z } from "zod"

export const AgentState = z.object({
  proverbs: z.array(z.string()).default([]),
})

export const StoryState = z.object({
  characters: z.array(z.string()).default([]),
  worldNotes: z.array(z.string()).default([]),
  plotBeats: z.array(z.string()).default([]),
  stylePreset: z.enum(["neutral", "noir", "whimsical", "hard-sci-fi", "fantasy"]).default("neutral"),
  toneHints: z.array(z.string()).default([]),
  branches: z.array(z.any()).default([]),
  lastPlan: z.string().default(""),
  
  // NEW: Story progression tracking
  storyProgress: z.enum(["beginning", "middle", "climax", "ending", "complete"]).default("beginning"),
  plotBeatsResolved: z.number().default(0),
  turnCount: z.number().default(0), // Track conversation turns
  
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