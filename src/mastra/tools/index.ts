// src/mastra/tools/index.ts
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const generateCharacterTool = createTool({
  id: 'generate-character',
  description: 'Generate a character with background, traits, and motivations',
  inputSchema: z.object({
    name: z.string().optional(),
    role: z.string().describe('Character role (protagonist, antagonist, mentor, etc.)'),
    setting: z.string().describe('Story setting/world'),
  }),
  outputSchema: z.object({
    name: z.string(),
    background: z.string(),
    traits: z.array(z.string()),
    motivations: z.array(z.string()),
  }),
  execute: async ({ context }) => {
    // Character generation logic
    return {
      name: context.name || "Generated Name",
      background: "Character background...",
      traits: ["brave", "curious"],
      motivations: ["seek truth", "protect loved ones"],
    };
  },
});

export const plotTwistGeneratorTool = createTool({
  id: 'generate-plot-twist',
  description: 'Generate unexpected plot twist ideas based on current story state',
  inputSchema: z.object({
    currentPlot: z.string().describe('Current plot summary'),
    genre: z.string().describe('Story genre'),
  }),
  outputSchema: z.object({
    twists: z.array(z.object({
      twist: z.string(),
      impact: z.string(),
    })),
  }),
  execute: async ({ context }) => {
    // Plot twist generation logic
    return {
      twists: [
        { twist: "The mentor is actually...", impact: "Changes everything" },
      ],
    };
  },
});

export const worldBuildingTool = createTool({
  id: 'world-building',
  description: 'Generate world-building details (locations, cultures, rules)',
  inputSchema: z.object({
    worldType: z.string().describe('Type of world (fantasy, sci-fi, modern, etc.)'),
    element: z.enum(['location', 'culture', 'magic-system', 'technology']),
  }),
  outputSchema: z.object({
    details: z.string(),
    keyFeatures: z.array(z.string()),
  }),
  execute: async ({ context }) => {
    // World building logic
    return {
      details: "World building details...",
      keyFeatures: ["feature1", "feature2"],
    };
  },
});