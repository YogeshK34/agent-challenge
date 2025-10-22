"use client"

import { useCoAgent, useCopilotAction } from "@copilotkit/react-core"
import { type CopilotKitCSSProperties, CopilotSidebar } from "@copilotkit/react-ui"
import { useMemo, useState, useEffect } from "react"
import type { StoryState as StoryStateSchema } from "@/mastra/agents/state"
import type { z } from "zod"
import { agentCatalog, defaultAgentId } from "@/mastra/agents/meta"
import { TEMPLATES, getTemplateById, type TemplateId } from "@/mastra/agents/templates"
import { Sparkles, User, Globe, Zap, X, BookOpen, Wand2, ArrowLeft } from "lucide-react"

type StoryState = z.infer<typeof StoryStateSchema>

// Helper function for genre-specific prompts
function getGenreSpecificPrompts(templateId: TemplateId): string {
  const prompts: Record<TemplateId, string> = {
    whimsical: `- "Add a whimsical character who collects impossible things"
- "Describe a magical market that only appears at dawn"
- "What happens when the talking compass gets lost?"`,
    thriller: `- "Introduce a suspicious character with a hidden agenda"
- "Add a plot twist that changes everything"
- "What dark secret is the city hiding?"`,
    "epic-lore": `- "Reveal an ancient prophecy about the bell tower"
- "Add a legendary artifact with a terrible cost"
- "What empire fell here, and why?"`,
    romance: `- "Create a moment of unexpected connection"
- "Add a complication that tests their feelings"
- "What letter was never meant to be read?"`,
    "sci-fi": `- "Introduce an alien technology with ethical implications"
- "What does the bio-signal really mean?"
- "Add a scientific discovery that changes everything"`,
    fantasy: `- "Reveal the true power of the glass map"
- "Add a magical creature bound by ancient rules"
- "What destiny is Ari trying to escape?"`,
    horror: `- "Describe what Helena sees in the mirror"
- "Add a supernatural entity that feeds on fear"
- "What happened in room 237?"`,
    cyberpunk: `- "Introduce a corpo conspiracy that goes to the top"
- "What memories did Raze lose, and why?"
- "Add a black market deal that goes sideways"`,
  }

  return prompts[templateId] || "- Continue the story\n- Add a new character\n- Develop the world"
}

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

    // Build template-specific context
    const styleContext = template.patch.stylePreset ? `Style: ${template.patch.stylePreset}` : ""
    const toneContext = template.patch.toneHints?.length ? `Tone: ${template.patch.toneHints.join(", ")}` : ""
    const themesContext = template.patch.themes?.length ? `Themes: ${template.patch.themes.join(", ")}` : ""

    const initialMessage = `${template.emoji} **${template.label} Story Mode**

${styleContext}
${toneContext}
${themesContext}

**Try these ${template.label.toLowerCase()} prompts:**
${getGenreSpecificPrompts(selectedTemplate)}

You can also:
- Add more characters fitting this genre
- Expand the world with ${template.label.toLowerCase()} elements
- Continue the plot with genre-appropriate twists`

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
      <div className="max-w-[1800px] mx-auto h-[calc(100vh-8rem)] md:h-[calc(100vh-10rem)] lg:h-[calc(100vh-12rem)] flex flex-col gap-4 md:gap-6">
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

  useEffect(() => {
    setStoryStats({
      characters: state.characters?.length ?? 0,
      worldNotes: state.worldNotes?.length ?? 0,
      plotBeats: state.plotBeats?.length ?? 0,
    })
  }, [state.characters, state.worldNotes, state.plotBeats, setStoryStats])

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
    // render: ({ args }) => {
    //   const patch = (args as any)?.memory ?? args
    //   return (
    //     <div style={{ backgroundColor: themeColor }} className="rounded-2xl max-w-md w-full text-white p-4">
    //       <p className="font-semibold mb-2">Memory updated</p>
    //       <details className="mt-2">
    //         <summary className="cursor-pointer text-white/90 hover:text-white transition-colors">See updates</summary>
    //         <pre
    //           style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
    //           className="overflow-x-auto text-sm bg-white/20 p-4 rounded-lg mt-2"
    //         >
    //           {JSON.stringify(patch, null, 2)}
    //         </pre>
    //       </details>
    //     </div>
    //   )
    // },
  })

  const applyTemplate = (id: TemplateId) => {
    const t = getTemplateById(id)
    if (!t) return
    setSelectedTemplate(id)
    setState({
      ...state,
      ...(t.patch.characters ? { characters: t.patch.characters } : {}),
      ...(t.patch.worldNotes ? { worldNotes: t.patch.worldNotes } : {}),
      ...(t.patch.plotBeats ? { plotBeats: t.patch.plotBeats } : {}),
      ...(t.patch.stylePreset ? { stylePreset: t.patch.stylePreset } : {}),
      ...(t.patch.toneHints ? { toneHints: t.patch.toneHints } : {}),
      ...(t.patch.themes ? { themes: t.patch.themes } : {}),
      ...(t.patch.canonFacts ? { canonFacts: t.patch.canonFacts } : {}),
    })
  }

  const resetStory = () => {
    setSelectedTemplate(null)
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
    const empty =
      (state.characters?.length ?? 0) === 0 &&
      (state.worldNotes?.length ?? 0) === 0 &&
      (state.plotBeats?.length ?? 0) === 0
    return empty && !selectedTemplate
  }, [state, selectedTemplate])

  return (
    <>
      {showPicker ? (
        <TemplatePicker onSelect={applyTemplate} />
      ) : (
        <div className="space-y-6">
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
                      No characters yet. Ask the storyteller to add some.
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
                      No world notes yet. Ask the storyteller to add some.
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
                      No plot beats yet. Ask the storyteller to add some.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      )}
    </>
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
          Start with a curated template to pre-populate your story with characters, world notes, and an opening plot
          beat.
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
