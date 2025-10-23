import { User, Globe, Zap } from "lucide-react"
import type { TemplateId } from "@/mastra/agents/templates"
import type { StoryStats } from "@/types/story"

interface FooterStatsProps {
  selectedTemplate: TemplateId | null
  storyStats: StoryStats
}

export function FooterStats({ selectedTemplate, storyStats }: FooterStatsProps) {
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
