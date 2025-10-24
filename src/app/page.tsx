"use client"

import { type CopilotKitCSSProperties, CopilotSidebar } from "@copilotkit/react-ui"
import { useMemo, useState } from "react"
import { agentCatalog, defaultAgentId } from "@/mastra/agents/meta"
import { getTemplateById, type TemplateId } from "@/mastra/agents/templates"
import { BookOpen, ArrowLeft, HelpCircle } from "lucide-react"
import Link from "next/link"
import { YourMainContent } from "@/components/story/YourMainContent"
import { FooterStats } from "@/components/story/FooterStats"
import type { StoryStats } from "@/types/story"
import { TEMPLATE_WALLPAPERS } from "@/constants/story"

export default function CopilotKitPage() {
  const [themeColor, setThemeColor] = useState("#6366f1")
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId | null>(null)
  const [storyStats, setStoryStats] = useState<StoryStats>({ characters: 0, worldNotes: 0, plotBeats: 0 })
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

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/how-to-use"
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-300 hover:border-indigo-400 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group touch-manipulation"
              aria-label="How to use"
            >
              <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 group-hover:text-indigo-600 transition-colors" />
              <span className="text-sm sm:text-base font-medium text-slate-700 group-hover:text-indigo-700 transition-colors hidden sm:inline">
                How to Use
              </span>
            </Link>

            {!selectedTemplate && (
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full shadow-sm">
                <div className="absolute inset-0 w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse" />
                <div className="absolute inset-0 w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-ping opacity-75" />
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
        </div>
      </header>

      {/* Main container with rounded corners and padding */}
      <div className="max-w-[1800px] mx-auto h-[calc(100vh-8rem)] md:h-[calc(100vh-10rem)] lg:h-[calc(100vh-12rem)] flex flex-col gap-4 md:gap-6 min-h-0">
        {/* Two-column content area */}
        <div className="flex-1 flex flex-col lg:flex-row gap-4 md:gap-6 min-h-0">
          {/* Main content area - Narrower when template is selected to give chat more space */}
          <div
            className={`bg-white/90 backdrop-blur-sm rounded-3xl p-4 md:p-6 shadow-lg border-2 border-slate-200 overflow-y-auto animate-slide-up ${
              selectedTemplate ? "lg:w-[40%]" : "flex-1"
            }`}
          >
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

          {/* Chat sidebar - Much larger when template is selected for better story reading */}
          <div
            className={`h-[500px] lg:h-auto rounded-3xl shadow-lg border-2 border-slate-200 overflow-hidden animate-slide-up flex flex-col ${
              selectedTemplate ? "lg:w-[60%]" : "lg:w-[400px] xl:w-[450px]"
            }`}
            style={{
              animationDelay: "100ms",
              backgroundImage: currentWallpaper ? `url(${currentWallpaper})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="relative z-10 flex-1 flex flex-col bg-white/60">
              <CopilotSidebar
                clickOutsideToClose={false}
                defaultOpen={true}
                labels={dynamicLabels}
                className="copilot-sidebar-embedded"
              />
            </div>
          </div>
        </div>

        {/* Footer Section */}
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
