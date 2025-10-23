"use client"

import { Wand2, Sparkles } from "lucide-react"
import { TEMPLATES, type TemplateId } from "@/mastra/agents/templates"

interface TemplatePickerProps {
  onSelect: (id: TemplateId) => void
}

export function TemplatePicker({ onSelect }: TemplatePickerProps) {
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
