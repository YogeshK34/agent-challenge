"use client"

import { useCoAgent, useCopilotAction } from "@copilotkit/react-core"
import { type CopilotKitCSSProperties, CopilotSidebar } from "@copilotkit/react-ui"
import { useState } from "react"
import { StoryState as StoryStateSchema } from "@/mastra/agents/state"
import { z } from "zod"
import { agentCatalog, defaultAgentId } from "@/mastra/agents/meta"
import { Sparkles, User, Globe, Zap, X } from "lucide-react"

type StoryState = z.infer<typeof StoryStateSchema>

export default function CopilotKitPage() {
  const [themeColor, setThemeColor] = useState("#2d3748")

  useCopilotAction({
    name: "setThemeColor",
    parameters: [
      { name: "themeColor", description: "The theme color to set. Make sure to pick nice colors.", required: true },
    ],
    handler({ themeColor }) {
      setThemeColor(themeColor)
    },
  })

  const currentAgent = agentCatalog[defaultAgentId]

  return (
    <main style={{ "--copilot-kit-primary-color": themeColor } as CopilotKitCSSProperties}>
      <YourMainContent themeColor={themeColor} currentAgent={currentAgent} />
      <CopilotSidebar
        clickOutsideToClose={false}
        defaultOpen={true}
        labels={{
          title: "Storyteller",
          initial:
            '🎭 You\'re chatting with the Storyteller Agent.\n\nTry:\n- "Add a character named Nyla, a curious explorer."\n- "Add world notes about an ancient floating city."\n- "Add a plot beat where Nyla finds a broken compass."\n- "Write the next paragraph in a whimsical tone."\n- "Remove the last plot beat and add a cliffhanger."',
        }}
      />
    </main>
  )
}

function YourMainContent({ themeColor, currentAgent }: { themeColor: string; currentAgent: any }) {
  // 🪁 Shared State
  const { state, setState } = useCoAgent<StoryState>({
    name: "storyAgent",
    initialState: {
      characters: ["Ari, a reluctant mage"],
      worldNotes: ["A misty archipelago connected by sky-bridges"],
      plotBeats: ["Ari discovers an old map etched into glass"],
    },
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="mb-12 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-xl opacity-30 animate-pulse-slow" />
              <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 p-4 rounded-2xl shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-slate-900 tracking-tight">Story Forge</h1>
              <p className="text-slate-600 text-lg mt-1 font-light">Craft narratives with AI-powered precision</p>
            </div>
          </div>

          {/* Agent Badge */}
          <div className="inline-flex items-center gap-3 px-5 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full shadow-sm hover:shadow-md transition-all duration-300">
            <div className="relative">
              <div className="w-2.5 h-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse" />
              <div className="absolute inset-0 w-2.5 h-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-ping opacity-75" />
            </div>
            <span className="text-sm font-semibold text-slate-900">{currentAgent.label} Agent</span>
            <span className="text-sm text-slate-500">—</span>
            <span className="text-sm text-slate-600">{currentAgent.description}</span>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Characters Section */}
          <section className="lg:col-span-1 space-y-4 animate-slide-up" style={{ animationDelay: "100ms" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-rose-500 to-pink-500 rounded-lg shadow-md">
                <User className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-slate-900">Characters</h2>
            </div>

            <div className="space-y-3">
              {state.characters?.map((c, index) => (
                <div
                  key={index}
                  className="group relative bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:border-rose-300 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <p className="text-slate-800 leading-relaxed pr-8">{c}</p>
                    <button
                      onClick={() =>
                        setState({ ...state, characters: state.characters?.filter((_, i) => i !== index) })
                      }
                      className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1.5 shadow-lg hover:scale-110"
                      aria-label="Remove character"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {state.characters?.length === 0 && (
                <div className="bg-white/50 border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center">
                  <User className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-500 italic">No characters yet. Ask the storyteller to add some.</p>
                </div>
              )}
            </div>
          </section>

          {/* World Notes Section */}
          <section className="lg:col-span-1 space-y-4 animate-slide-up" style={{ animationDelay: "200ms" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg shadow-md">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-slate-900">World Notes</h2>
            </div>

            <div className="space-y-3">
              {state.worldNotes?.map((n, index) => (
                <div
                  key={index}
                  className="group relative bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <p className="text-slate-800 leading-relaxed pr-8">{n}</p>
                    <button
                      onClick={() =>
                        setState({ ...state, worldNotes: state.worldNotes?.filter((_, i) => i !== index) })
                      }
                      className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full p-1.5 shadow-lg hover:scale-110"
                      aria-label="Remove world note"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {state.worldNotes?.length === 0 && (
                <div className="bg-white/50 border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center">
                  <Globe className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-500 italic">No world notes yet. Ask the storyteller to add some.</p>
                </div>
              )}
            </div>
          </section>

          {/* Plot Beats Section */}
          <section className="lg:col-span-1 space-y-4 animate-slide-up" style={{ animationDelay: "300ms" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg shadow-md">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-slate-900">Plot Beats</h2>
            </div>

            <div className="space-y-3">
              {state.plotBeats?.map((b, index) => (
                <div
                  key={index}
                  className="group relative bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:border-amber-300 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">
                      {index + 1}
                    </div>
                    <p className="text-slate-800 leading-relaxed flex-1 pr-8">{b}</p>
                    <button
                      onClick={() => setState({ ...state, plotBeats: state.plotBeats?.filter((_, i) => i !== index) })}
                      className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-amber-500 hover:bg-amber-600 text-white rounded-full p-1.5 shadow-lg hover:scale-110"
                      aria-label="Remove plot beat"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {state.plotBeats?.length === 0 && (
                <div className="bg-white/50 border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center">
                  <Zap className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-500 italic">No plot beats yet. Ask the storyteller to add some.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Footer Stats */}
        <footer
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in"
          style={{ animationDelay: "400ms" }}
        >
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium mb-1">Total Characters</p>
                <p className="text-3xl font-serif font-bold text-slate-900">{state.characters?.length || 0}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl">
                <User className="w-6 h-6 text-rose-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium mb-1">World Elements</p>
                <p className="text-3xl font-serif font-bold text-slate-900">{state.worldNotes?.length || 0}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl">
                <Globe className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium mb-1">Story Progress</p>
                <p className="text-3xl font-serif font-bold text-slate-900">{state.plotBeats?.length || 0}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl">
                <Zap className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
