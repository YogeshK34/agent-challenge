"use client"

import { useCoAgent, useCopilotAction, useCopilotReadable } from "@copilotkit/react-core"
import { useState, useEffect, useMemo } from "react"
import { User, Globe, Zap, X, Sparkles, ArrowLeft } from "lucide-react"
import { getTemplateById } from "@/mastra/agents/templates"
import { TemplatePicker } from "./TemplatePicker"
import type { StoryState, SetupStage, MainContentProps } from "@/types/story"

export function YourMainContent({
  themeColor,
  setThemeColor,
  currentAgent,
  selectedTemplate,
  setSelectedTemplate,
  setStoryStats,
  setResetStoryCallback,
}: MainContentProps) {
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
      storyProgress: "beginning",
      plotBeatsResolved: 0,
      turnCount: 0,
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
    description:
      "Update the working memory with story state changes. Pass only the fields that need to be updated as flat top-level arguments.",
    parameters: [
      {
        name: "characters",
        description: "Array of character names",
        type: "object[]",
        required: false,
      },
      {
        name: "worldNotes",
        description: "Array of world building notes",
        type: "object[]",
        required: false,
      },
      {
        name: "plotBeats",
        description: "Array of plot beats",
        type: "object[]",
        required: false,
      },
      {
        name: "stylePreset",
        description: "Style preset: neutral | noir | whimsical | hard-sci-fi | fantasy",
        type: "string",
        required: false,
      },
      {
        name: "toneHints",
        description: "Array of tone hints",
        type: "object[]",
        required: false,
      },
      {
        name: "branches",
        description: "Array of story branch options",
        type: "object[]",
        required: false,
      },
      {
        name: "lastPlan",
        description: "Last plan text",
        type: "string",
        required: false,
      },
      {
        name: "storyProgress",
        description: "Story progress stage: beginning | middle | climax | ending | complete",
        type: "string",
        required: false,
      },
      {
        name: "plotBeatsResolved",
        description: "Number of plot beats resolved",
        type: "number",
        required: false,
      },
      {
        name: "turnCount",
        description: "Number of conversation turns",
        type: "number",
        required: false,
      },
      {
        name: "userProfile",
        description: "User profile object with name and preferences",
        type: "object",
        required: false,
      },
      {
        name: "narrativeSettings",
        description: "Narrative settings object with pov, tense, pacing, readingLevel",
        type: "object",
        required: false,
      },
      {
        name: "constraints",
        description: "Constraints object with avoidTopics and contentWarnings arrays",
        type: "object",
        required: false,
      },
      {
        name: "canonFacts",
        description: "Array of canonical facts",
        type: "object[]",
        required: false,
      },
      {
        name: "themes",
        description: "Array of story themes",
        type: "object[]",
        required: false,
      },
    ],
    handler: (args: any) => {
      console.log("updateWorkingMemory called with:", args)

      setState((prevState) => {
        const updates: Partial<StoryState> = {}

        if (args.characters !== undefined) updates.characters = args.characters
        if (args.worldNotes !== undefined) updates.worldNotes = args.worldNotes
        if (args.plotBeats !== undefined) updates.plotBeats = args.plotBeats
        if (args.stylePreset !== undefined) updates.stylePreset = args.stylePreset as StoryState["stylePreset"]
        if (args.toneHints !== undefined) updates.toneHints = args.toneHints
        if (args.branches !== undefined) updates.branches = args.branches
        if (args.lastPlan !== undefined) updates.lastPlan = args.lastPlan
        if (args.storyProgress !== undefined) updates.storyProgress = args.storyProgress as StoryState["storyProgress"]
        if (args.plotBeatsResolved !== undefined) updates.plotBeatsResolved = args.plotBeatsResolved
        if (args.turnCount !== undefined) updates.turnCount = args.turnCount
        if (args.userProfile !== undefined) updates.userProfile = args.userProfile
        if (args.narrativeSettings !== undefined) updates.narrativeSettings = args.narrativeSettings
        if (args.constraints !== undefined) updates.constraints = args.constraints
        if (args.canonFacts !== undefined) updates.canonFacts = args.canonFacts
        if (args.themes !== undefined) updates.themes = args.themes

        return {
          ...prevState!,
          ...updates,
        }
      })
    },
  })

  const applyTemplate = (id: any) => {
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
      storyProgress: "beginning",
      plotBeatsResolved: 0,
      turnCount: 0,
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
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-slate-900 mb-1">
                        Q. Select from the below characters or create your own
                      </p>
                      <p className="text-sm text-slate-600">
                        (Select {targetCharacterCount} character(s) - {state.characters?.length ?? 0} selected)
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setState({ ...state, characters: [] })
                        setSetupStage("character-count")
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium rounded-lg transition-all"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                  </div>

                  {state.characters && state.characters.length > 0 && (
                    <div className="mb-3 p-3 bg-rose-50 border border-rose-200 rounded-xl">
                      <p className="text-xs font-semibold text-rose-900 mb-2">Selected:</p>
                      <div className="flex flex-wrap gap-2">
                        {state.characters.map((char, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-rose-200 text-rose-900 text-xs font-medium rounded-lg"
                          >
                            {char}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    {characterOptions.map((char, idx) => {
                      const isSelected = state.characters?.includes(char)
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            if (isSelected) {
                              setState({ ...state, characters: state.characters?.filter((c) => c !== char) })
                            } else {
                              const newCharacters = [...(state.characters || []), char]
                              setState({ ...state, characters: newCharacters })

                              if (newCharacters.length >= targetCharacterCount) {
                                setTimeout(() => setSetupStage("world-note-count"), 300)
                              }
                            }
                          }}
                          disabled={!isSelected && (state.characters?.length ?? 0) >= targetCharacterCount}
                          className={`px-3 py-2 font-medium rounded-lg shadow-sm transition-all duration-200 text-left text-sm ${
                            isSelected
                              ? "bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-md"
                              : "bg-gradient-to-br from-rose-100 to-pink-100 hover:from-rose-200 hover:to-pink-200 text-slate-900 disabled:from-slate-100 disabled:to-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                          }`}
                        >
                          {char}
                        </button>
                      )
                    })}
                    <button
                      onClick={() => {
                        const customChar = prompt("Enter your character name:")
                        if (customChar) {
                          const newCharacters = [...(state.characters || []), customChar]
                          setState({ ...state, characters: newCharacters })

                          if (newCharacters.length >= targetCharacterCount) {
                            setTimeout(() => setSetupStage("world-note-count"), 300)
                          }
                        }
                      }}
                      disabled={(state.characters?.length ?? 0) >= targetCharacterCount}
                      className="col-span-2 px-3 py-2 bg-gradient-to-br from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 disabled:from-slate-50 disabled:to-slate-50 disabled:cursor-not-allowed disabled:opacity-50 text-slate-900 font-medium rounded-lg shadow-sm transition-all duration-200 border-2 border-dashed border-slate-400 text-sm"
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
                    {[1, 2].map((count) => (
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
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-slate-900 mb-1">
                        Q. Select from the below world notes or create your own
                      </p>
                      <p className="text-sm text-slate-600">
                        (Select {targetWorldNoteCount} world note(s) - {state.worldNotes?.length ?? 0} selected)
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setState({ ...state, worldNotes: [] })
                        setSetupStage("world-note-count")
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium rounded-lg transition-all"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                  </div>

                  {state.worldNotes && state.worldNotes.length > 0 && (
                    <div className="mb-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <p className="text-xs font-semibold text-emerald-900 mb-2">Selected:</p>
                      <div className="flex flex-wrap gap-2">
                        {state.worldNotes.map((note, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-emerald-200 text-emerald-900 text-xs font-medium rounded-lg"
                          >
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    {worldNoteOptions.map((note, idx) => {
                      const isSelected = state.worldNotes?.includes(note)
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            if (isSelected) {
                              setState({ ...state, worldNotes: state.worldNotes?.filter((n) => n !== note) })
                            } else {
                              const newWorldNotes = [...(state.worldNotes || []), note]
                              setState({ ...state, worldNotes: newWorldNotes })

                              if (newWorldNotes.length >= targetWorldNoteCount) {
                                setTimeout(() => setSetupStage("plot-beat-count"), 300)
                              }
                            }
                          }}
                          disabled={!isSelected && (state.worldNotes?.length ?? 0) >= targetWorldNoteCount}
                          className={`px-3 py-2 font-medium rounded-lg shadow-sm transition-all duration-200 text-left text-sm ${
                            isSelected
                              ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md"
                              : "bg-gradient-to-br from-emerald-100 to-teal-100 hover:from-emerald-200 hover:to-teal-200 text-slate-900 disabled:from-slate-100 disabled:to-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                          }`}
                        >
                          {note}
                        </button>
                      )
                    })}
                    <button
                      onClick={() => {
                        const customNote = prompt("Enter your world note:")
                        if (customNote) {
                          const newWorldNotes = [...(state.worldNotes || []), customNote]
                          setState({ ...state, worldNotes: newWorldNotes })

                          if (newWorldNotes.length >= targetWorldNoteCount) {
                            setTimeout(() => setSetupStage("plot-beat-count"), 300)
                          }
                        }
                      }}
                      disabled={(state.worldNotes?.length ?? 0) >= targetWorldNoteCount}
                      className="col-span-2 px-3 py-2 bg-gradient-to-br from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 disabled:from-slate-50 disabled:to-slate-50 disabled:cursor-not-allowed disabled:opacity-50 text-slate-900 font-medium rounded-lg shadow-sm transition-all duration-200 border-2 border-dashed border-slate-400 text-sm"
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
                    {[1, 2].map((count) => (
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
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-slate-900 mb-1">
                        Q. Select from the below plot beats or create your own
                      </p>
                      <p className="text-sm text-slate-600">
                        (Select {targetPlotBeatCount} plot beat(s) - {state.plotBeats?.length ?? 0} selected)
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setState({ ...state, plotBeats: [] })
                        setSetupStage("plot-beat-count")
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium rounded-lg transition-all"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                  </div>

                  {state.plotBeats && state.plotBeats.length > 0 && (
                    <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                      <p className="text-xs font-semibold text-amber-900 mb-2">Selected:</p>
                      <div className="flex flex-wrap gap-2">
                        {state.plotBeats.map((beat, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-amber-200 text-amber-900 text-xs font-medium rounded-lg"
                          >
                            {beat}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    {plotBeatOptions.map((beat, idx) => {
                      const isSelected = state.plotBeats?.includes(beat)
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            if (isSelected) {
                              setState({ ...state, plotBeats: state.plotBeats?.filter((b) => b !== beat) })
                            } else {
                              const newPlotBeats = [...(state.plotBeats || []), beat]
                              setState({ ...state, plotBeats: newPlotBeats })

                              if (newPlotBeats.length >= targetPlotBeatCount) {
                                setTimeout(() => setSetupStage("complete"), 300)
                              }
                            }
                          }}
                          disabled={!isSelected && (state.plotBeats?.length ?? 0) >= targetPlotBeatCount}
                          className={`px-3 py-2 font-medium rounded-lg shadow-sm transition-all duration-200 text-left text-sm ${
                            isSelected
                              ? "bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md"
                              : "bg-gradient-to-br from-amber-100 to-orange-100 hover:from-amber-200 hover:to-orange-200 text-slate-900 disabled:from-slate-100 disabled:to-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                          }`}
                        >
                          {beat}
                        </button>
                      )
                    })}
                    <button
                      onClick={() => {
                        const customBeat = prompt("Enter your plot beat:")
                        if (customBeat) {
                          const newPlotBeats = [...(state.plotBeats || []), customBeat]
                          setState({ ...state, plotBeats: newPlotBeats })

                          if (newPlotBeats.length >= targetPlotBeatCount) {
                            setTimeout(() => setSetupStage("complete"), 300)
                          }
                        }
                      }}
                      disabled={(state.plotBeats?.length ?? 0) >= targetPlotBeatCount}
                      className="col-span-2 px-3 py-2 bg-gradient-to-br from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 disabled:from-slate-50 disabled:to-slate-50 disabled:cursor-not-allowed disabled:opacity-50 text-slate-900 font-medium rounded-lg shadow-sm transition-all duration-200 border-2 border-dashed border-slate-400 text-sm"
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
              <p className="text-slate-700 mb-4">
                Your story foundation is ready. Try these prompts in the chat to generate a complete story:
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start gap-2 text-base text-slate-700">
                  <span className="text-green-600 font-bold">•</span>
                  <span>
                    &quot;Start a complete {template.label.toLowerCase()} story using my selected characters, world
                    notes, and plot beats - give me the opening with next step options&quot;
                  </span>
                </li>
                <li className="flex items-start gap-2 text-base text-slate-700">
                  <span className="text-green-600 font-bold">•</span>
                  <span>
                    &quot;Generate the next chapter incorporating all my story elements with continuation choices&quot;
                  </span>
                </li>
                <li className="flex items-start gap-2 text-base text-slate-700">
                  <span className="text-green-600 font-bold">•</span>
                  <span>
                    &quot;Continue my {template.label.toLowerCase()} story weaving in these characters and plot
                    beats&quot;
                  </span>
                </li>
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
