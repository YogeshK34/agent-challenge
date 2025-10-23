import type { z } from "zod"
import type { StoryState as StoryStateSchema } from "@/mastra/agents/state"
import type { TemplateId } from "@/mastra/agents/templates"

export type StoryState = z.infer<typeof StoryStateSchema>

export type SetupStage =
  | "intro"
  | "character-count"
  | "character-selection"
  | "world-note-count"
  | "world-note-selection"
  | "plot-beat-count"
  | "plot-beat-selection"
  | "complete"

export interface StoryStats {
  characters: number
  worldNotes: number
  plotBeats: number
}

export interface MainContentProps {
  themeColor: string
  setThemeColor: (color: string) => void
  currentAgent: any
  selectedTemplate: TemplateId | null
  setSelectedTemplate: (template: TemplateId | null) => void
  setStoryStats: (stats: StoryStats) => void
  setResetStoryCallback: (callback: () => void) => void
}
