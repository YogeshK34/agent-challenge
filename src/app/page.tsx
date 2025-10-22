"use client"

import { useCoAgent, useCopilotAction, useCopilotReadable } from "@copilotkit/react-core"
import { type CopilotKitCSSProperties, CopilotSidebar } from "@copilotkit/react-ui"
import { useMemo, useState, useEffect } from "react"
import type { StoryState as StoryStateSchema } from "@/mastra/agents/state"
import type { z } from "zod"
import { agentCatalog, defaultAgentId } from "@/mastra/agents/meta"
import { TEMPLATES, getTemplateById, type TemplateId } from "@/mastra/agents/templates"
import { Sparkles, User, Globe, Zap, X, BookOpen, Wand2, ArrowLeft } from "lucide-react"

type StoryState = z.infer<typeof StoryStateSchema>

type SetupStage =
  | "intro"
  | "character-count"
  | "character-selection"
  | "world-note-count"
  | "world-note-selection"
  | "plot-beat-count"
  | "plot-beat-selection"
  | "complete"

const TEMPLATE_WALLPAPERS: Record<TemplateId, string> = {
  whimsical: "/whimsical.png",
  thriller: "/thrill.png",
  "epic-lore": "/epic-lore.png",
  romance: "/romantic.png",
  "sci-fi": "/sci-fi.png",
  fantasy: "/fantasy.png",
  horror: "/horror.png",
  cyberpunk: "/cyberphunk.png",
}

export default function CopilotKitPage() {
  const [themeColor, setThemeColor] = useState("#6366f1")
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId | null>(null)
  const [storyStats, setStoryStats] = useState({ characters: 0, worldNotes: 0, plotBeats: 0 })
  const [resetStoryCallback, setResetStoryCallback] = useState<(() => void) | null>(null)

  const currentAgent = agentCatalog[defaultAgentId]
  const currentWallpaper = selectedTemplate ? TEMPLATE_WALLPAPERS[selectedTemplate] : null

  const dynamicLabels = useMemo(() => {
    if (!selectedTemplate) {
      return {
        title: "Storyteller AI",
        initial:
          'Pick a template to seed your world, or say "Start with Fantasy".\n\nAfter that, try:\n- Add a character with a secret\n- Set style to noir and continue the scene\n- Offer 3 next plot options with pros/cons',
      }
    }

    const template = getTemplateById(selectedTemplate)
    if (!template) {
      return {
        title: "Storyteller AI",
        initial: "Ready to craft your story!",
      }
    }

    const initialMessage = `${template.emoji} **${template.label} Story Mode**

Welcome! Let's build your story together.

**You need 3 things:**
1. Characters - The people in your story
2. World Notes - The setting and environment  
3. Plot Beats - Key story moments

👈 **Use the selection panel on the left to make your choices!**

Once you've completed all selections, I'll show you story prompts to get started.`

    return {
      title: `${template.emoji} ${template.label} Storyteller`,
      initial: initialMessage,
    }
  }, [selectedTemplate])

  return (
    <main
      style={{ "--copilot-kit-primary-color": themeColor } as CopilotKitCSSProperties}
      className="min-h-screen p-4 md:p-6 lg:p-8"
    >
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 animate-gradient-shift -z-10" />

      {/* Gradient mesh overlay */}
      <div className="fixed inset-0 opacity-30 -z-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full blur-3xl animate-float-slow" />
      </div>

      <header className="max-w-[1800px] mx-auto mb-4 md:mb-6 animate-fade-in">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-xl opacity-30 animate-pulse-slow" />
              <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 p-2 sm:p-3 rounded-2xl shadow-lg">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-slate-900 tracking-tight">
                Story Forge
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm md:text-base mt-0.5 font-light">
                Craft narratives with AI-powered precision
              </p>
            </div>
          </div>

          {!selectedTemplate && (
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full shadow-sm">
              <div className="relative">
                <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse" />
                <div className="absolute inset-0 w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-ping opacity-75" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-900 whitespace-nowrap">
                {currentAgent.label} Agent
              </span>
            </div>
          )}

          {selectedTemplate && (
            <button
              onClick={() => {
                if (resetStoryCallback) {
                  resetStoryCallback()
                }
              }}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-300 hover:border-indigo-400 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group touch-manipulation"
              aria-label="Back to templates"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 group-hover:text-indigo-600 transition-colors" />
              <span className="text-sm sm:text-base font-medium text-slate-700 group-hover:text-indigo-700 transition-colors hidden sm:inline">
                Back
              </span>
            </button>
          )}
        </div>
      </header>

      {/* Main container with rounded corners and padding (blue container from wireframe) */}
      <div className="max-w-[1800px] mx-auto h-[calc(100vh-8rem)] md:h-[calc(100vh-10rem)] lg:h-[calc(100vh-12rem)] flex flex-col gap-4 md:gap-6 min-h-0">
        {/* Two-column content area (templates on left, chat on right) */}
        <div className="flex-1 flex flex-col lg:flex-row gap-4 md:gap-6 min-h-0">
          {/* Main content area (templates/story board) - pink section from wireframe */}
          <div className="flex-1 bg-white/90 backdrop-blur-sm rounded-3xl p-4 md:p-6 shadow-lg border-2 border-slate-200 overflow-y-auto animate-slide-up">
            <YourMainContent
              themeColor={themeColor}
              setThemeColor={setThemeColor}
              currentAgent={currentAgent}
              selectedTemplate={selectedTemplate}
              setSelectedTemplate={setSelectedTemplate}
              setStoryStats={setStoryStats}
              setResetStoryCallback={setResetStoryCallback}
            />
          </div>

          <div
            className="lg:w-[400px] xl:w-[450px] rounded-3xl shadow-lg border-2 border-slate-200 overflow-hidden animate-slide-up flex flex-col relative"
            style={{
              animationDelay: "100ms",
              backgroundImage: currentWallpaper ? `url(${currentWallpaper})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="absolute inset-0 bg-white/40 backdrop-blur-sm" />
            <div className="relative z-10 h-full">
              <CopilotSidebar clickOutsideToClose={false} defaultOpen={true} labels={dynamicLabels} />
            </div>
          </div>
        </div>

        {/* Footer Section (pink section from wireframe) */}
        <footer
          className="bg-gradient-to-br from-slate-50 to-indigo-50 backdrop-blur-sm rounded-3xl p-4 md:p-6 shadow-lg border-2 border-slate-200 animate-fade-in"
          style={{ animationDelay: "200ms" }}
        >
          <FooterStats selectedTemplate={selectedTemplate} storyStats={storyStats} />
        </footer>
      </div>
    </main>
  )
}

function YourMainContent({
  themeColor,
  setThemeColor,
  currentAgent,
  selectedTemplate,
  setSelectedTemplate,
  setStoryStats,
  setResetStoryCallback,
}: {
  themeColor: string
  setThemeColor: (color: string) => void
  currentAgent: any
  selectedTemplate: TemplateId | null
  setSelectedTemplate: (template: TemplateId | null) => void
  setStoryStats: (stats: { characters: number; worldNotes: number; plotBeats: number }) => void
  setResetStoryCallback: (callback: () => void) => void
}) {
  const { state, setState } = useCoAgent<StoryState>({
    name: "storyAgent",
    initialState: {
      characters: [],
      worldNotes: [],
      plotBeats: [],
      stylePreset: "neutral",
      toneHints: [],
      branches: [],
      lastPlan: "",
      userProfile: { name: "", preferences: [] },
      narrativeSettings: { pov: "third", tense: "past", pacing: "balanced", readingLevel: "standard" },
      constraints: { avoidTopics: [], contentWarnings: [] },
      canonFacts: [],
      themes: [],
    },
  })

  const [setupStage, setSetupStage] = useState<SetupStage>("intro")
  const [targetCharacterCount, setTargetCharacterCount] = useState(0)
  const [targetWorldNoteCount, setTargetWorldNoteCount] = useState(0)
  const [targetPlotBeatCount, setTargetPlotBeatCount] = useState(0)

  useEffect(() => {
    if (selectedTemplate && setupStage === "intro") {
      // Automatically move to character count selection after a brief delay
      const timer = setTimeout(() => {
        setSetupStage("character-count")
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [selectedTemplate, setupStage])

  useEffect(() => {
    setStoryStats({
      characters: state.characters?.length ?? 0,
      worldNotes: state.worldNotes?.length ?? 0,
      plotBeats: state.plotBeats?.length ?? 0,
    })
  }, [state.characters, state.worldNotes, state.plotBeats, setStoryStats])

  useCopilotReadable({
    description: "Current story state and setup progress",
    value: {
      setupStage,
      selectedTemplate,
      setupComplete: setupStage === "complete",
      characters: state.characters,
      worldNotes: state.worldNotes,
      plotBeats: state.plotBeats,
    },
  })

  useCopilotAction({
    name: "setThemeColor",
    parameters: [
      { name: "themeColor", description: "The theme color to set. Make sure to pick nice colors.", required: true },
    ],
    handler({ themeColor }) {
      setThemeColor(themeColor)
    },
  })

  useCopilotAction({
    name: "askCharacterCount",
    description: "Present options for how many characters the user wants to add",
    parameters: [],
    handler() {
      setSetupStage("character-count")
    },
  })

  useCopilotAction({
    name: "presentCharacterOptions",
    description: "Show character options from the template for user to select",
    parameters: [],
    handler() {},
  })

  useCopilotAction({
    name: "askWorldNoteCount",
    description: "Present options for how many world notes the user wants to add",
    parameters: [],
    handler() {
      setSetupStage("world-note-count")
    },
  })

  useCopilotAction({
    name: "presentWorldNoteOptions",
    description: "Show world note options from the template for user to select",
    parameters: [],
    handler() {},
  })

  useCopilotAction({
    name: "askPlotBeatCount",
    description: "Present options for how many plot beats the user wants to add",
    parameters: [],
    handler() {
      setSetupStage("plot-beat-count")
    },
  })

  useCopilotAction({
    name: "presentPlotBeatOptions",
    description: "Show plot beat options from the template for user to select",
    parameters: [],
    handler() {},
  })

  useCopilotAction({
    name: "showStoryPrompts",
    description: "Show story prompts after all selections are complete",
    parameters: [],
    handler() {},
  })

  useCopilotAction({
    name: "updateWorkingMemory",
    available: "frontend",
    parameters: [
      { name: "memory", description: "Optional wrapper with memory updates", required: false },
      { name: "characters", required: false },
      { name: "worldNotes", required: false },
      { name: "plotBeats", required: false },
      { name: "stylePreset", required: false },
      { name: "toneHints", required: false },
      { name: "branches", required: false },
      { name: "lastPlan", required: false },
      { name: "userProfile", required: false },
      { name: "narrativeSettings", required: false },
      { name: "constraints", required: false },
      { name: "canonFacts", required: false },
      { name: "themes", required: false },
    ],
  })

  const applyTemplate = (id: TemplateId) => {
    const t = getTemplateById(id)
    if (!t) return
    setSelectedTemplate(id)
    setSetupStage("intro")
    setState({
      ...state,
      ...(t.patch.stylePreset ? { stylePreset: t.patch.stylePreset } : {}),
      ...(t.patch.toneHints ? { toneHints: t.patch.toneHints } : {}),
      ...(t.patch.themes ? { themes: t.patch.themes } : {}),
      ...(t.patch.canonFacts ? { canonFacts: t.patch.canonFacts } : {}),
      characters: [],
      worldNotes: [],
      plotBeats: [],
    })
  }

  const resetStory = () => {
    setSelectedTemplate(null)
    setSetupStage("intro")
    setTargetCharacterCount(0)
    setTargetWorldNoteCount(0)
    setTargetPlotBeatCount(0)
    setState({
      characters: [],
      worldNotes: [],
      plotBeats: [],
      stylePreset: "neutral",
      toneHints: [],
      branches: [],
      lastPlan: "",
      userProfile: { name: "", preferences: [] },
      narrativeSettings: { pov: "third", tense: "past", pacing: "balanced", readingLevel: "standard" },
      constraints: { avoidTopics: [], contentWarnings: [] },
      canonFacts: [],
      themes: [],
    })
    setStoryStats({ characters: 0, worldNotes: 0, plotBeats: 0 })
  }

  useEffect(() => {
    setResetStoryCallback(() => resetStory)
  }, [setResetStoryCallback])

  const showPicker = useMemo(() => {
    return !selectedTemplate
  }, [selectedTemplate])

  const template = selectedTemplate ? getTemplateById(selectedTemplate) : null
  const characterOptions = template?.patch.characters || []
  const worldNoteOptions = template?.patch.worldNotes || []
  const plotBeatOptions = template?.patch.plotBeats || []

  return (
    <div className="space-y-6">
      {showPicker ? (
        <TemplatePicker onSelect={applyTemplate} />
      ) : (
        <>
          {setupStage !== "complete" && (
            <div className="mb-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6 border-2 border-indigo-200 shadow-lg">
              <div className="mb-4">
                <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">Story Setup</h3>
                <p className="text-sm text-slate-600">Complete the following steps to build your story foundation</p>
              </div>

              {/* Character Count Selection */}
              {setupStage === "character-count" && (
                <div className="animate-fade-in">
                  <p className="font-semibold text-slate-900 mb-4">Q. Select the number of characters:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[1, 2, 3, 4].map((count) => (
                      <button
                        key={count}
                        onClick={() => {
                          setTargetCharacterCount(count)
                          setSetupStage("character-selection")
                        }}
                        className="px-6 py-4 bg-gradient-to-br from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-lg rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Character Selection */}
              {setupStage === "character-selection" && (
                <div className="animate-fade-in">
                  <p className="font-semibold text-slate-900 mb-2">
                    Q. Select from the below characters or create your own
                  </p>
                  <p className="text-sm text-slate-600 mb-4">
                    (Select {targetCharacterCount} character(s) - {state.characters?.length ?? 0} selected)
                  </p>
                  <div className="space-y-2">
                    {characterOptions.map((char, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          const newCharacters = [...(state.characters || []), char]
                          setState({ ...state, characters: newCharacters })

                          if (newCharacters.length >= targetCharacterCount) {
                            setSetupStage("world-note-count")
                          }
                        }}
                        disabled={(state.characters?.length ?? 0) >= targetCharacterCount}
                        className="w-full px-4 py-3 bg-gradient-to-br from-rose-100 to-pink-100 hover:from-rose-200 hover:to-pink-200 disabled:from-slate-100 disabled:to-slate-100 disabled:cursor-not-allowed text-slate-900 font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-left"
                      >
                        {char}
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        const customChar = prompt("Enter your character name:")
                        if (customChar) {
                          const newCharacters = [...(state.characters || []), customChar]
                          setState({ ...state, characters: newCharacters })

                          if (newCharacters.length >= targetCharacterCount) {
                            setSetupStage("world-note-count")
                          }
                        }
                      }}
                      disabled={(state.characters?.length ?? 0) >= targetCharacterCount}
                      className="w-full px-4 py-3 bg-gradient-to-br from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 disabled:from-slate-50 disabled:to-slate-50 disabled:cursor-not-allowed text-slate-900 font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border-2 border-dashed border-slate-400"
                    >
                      Name your character
                    </button>
                  </div>
                </div>
              )}

              {/* World Note Count Selection */}
              {setupStage === "world-note-count" && (
                <div className="animate-fade-in">
                  <p className="font-semibold text-slate-900 mb-4">Q. Select the number of world notes:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[1, 2, 3, 4].map((count) => (
                      <button
                        key={count}
                        onClick={() => {
                          setTargetWorldNoteCount(count)
                          setSetupStage("world-note-selection")
                        }}
                        className="px-6 py-4 bg-gradient-to-br from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-lg rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* World Note Selection */}
              {setupStage === "world-note-selection" && (
                <div className="animate-fade-in">
                  <p className="font-semibold text-slate-900 mb-2">
                    Q. Select from the below world notes or create your own
                  </p>
                  <p className="text-sm text-slate-600 mb-4">
                    (Select {targetWorldNoteCount} world note(s) - {state.worldNotes?.length ?? 0} selected)
                  </p>
                  <div className="space-y-2">
                    {worldNoteOptions.map((note, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          const newWorldNotes = [...(state.worldNotes || []), note]
                          setState({ ...state, worldNotes: newWorldNotes })

                          if (newWorldNotes.length >= targetWorldNoteCount) {
                            setSetupStage("plot-beat-count")
                          }
                        }}
                        disabled={(state.worldNotes?.length ?? 0) >= targetWorldNoteCount}
                        className="w-full px-4 py-3 bg-gradient-to-br from-emerald-100 to-teal-100 hover:from-emerald-200 hover:to-teal-200 disabled:from-slate-100 disabled:to-slate-100 disabled:cursor-not-allowed text-slate-900 font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-left"
                      >
                        {note}
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        const customNote = prompt("Enter your world note:")
                        if (customNote) {
                          const newWorldNotes = [...(state.worldNotes || []), customNote]
                          setState({ ...state, worldNotes: newWorldNotes })

                          if (newWorldNotes.length >= targetWorldNoteCount) {
                            setSetupStage("plot-beat-count")
                          }
                        }
                      }}
                      disabled={(state.worldNotes?.length ?? 0) >= targetWorldNoteCount}
                      className="w-full px-4 py-3 bg-gradient-to-br from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 disabled:from-slate-50 disabled:to-slate-50 disabled:cursor-not-allowed text-slate-900 font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border-2 border-dashed border-slate-400"
                    >
                      Create your own world note
                    </button>
                  </div>
                </div>
              )}

              {/* Plot Beat Count Selection */}
              {setupStage === "plot-beat-count" && (
                <div className="animate-fade-in">
                  <p className="font-semibold text-slate-900 mb-4">Q. Select the number of plot beats:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[1, 2, 3, 4].map((count) => (
                      <button
                        key={count}
                        onClick={() => {
                          setTargetPlotBeatCount(count)
                          setSetupStage("plot-beat-selection")
                        }}
                        className="px-6 py-4 bg-gradient-to-br from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-lg rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Plot Beat Selection */}
              {setupStage === "plot-beat-selection" && (
                <div className="animate-fade-in">
                  <p className="font-semibold text-slate-900 mb-2">
                    Q. Select from the below plot beats or create your own
                  </p>
                  <p className="text-sm text-slate-600 mb-4">
                    (Select {targetPlotBeatCount} plot beat(s) - {state.plotBeats?.length ?? 0} selected)
                  </p>
                  <div className="space-y-2">
                    {plotBeatOptions.map((beat, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          const newPlotBeats = [...(state.plotBeats || []), beat]
                          setState({ ...state, plotBeats: newPlotBeats })

                          if (newPlotBeats.length >= targetPlotBeatCount) {
                            setSetupStage("complete")
                          }
                        }}
                        disabled={(state.plotBeats?.length ?? 0) >= targetPlotBeatCount}
                        className="w-full px-4 py-3 bg-gradient-to-br from-amber-100 to-orange-100 hover:from-amber-200 hover:to-orange-200 disabled:from-slate-100 disabled:to-slate-100 disabled:cursor-not-allowed text-slate-900 font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-left"
                      >
                        {beat}
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        const customBeat = prompt("Enter your plot beat:")
                        if (customBeat) {
                          const newPlotBeats = [...(state.plotBeats || []), customBeat]
                          setState({ ...state, plotBeats: newPlotBeats })

                          if (newPlotBeats.length >= targetPlotBeatCount) {
                            setSetupStage("complete")
                          }
                        }
                      }}
                      disabled={(state.plotBeats?.length ?? 0) >= targetPlotBeatCount}
                      className="w-full px-4 py-3 bg-gradient-to-br from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 disabled:from-slate-50 disabled:to-slate-50 disabled:cursor-not-allowed text-slate-900 font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border-2 border-dashed border-slate-400"
                    >
                      Create your own plot beat
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {setupStage === "complete" && template && (
            <div className="mb-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-6 border-2 border-green-200 shadow-lg animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-serif font-bold text-slate-900">Setup Complete! 🎉</h3>
              </div>
              <p className="text-slate-700 mb-4">Your story foundation is ready. Try these prompts in the chat:</p>
              <ul className="space-y-2 mb-4">
                {template.examples?.plotBeats?.slice(0, 3).map((prompt: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-base text-slate-700">
                    <span className="text-green-600 font-bold">•</span>
                    <span>"{prompt}"</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-slate-600">You can also:</p>
              <ul className="text-sm text-slate-600 space-y-1 mt-1">
                <li>• Add more characters fitting this genre</li>
                <li>• Expand the world with {template.label.toLowerCase()} elements</li>
                <li>• Continue the plot with genre-appropriate twists</li>
              </ul>
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Characters Section */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-gradient-to-br from-rose-500 to-pink-500 rounded-lg shadow-md">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h2 className="text-lg sm:text-xl font-serif font-bold text-slate-900">Characters</h2>
              </div>

              <div className="space-y-2">
                {state.characters?.map((c, index) => (
                  <div
                    key={index}
                    className="group relative bg-white/90 backdrop-blur-sm border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-xl hover:border-rose-300 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative">
                      <p className="text-sm text-slate-800 leading-relaxed pr-8">{c}</p>
                      <button
                        onClick={() =>
                          setState({ ...state, characters: state.characters?.filter((_, i) => i !== index) })
                        }
                        className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1.5 shadow-lg hover:scale-110 touch-manipulation"
                        aria-label="Remove character"
                      >
                        <X className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {state.characters?.length === 0 && (
                  <div className="bg-white/50 backdrop-blur-sm border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center">
                    <User className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs sm:text-sm text-slate-500 italic">
                      No characters yet. Select from the options in chat.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* World Notes Section */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg shadow-md">
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h2 className="text-lg sm:text-xl font-serif font-bold text-slate-900">World Notes</h2>
              </div>

              <div className="space-y-2">
                {state.worldNotes?.map((n, index) => (
                  <div
                    key={index}
                    className="group relative bg-white/90 backdrop-blur-sm border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative">
                      <p className="text-sm text-slate-800 leading-relaxed pr-8">{n}</p>
                      <button
                        onClick={() =>
                          setState({ ...state, worldNotes: state.worldNotes?.filter((_, i) => i !== index) })
                        }
                        className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full p-1.5 shadow-lg hover:scale-110 touch-manipulation"
                        aria-label="Remove world note"
                      >
                        <X className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {state.worldNotes?.length === 0 && (
                  <div className="bg-white/50 backdrop-blur-sm border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center">
                    <Globe className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs sm:text-sm text-slate-500 italic">
                      No world notes yet. Select from the options in chat.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Plot Beats Section */}
            <section className="space-y-3 md:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg shadow-md">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h2 className="text-lg sm:text-xl font-serif font-bold text-slate-900">Plot Beats</h2>
              </div>

              <div className="space-y-2">
                {state.plotBeats?.map((b, index) => (
                  <div
                    key={index}
                    className="group relative bg-white/90 backdrop-blur-sm border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-xl hover:border-amber-300 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-start gap-2">
                      <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">
                        {index + 1}
                      </div>
                      <p className="text-sm text-slate-800 leading-relaxed flex-1 pr-8">{b}</p>
                      <button
                        onClick={() =>
                          setState({ ...state, plotBeats: state.plotBeats?.filter((_, i) => i !== index) })
                        }
                        className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-amber-500 hover:bg-amber-600 text-white rounded-full p-1.5 shadow-lg hover:scale-110 touch-manipulation"
                        aria-label="Remove plot beat"
                      >
                        <X className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {state.plotBeats?.length === 0 && (
                  <div className="bg-white/50 backdrop-blur-sm border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center">
                    <Zap className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs sm:text-sm text-slate-500 italic">
                      No plot beats yet. Select from the options in chat.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  )
}

function FooterStats({
  selectedTemplate,
  storyStats,
}: {
  selectedTemplate: TemplateId | null
  storyStats: { characters: number; worldNotes: number; plotBeats: number }
}) {
  if (!selectedTemplate) {
    return (
      <div className="text-center">
        <p className="text-slate-600 text-sm">Select a template to begin your storytelling journey</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
      <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-4 border border-rose-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-600 font-medium mb-1">Characters</p>
            <p className="text-2xl font-serif font-bold text-slate-900">{storyStats.characters}</p>
          </div>
          <div className="p-2 bg-white rounded-xl shadow-sm">
            <User className="w-5 h-5 text-rose-600" />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-600 font-medium mb-1">World Elements</p>
            <p className="text-2xl font-serif font-bold text-slate-900">{storyStats.worldNotes}</p>
          </div>
          <div className="p-2 bg-white rounded-xl shadow-sm">
            <Globe className="w-5 h-5 text-emerald-600" />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-600 font-medium mb-1">Story Progress</p>
            <p className="text-2xl font-serif font-bold text-slate-900">{storyStats.plotBeats}</p>
          </div>
          <div className="p-2 bg-white rounded-xl shadow-sm">
            <Zap className="w-5 h-5 text-amber-600" />
          </div>
        </div>
      </div>
    </div>
  )
}

function TemplatePicker({ onSelect }: { onSelect: (id: TemplateId) => void }) {
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 sm:gap-3 mb-3">
          <div className="p-2 sm:p-3 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl shadow-lg">
            <Wand2 className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">Choose Your Genre</h2>
        </div>
        <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Start with a curated template and interactively build your story by selecting characters, world notes, and
          plot beats through the chat.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TEMPLATES.map((t, idx) => (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            className="group relative bg-white/90 backdrop-blur-sm border-2 border-slate-200 hover:border-indigo-400 rounded-3xl p-4 sm:p-5 text-left transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 animate-slide-up touch-manipulation"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-slate-100 to-slate-200 group-hover:from-indigo-100 group-hover:to-purple-100 rounded-2xl mb-3 text-2xl sm:text-3xl shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                {t.emoji}
              </div>

              <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 mb-2 group-hover:text-indigo-700 transition-colors">
                {t.label}
              </h3>

              <p className="text-slate-600 text-xs sm:text-sm mb-3 leading-relaxed line-clamp-2">{t.description}</p>

              {t.patch.themes && t.patch.themes.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {t.patch.themes.slice(0, 3).map((theme, i) => (
                    <span
                      key={i}
                      className="px-2 sm:px-3 py-0.5 sm:py-1 bg-slate-100 group-hover:bg-indigo-100 text-slate-700 group-hover:text-indigo-700 text-xs font-medium rounded-full transition-colors"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              )}

              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
