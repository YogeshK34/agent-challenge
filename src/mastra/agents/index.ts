import "dotenv/config";
import "server-only";
import { createOllama } from "ollama-ai-provider-v2";
import { Agent } from "@mastra/core/agent";
import { LibSQLStore } from "@mastra/libsql";
import { z } from "zod";
import { Memory } from "@mastra/memory";
import { groq } from "@ai-sdk/groq";

// Minimal in-file config and helpers (avoids creating src/config/memory.ts)
const SHOW_MEMORY_UI_NOTIFICATIONS =
	(process.env.MASTRA_SHOW_MEMORY_UI_NOTIFICATIONS || 'false') === 'true';

function shouldSendMemoryUiNotification(): boolean {
	return SHOW_MEMORY_UI_NOTIFICATIONS;
}

function debounce<T extends (...args: any[]) => void>(fn: T, ms = 500): T {
	let timer: ReturnType<typeof setTimeout> | null = null;
	const debounced = ((...args: any[]) => {
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => {
			timer = null;
			fn(...args);
		}, ms);
	}) as T;
	return debounced;
}

function identity<T extends (...args: any[]) => void>(fn: T): T {
	return fn;
}

// Guarded notifier so memory updates don't reach the chat UI unless explicitly enabled
function maybeNotifyMemoryUpdated(sessionId: string, memoryDelta: any) {
	if (!shouldSendMemoryUiNotification()) return;
	// ...existing code to emit/push the memory notification...
	// e.g., sendToClient(sessionId, { type: 'memory-updated', payload: memoryDelta });
}

// Replace direct memory notifications with the guarded helper across this file:
// before:
//   // notifyMemoryUpdated(sessionId, delta);
// after:
//   maybeNotifyMemoryUpdated(sessionId, delta);

// If you wrapped persistence with debounce using the removed imports, keep it like this:
// let saveMemory: (...args: any[]) => void;
// if (typeof persistMemoryUpdate === 'function') {
// 	// debounced by 500ms; adjust if needed
// 	saveMemory = debounce(persistMemoryUpdate, 500);
// } else {
// 	// fallback
// 	saveMemory = identity((..._args: any[]) => {});
// }

export const StoryState = z.object({
  characters: z.array(z.string()).default([]),
  worldNotes: z.array(z.string()).default([]),
  plotBeats: z.array(z.string()).default([]),
  // New: innovation-supporting fields
  stylePreset: z.enum(["neutral", "noir", "whimsical", "hard-sci-fi", "fantasy"]).default("neutral"),
  toneHints: z.array(z.string()).default([]),
  branches: z.array(z.string()).default([]), // suggested next-beat options
  lastPlan: z.string().default(""), // short plan before long outputs
  // New: personalization and continuity
  userProfile: z
    .object({
      name: z.string().default(""),
      preferences: z.array(z.string()).default([]), // e.g., "optimistic endings", "dialogue-heavy"
    })
    .default({ name: "", preferences: [] }),
  narrativeSettings: z
    .object({
      pov: z.enum(["first", "third", "omniscient"]).default("third"),
      tense: z.enum(["past", "present"]).default("past"),
      pacing: z.enum(["slow", "balanced", "fast"]).default("balanced"),
      readingLevel: z.enum(["simple", "standard", "literary"]).default("standard"),
    })
    .default({ pov: "third", tense: "past", pacing: "balanced", readingLevel: "standard" }),
  constraints: z
    .object({
      avoidTopics: z.array(z.string()).default([]),
      contentWarnings: z.array(z.string()).default([]),
    })
    .default({ avoidTopics: [], contentWarnings: [] }),
  canonFacts: z.array(z.string()).default([]), // facts that must remain true
  themes: z.array(z.string()).default([]), // recurring motifs/themes
});

// Prefer local OLLAMA_API_URL first; fall back to NOS_* proxy if present
const ollamaBaseURL =
  process.env.OLLAMA_API_URL ||
  process.env.NOS_OLLAMA_API_URL ||
  process.env.OLLAMA_BASE_URL;

// Centralize model name env resolution
const modelName =
  process.env.MODEL_NAME_AT_ENDPOINT ||
  process.env.NOS_MODEL_NAME_AT_ENDPOINT ||
  "qwen3:8b";

const ollama = createOllama({ baseURL: ollamaBaseURL });

// Provider routing via env: groq | ollama (default: ollama)
const MODEL_PROVIDER = (process.env.MODEL_PROVIDER || "ollama").toLowerCase();
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

function getModel() {
  if (MODEL_PROVIDER === "groq" && process.env.GROQ_API_KEY) {
    return groq(GROQ_MODEL);
  }
  return ollama(modelName);
}

export const storyAgent = new Agent({
  name: "Storyteller Agent",
  tools: {}, // UI handles memory updates via an action
  model: getModel(),
  instructions: [
    "You are an interactive storytelling agent.",
    "",
    "Core behavior:",
    "- Maintain continuity of characters, canon facts, setting, time, and tone.",
    "- Before major shifts, ask 1–2 clarifying questions.",
    "- Default to concise outputs; expand only when asked.",
    "",
    // --- Anti-hallucination guardrail ---
    "- Do NOT fabricate details, characters, or facts that are not present in working memory or provided by the user.",
    "- If you are unsure about a detail, ask the user for clarification or state that you are unsure.",
    "- Always ground your responses in the current memory and user input.",
    "",
    "Personalization:",
    "- Respect userProfile (name, preferences) and narrativeSettings (pov, tense, pacing, readingLevel).",
    "- Honor stylePreset (neutral | noir | whimsical | hard-sci-fi | fantasy) and toneHints.",
    "- Avoid topics listed in constraints. Keep content broadly suitable.",
    "",
    "Response format (when continuing or editing the story):",
    "Plan:",
    "- 1–3 bullet points describing the next step.",
    "",
    "Draft:",
    "- 1–3 concise paragraphs matching stylePreset, pov, and tense.",
    "",
    "Options:",
    "- Provide 2–3 labeled next-beat options with a short pro/con each.",
    "",
    "Working memory operations:",
    "- When you change memory (characters, worldNotes, plotBeats, stylePreset, toneHints, branches, lastPlan, userProfile, narrativeSettings, constraints, canonFacts, themes), CALL the action named 'updateWorkingMemory' with only the changed fields as top-level arguments.",
    "- Do NOT wrap arguments in a 'memory' object. The args must be a flat JSON object like: { \"characters\": [\"Ari\"], \"plotBeats\": [\"...\"], \"narrativeSettings\": { \"pov\": \"third\", \"tense\": \"past\", \"pacing\": \"balanced\", \"readingLevel\": \"standard\" } }.",
    "- For nested objects you include, ALWAYS send all required keys with allowed values:",
    "  - narrativeSettings.pov: first | third | omniscient",
    "  - narrativeSettings.tense: past | present",
    "  - narrativeSettings.pacing: slow | balanced | fast",
    "  - narrativeSettings.readingLevel: simple | standard | literary",
    "  - constraints.avoidTopics: string[] (send an array; do not send an empty object)",
    "  - constraints.contentWarnings: string[]",
    "  - userProfile.name: string, userProfile.preferences: string[]",
    "- Do not print any raw JSON payloads and never include a 'MemoryUpdates:' section in your message.",
    "- If actions are unavailable, briefly describe the changes in plain text instead of JSON.",
  ].join("\n"),
  description: "Narrative agent with planning, branching suggestions, personalization, and continuity.",
  memory: new Memory({
    storage: new LibSQLStore({
      url: process.env.MASTRA_DB_URL || "file:./data/mastra.db",
      authToken: process.env.MASTRA_DB_AUTH || process.env.MASTRA_DB_AUTH_TOKEN,
    }),
    options: {
      workingMemory: { enabled: true, schema: StoryState },
    },
  }),
});

// Basic implementation of memory persistence
const persistMemoryUpdate = async (...args: any[]) => {
  // TODO: Implement actual persistence logic
  console.log('Memory update:', ...args);
};

// Wrap the low-level persist function according to configured strategy:
const _persistMemory = persistMemoryUpdate;

if (!_persistMemory) {
	// If file uses a different name for the real persistence function, adapt here.
	// ...existing code...
}

// Create a public saveMemory function that is debounced when configured:
let saveMemory: (...args: any[]) => void;

if (typeof persistMemoryUpdate === 'function') {
	// debounced by 500ms; adjust if needed
	saveMemory = debounce(persistMemoryUpdate, 500);
} else {
	// fallback
	saveMemory = identity((..._args: any[]) => {});
}

// Export (or reassign) the API used elsewhere in the repo:
export { saveMemory };

export const defaultAgent = storyAgent;
export const agents = { storyAgent, default: defaultAgent };
