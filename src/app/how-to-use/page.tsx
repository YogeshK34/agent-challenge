"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Sparkles } from "lucide-react"

export default function HowToUsePage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 animate-gradient-shift">
      {/* Animated floating background elements with sophisticated animations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-indigo-300 to-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delayed" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-gradient-to-br from-pink-300 to-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-slow" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <Link
            href="/"
            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 hover:text-indigo-600 hover:border-indigo-300 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span className="font-semibold">Back to App</span>
          </Link>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg">
            <Sparkles className="w-5 h-5" />
            <span className="font-bold">Story Forge Guide</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-12 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 text-balance">
            How to Use Story Forge
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto text-pretty font-medium">
            Follow these simple steps to craft your perfect story with AI-powered precision
          </p>
        </div>

        {/* Tutorial Steps */}
        <div className="space-y-12">
          {/* Step 1 */}
          <div
            className="animate-slide-up bg-white/90 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden border-2 border-white/50 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-xl shadow-lg">
                  1
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Select a template you like</h2>
              </div>
              <div className="rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <Image
                  src="/tutorial/step-1.png"
                  alt="Step 1: Select a template from genres like Whimsical, Suspense/Thriller, Epic Lore, Romance, Sci-Fi, or Fantasy"
                  width={1400}
                  height={800}
                  className="w-full h-auto"
                  priority
                />
              </div>
              <p className="mt-6 text-gray-700 text-lg leading-relaxed">
                Choose from eight unique story genres, each with curated themes and inspirations to kickstart your
                creative journey.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div
            className="animate-slide-up bg-white/90 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden border-2 border-white/50 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center font-bold text-xl shadow-lg">
                  2
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Complete the story setup</h2>
              </div>
              <div className="rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <Image
                  src="/tutorial/step-2.png"
                  alt="Step 2: Complete the story setup by selecting Characters, World Notes, and Plot Beats"
                  width={1400}
                  height={800}
                  className="w-full h-auto"
                />
              </div>
              <p className="mt-6 text-gray-700 text-lg leading-relaxed">
                Build your story foundation by selecting the number of characters, defining world notes, and choosing
                key plot beats through the interactive chat.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div
            className="animate-slide-up bg-white/90 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden border-2 border-white/50 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 text-white flex items-center justify-center font-bold text-xl shadow-lg">
                  3
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Copy prompts and start creating</h2>
              </div>
              <div className="rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <Image
                  src="/tutorial/step-3.png"
                  alt="Step 3: Copy the pre-existing prompts and paste in the chat-box to generate your story"
                  width={1400}
                  height={800}
                  className="w-full h-auto"
                />
              </div>
              <p className="mt-6 text-gray-700 text-lg leading-relaxed">
                Use the suggested prompts or create your own to generate story chapters. The AI will weave together your
                characters, world, and plot beats into a cohesive narrative.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center animate-slide-up" style={{ animationDelay: "0.5s" }}>
          <Link
            href="/"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-10 py-5 rounded-full font-bold text-lg hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1"
          >
            <Sparkles className="w-6 h-6" />
            Start Creating Your Story
          </Link>
        </div>
      </div>
    </div>
  )
}
