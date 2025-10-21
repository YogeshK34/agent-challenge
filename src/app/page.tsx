"use client";

import { useCoAgent, useCopilotAction } from "@copilotkit/react-core";
import { CopilotKitCSSProperties, CopilotSidebar } from "@copilotkit/react-ui";
import { useState } from "react";
import { StoryState as StoryStateSchema } from "@/mastra/agents/state";
import { z } from "zod";
import { agentCatalog, defaultAgentId } from "@/mastra/agents/meta";

type StoryState = z.infer<typeof StoryStateSchema>;

export default function CopilotKitPage() {
  const [themeColor, setThemeColor] = useState("#a855f7");

  useCopilotAction({
    name: "setThemeColor",
    parameters: [{ name: "themeColor", description: "The theme color to set. Make sure to pick nice colors.", required: true }],
    handler({ themeColor }) {
      setThemeColor(themeColor);
    },
  });

  const currentAgent = agentCatalog[defaultAgentId];
  const dotColor = "#a855f7";

  return (
    <main style={{ "--copilot-kit-primary-color": themeColor } as CopilotKitCSSProperties}>
      {/* Agent type banner */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 12px",
          marginBottom: 12,
          borderRadius: 12,
          background: "#f2f4f7",
          color: "#111827",
        }}
      >
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: dotColor,
            display: "inline-block",
          }}
        />
        <strong style={{ fontSize: 14 }}>{currentAgent.label} Agent</strong>
        <span style={{ fontSize: 13, color: "#4b5563" }}>— {currentAgent.description}</span>
      </div>

      <YourMainContent themeColor={themeColor} />
      <CopilotSidebar
        clickOutsideToClose={false}
        defaultOpen={true}
        labels={{
          title: "Storyteller",
          initial:
            "🎭 You’re chatting with the Storyteller Agent.\n\nTry:\n- “Add a character named Nyla, a curious explorer.”\n- “Add world notes about an ancient floating city.”\n- “Add a plot beat where Nyla finds a broken compass.”\n- “Write the next paragraph in a whimsical tone.”\n- “Remove the last plot beat and add a cliffhanger.”",
        }}
      />
    </main>
  );
}

function YourMainContent({ themeColor }: { themeColor: string }) {
  // 🪁 Shared State
  const { state, setState } = useCoAgent<StoryState>({
    name: "storyAgent", // was "assistantAgent"
    initialState: {
      characters: ["Ari, a reluctant mage"],
      worldNotes: ["A misty archipelago connected by sky-bridges"],
      plotBeats: ["Ari discovers an old map etched into glass"],
    },
  });

  return (
    <div
      style={{ backgroundColor: themeColor }}
      className="h-screen w-screen flex justify-center items-center flex-col transition-colors duration-300"
    >
      <div className="bg-white/20 backdrop-blur-md p-8 rounded-2xl shadow-xl max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-white mb-2 text-center">Story Board</h1>
        <p className="text-gray-200 text-center italic mb-6">
          Characters, world notes, and plot beats update as you collaborate with the agent.
        </p>
        <hr className="border-white/20 my-6" />

        {/* Characters */}
        <section className="mb-6">
          <h2 className="text-2xl text-white font-semibold mb-2">Characters</h2>
          <div className="flex flex-col gap-3">
            {state.characters?.map((c, index) => (
              <div key={index} className="bg-white/15 p-3 rounded-xl text-white relative group hover:bg-white/20 transition-all">
                <p className="pr-8">{c}</p>
                <button
                  onClick={() => setState({ ...state, characters: state.characters?.filter((_, i) => i !== index) })}
                  className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full h-6 w-6 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            ))}
            {state.characters?.length === 0 && (
              <p className="text-white/80 italic">No characters yet. Ask the storyteller to add some.</p>
            )}
          </div>
        </section>

        {/* World Notes */}
        <section className="mb-6">
          <h2 className="text-2xl text-white font-semibold mb-2">World Notes</h2>
          <div className="flex flex-col gap-3">
            {state.worldNotes?.map((n, index) => (
              <div key={index} className="bg-white/15 p-3 rounded-xl text-white relative group hover:bg-white/20 transition-all">
                <p className="pr-8">{n}</p>
                <button
                  onClick={() => setState({ ...state, worldNotes: state.worldNotes?.filter((_, i) => i !== index) })}
                  className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full h-6 w-6 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            ))}
            {state.worldNotes?.length === 0 && (
              <p className="text-white/80 italic">No notes yet. Ask the storyteller to add some.</p>
            )}
          </div>
        </section>

        {/* Plot Beats */}
        <section>
          <h2 className="text-2xl text-white font-semibold mb-2">Plot Beats</h2>
          <div className="flex flex-col gap-3">
            {state.plotBeats?.map((b, index) => (
              <div key={index} className="bg-white/15 p-3 rounded-xl text-white relative group hover:bg-white/20 transition-all">
                <p className="pr-8">{b}</p>
                <button
                  onClick={() => setState({ ...state, plotBeats: state.plotBeats?.filter((_, i) => i !== index) })}
                  className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full h-6 w-6 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            ))}
            {state.plotBeats?.length === 0 && (
              <p className="text-white/80 italic">No plot beats yet. Ask the storyteller to add some.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}