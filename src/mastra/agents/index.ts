import "dotenv/config";
import "server-only";
import { createOllama } from "ollama-ai-provider-v2";
import { Agent } from "@mastra/core/agent";
import { LibSQLStore } from "@mastra/libsql";
import { z } from "zod";
import { Memory } from "@mastra/memory";
import { groq } from "@ai-sdk/groq"; // + add Groq provider

export const StoryState = z.object({
  characters: z.array(z.string()).default([]),
  worldNotes: z.array(z.string()).default([]),
  plotBeats: z.array(z.string()).default([]),
  // New: innovation-supporting fields
  stylePreset: z.enum(["neutral", "noir", "whimsical", "hard-sci-fi", "fantasy"]).default("neutral"),
  toneHints: z.array(z.string()).default([]),
  branches: z.array(z.string()).default([]), // suggested next-beat options
  lastPlan: z.string().default(""), // short plan before long outputs
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

const ollama = createOllama({
  baseURL: ollamaBaseURL,
});

// + Provider routing via env: groq | ollama (default: ollama)
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
  tools: {}, // no tools needed; purely generative with memory
  // model: ollama(modelName),
  model: getModel(), // use Groq when MODEL_PROVIDER=groq, else Ollama
  instructions:
    "You are an interactive storytelling agent. Ask clarifying questions, maintain continuity of characters and settings, and adapt tone/genre on request. Keep outputs concise unless explicitly asked for longer content.",
  description: "Generates dynamic narratives with memory of characters, world notes, and plot beats.",
  memory: new Memory({
    storage: new LibSQLStore({ url: "file::memory:" }),
    options: {
      workingMemory: { enabled: true, schema: StoryState },
    },
  }),
});

export const defaultAgent = storyAgent;
export const agents = { storyAgent, default: defaultAgent };
