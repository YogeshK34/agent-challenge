"use client"

import { useCoAgent, useCopilotAction, useCopilotChat } from "@copilotkit/react-core"
import { type CopilotKitCSSProperties, CopilotSidebar } from "@copilotkit/react-ui"
import { useMemo, useState } from "react"
import type { StoryState as StoryStateSchema } from "@/mastra/agents/state"
import type { z } from "zod"
import { agentCatalog, defaultAgentId } from "@/mastra/agents/meta"
import { TEMPLATES, getTemplateById, type TemplateId } from "@/mastra/agents/templates"
import { Sparkles, User, Globe, Zap, X, BookOpen, Wand2, ArrowLeft } from "lucide-react"

type StoryState = z.infer<typeof StoryStateSchema>

export default function CopilotKitPage() {
  const [themeColor, setThemeColor] = useState("#6366f1")

  const currentAgent = agentCatalog[defaultAgentId]

  return (
    <main style={{ "--copilot-kit-primary-color": themeColor } as CopilotKitCSSProperties}>
      <YourMainContent themeColor={themeColor} setThemeColor={setThemeColor} currentAgent={currentAgent} />
      <CopilotSidebar
        clickOutsideToClose={false}
        defaultOpen={true}
        labels={{
          title: "Storyteller AI",
          initial:
            'Pick a template to seed your world, or say "Start with Fantasy".\n\nAfter that, try:\n- Add a character with a secret\n- Set style to noir and continue the scene\n- Offer 3 next plot options with pros/cons',
        }}
      />
    </main>
  )
}


function YourMainContent({
  themeColor,
  setThemeColor,
  currentAgent,
}: { themeColor: string; setThemeColor: (color: string) => void; currentAgent: any }) {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId | null>(null)

  // Add CopilotKit chat hook to send prompts
  const { appendMessage } = useCopilotChat();
  const sendMessage = appendMessage;

  // Define template-specific suggested prompts
  const templatePrompts: Record<TemplateId, string[]> = {
    whimsical: [
      "Add a talking animal character.",
      "Describe a magical event in the market.",
      "Continue the story with a playful twist.",
    ],
    thriller: [
      "Introduce a mysterious clue.",
      "Set the scene in a dark alley.",
      "Offer three suspenseful plot options.",
    ],
    "epic-lore": [
      "Add a legendary artifact.",
      "Describe a mythic event in the world.",
      "Continue with a solemn tone.",
    ],
    romance: [
      "Add a romantic interest.",
      "Describe a heartfelt moment.",
      "Continue with an emotional twist.",
    ],
    "sci-fi": [
      "Introduce a futuristic technology.",
      "Describe an alien world element.",
      "Continue with a bold discovery.",
    ],
    fantasy: [
      "Add a magical creature.",
      "Describe a prophecy.",
      "Continue with a heroic quest.",
    ],
  }

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
    // To hide the memory updates tab, comment out or remove the render property below:
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
  }

  const showPicker = useMemo(() => {
    const empty =
      (state.characters?.length ?? 0) === 0 &&
      (state.worldNotes?.length ?? 0) === 0 &&
      (state.plotBeats?.length ?? 0) === 0
    return empty && !selectedTemplate
  }, [state, selectedTemplate])

  return (
    <div className="min-h-screen relative overflow-hidden p-3 sm:p-4 md:p-6 lg:p-8 lg:pr-[420px]">
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 animate-gradient-shift" />

      {/* Gradient mesh overlay */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full blur-3xl animate-float-slow" />
      </div>

      {/* Decorative grid pattern */}
      <div
        className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Content container with backdrop blur */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="mb-8 md:mb-12 animate-fade-in">
          <div className="flex items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl sm:rounded-2xl blur-xl opacity-30 animate-pulse-slow" />
                <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 p-2 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl shadow-lg">
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-slate-900 tracking-tight">
                  Story Forge
                </h1>
                <p className="text-slate-600 text-sm sm:text-base md:text-lg mt-0.5 sm:mt-1 font-light">
                  Craft narratives with AI-powered precision
                </p>
              </div>
            </div>

            {!showPicker && (
              <button
                onClick={resetStory}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white/80 backdrop-blur-sm border border-slate-300 hover:border-indigo-400 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group touch-manipulation"
                aria-label="Back to templates"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 group-hover:text-indigo-600 transition-colors" />
                <span className="text-sm sm:text-base font-medium text-slate-700 group-hover:text-indigo-700 transition-colors hidden sm:inline">
                  Back to Templates
                </span>
              </button>
            )}
          </div>

          {/* Agent Badge */}
          <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-5 py-2 sm:py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full shadow-sm hover:shadow-md transition-all duration-300 max-w-full overflow-x-auto">
            <div className="relative flex-shrink-0">
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse" />
              <div className="absolute inset-0 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-ping opacity-75" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-slate-900 whitespace-nowrap">
              {currentAgent.label} Agent
            </span>
            <span className="text-xs sm:text-sm text-slate-500 hidden sm:inline">—</span>
            <span className="text-xs sm:text-sm text-slate-600 hidden sm:inline">{currentAgent.description}</span>
          </div>
        </header>

        {showPicker ? (
          <TemplatePicker onSelect={applyTemplate} />
        ) : (
          <>
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {/* Characters Section */}
              <section className="space-y-3 md:space-y-4 animate-slide-up" style={{ animationDelay: "100ms" }}>
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="p-1.5 sm:p-2 bg-gradient-to-br from-rose-500 to-pink-500 rounded-lg shadow-md">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">Characters</h2>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  {state.characters?.map((c, index) => (
                    <div
                      key={index}
                      className="group relative bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 shadow-sm hover:shadow-xl hover:border-rose-300 transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative">
                        <p className="text-sm sm:text-base text-slate-800 leading-relaxed pr-8">{c}</p>
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
                    <div className="bg-white/50 backdrop-blur-sm border-2 border-dashed border-slate-300 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center">
                      <User className="w-10 h-10 sm:w-12 sm:h-12 text-slate-400 mx-auto mb-2 sm:mb-3" />
                      <p className="text-xs sm:text-sm text-slate-500 italic">
                        No characters yet. Ask the storyteller to add some.
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* World Notes Section */}
              <section className="space-y-3 md:space-y-4 animate-slide-up" style={{ animationDelay: "200ms" }}>
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="p-1.5 sm:p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg shadow-md">
                    <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">World Notes</h2>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  {state.worldNotes?.map((n, index) => (
                    <div
                      key={index}
                      className="group relative bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative">
                        <p className="text-sm sm:text-base text-slate-800 leading-relaxed pr-8">{n}</p>
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
                    <div className="bg-white/50 backdrop-blur-sm border-2 border-dashed border-slate-300 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center">
                      <Globe className="w-10 h-10 sm:w-12 sm:h-12 text-slate-400 mx-auto mb-2 sm:mb-3" />
                      <p className="text-xs sm:text-sm text-slate-500 italic">
                        No world notes yet. Ask the storyteller to add some.
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* Plot Beats Section */}
              <section
                className="space-y-3 md:space-y-4 animate-slide-up md:col-span-2 lg:col-span-1"
                style={{ animationDelay: "300ms" }}
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="p-1.5 sm:p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg shadow-md">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">Plot Beats</h2>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  {state.plotBeats?.map((b, index) => (
                    <div
                      key={index}
                      className="group relative bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 shadow-sm hover:shadow-xl hover:border-amber-300 transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative flex items-start gap-2 sm:gap-3">
                        <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">
                          {index + 1}
                        </div>
                        <p className="text-sm sm:text-base text-slate-800 leading-relaxed flex-1 pr-8">{b}</p>
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
                    <div className="bg-white/50 backdrop-blur-sm border-2 border-dashed border-slate-300 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center">
                      <Zap className="w-10 h-10 sm:w-12 sm:h-12 text-slate-400 mx-auto mb-2 sm:mb-3" />
                      <p className="text-xs sm:text-sm text-slate-500 italic">
                        No plot beats yet. Ask the storyteller to add some.
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </div>
            {/* Footer Stats */}
            <footer
              className="mt-8 md:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 animate-fade-in"
              style={{ animationDelay: "400ms" }}
            >
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-slate-600 font-medium mb-1">Total Characters</p>
                    <p className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                      {state.characters?.length || 0}
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-rose-100 to-pink-100 rounded-lg sm:rounded-xl">
                    <User className="w-5 h-5 sm:w-6 sm:h-6 text-rose-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-slate-600 font-medium mb-1">World Elements</p>
                    <p className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                      {state.worldNotes?.length || 0}
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg sm:rounded-xl">
                    <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-slate-600 font-medium mb-1">Story Progress</p>
                    <p className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                      {state.plotBeats?.length || 0}
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg sm:rounded-xl">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                  </div>
                </div>
              </div>
            </footer>
          </>
        )}
      </div>
    </div>
  )
}

function TemplatePicker({ onSelect }: { onSelect: (id: TemplateId) => void }) {
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8 md:mb-12">
        <div className="inline-flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="p-2 sm:p-3 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl sm:rounded-2xl shadow-lg">
            <Wand2 className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-slate-900">Choose Your Genre</h2>
        </div>
        <p className="text-slate-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed px-4">
          Start with a curated template to pre-populate your story with characters, world notes, and an opening plot
          beat. Each genre comes with its own unique flavor and style.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
        {TEMPLATES.map((t, idx) => (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            className="group relative bg-white/90 backdrop-blur-sm border-2 border-slate-200 hover:border-indigo-400 rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 text-left transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 animate-slide-up touch-manipulation"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Content */}
            <div className="relative">
              {/* Emoji badge */}
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-slate-100 to-slate-200 group-hover:from-indigo-100 group-hover:to-purple-100 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 text-2xl sm:text-3xl shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                {t.emoji}
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 mb-2 group-hover:text-indigo-700 transition-colors">
                {t.label}
              </h3>

              {/* Description */}
              <p className="text-slate-600 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">{t.description}</p>

              {/* Themes */}
              {t.patch.themes && t.patch.themes.length > 0 && (
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                  {t.patch.themes.map((theme, i) => (
                    <span
                      key={i}
                      className="px-2 sm:px-3 py-0.5 sm:py-1 bg-slate-100 group-hover:bg-indigo-100 text-slate-700 group-hover:text-indigo-700 text-xs font-medium rounded-full transition-colors"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              )}

              {/* Examples preview */}
              {t.examples && (
                <div className="space-y-1.5 sm:space-y-2 text-xs text-slate-500">
                  {t.examples.characters?.[0] && (
                    <div className="flex items-start gap-1.5 sm:gap-2">
                      <User className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-1">{t.examples.characters[0]}</span>
                    </div>
                  )}
                  {t.examples.worldNotes?.[0] && (
                    <div className="flex items-start gap-1.5 sm:gap-2">
                      <Globe className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-1">{t.examples.worldNotes[0]}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Hover indicator */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </div>
              </div>
            </div>
          </button>
        ))}

        {/* Start from Scratch option */}
        <button
          onClick={() => onSelect("fantasy")}
          className="group relative bg-gradient-to-br from-slate-50/90 to-slate-100/90 backdrop-blur-sm border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 text-left transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 animate-slide-up touch-manipulation"
          style={{ animationDelay: `${TEMPLATES.length * 50}ms` }}
        >
          <div className="relative">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white rounded-xl sm:rounded-2xl mb-3 sm:mb-4 text-2xl sm:text-3xl shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
              ✨
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 mb-2 group-hover:text-indigo-700 transition-colors">
              Start from Scratch
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Begin with an empty canvas and let your imagination guide the way. Perfect for experienced storytellers.
            </p>
          </div>
        </button>
      </div>

      {/* Bottom hint */}
      <div className="text-center mt-6 md:mt-8 animate-fade-in px-4" style={{ animationDelay: "400ms" }}>
        <p className="text-slate-500 text-xs sm:text-sm">
          You can always change the style and tone later by chatting with the Storyteller Agent
        </p>
      </div>
    </div>
  )
}
