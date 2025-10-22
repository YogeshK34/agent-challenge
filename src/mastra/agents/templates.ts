export type TemplateId = "whimsical" | "thriller" | "epic-lore" | "romance" | "sci-fi" | "fantasy"

export type Template = {
  id: TemplateId
  label: string
  emoji: string
  description: string
  patch: {
    characters?: string[]
    worldNotes?: string[]
    plotBeats?: string[]
    stylePreset?: "neutral" | "noir" | "whimsical" | "hard-sci-fi" | "fantasy"
    toneHints?: string[]
    themes?: string[]
    canonFacts?: string[]
  }
  examples?: {
    characters?: string[]
    worldNotes?: string[]
    plotBeats?: string[]
  }
}

export const TEMPLATES: Template[] = [
  {
    id: "whimsical",
    label: "Whimsical",
    emoji: "🎭",
    description: "Lighthearted, magical, quirky adventures.",
    patch: {
      stylePreset: "whimsical",
      toneHints: ["playful", "imaginative", "warm"],
      themes: ["Friendship", "Wonder", "Curiosity"],
      characters: ["Nyla, a curious explorer", "Pip, a talking compass"],
      worldNotes: ["Markets that float at dawn", "Postcards deliver themselves by breeze"],
      plotBeats: ["Nyla follows a giggling breeze into a hidden alley"],
      canonFacts: ["The wind sometimes speaks in riddles"],
    },
    examples: {
      characters: ["Talking animals", "Sentient artifacts"],
      worldNotes: ["Floating tea gardens", "Cloud bakeries"],
      plotBeats: ["A lost invitation to a sky parade"],
    },
  },
  {
    id: "thriller",
    label: "Suspense/Thriller",
    emoji: "🔪",
    description: "Mystery, tension, and twists.",
    patch: {
      stylePreset: "noir",
      toneHints: ["tense", "atmospheric", "gritty"],
      themes: ["Secrets", "Betrayal", "Obsession"],
      characters: ["Jade, an insomniac journalist", "The Caller, identity unknown"],
      worldNotes: ["City alleys stutter with flickering neon", "Police scanners hiss like rain"],
      plotBeats: ["A distorted voicemail names Jade as the next target"],
      canonFacts: ["The Caller always knows tomorrow's headlines"],
    },
  },
  {
    id: "epic-lore",
    label: "Epic Lore",
    emoji: "📚",
    description: "Mythic histories and world-building heavy tales.",
    patch: {
      stylePreset: "neutral",
      toneHints: ["mythic", "solemn", "expansive"],
      themes: ["Legacy", "Price of Power", "Cycles"],
      characters: ["Archivist Liora", "The Last Bellringer"],
      worldNotes: ["Empires record their reigns in living stone", "Bell towers thread time together"],
      plotBeats: ["A bell toll echoes from a tower sealed for a century"],
      canonFacts: ["Stone remembers every oath spoken upon it"],
    },
  },
  {
    id: "romance",
    label: "Romance",
    emoji: "💕",
    description: "Relationships, choices, and emotional arcs.",
    patch: {
      stylePreset: "neutral",
      toneHints: ["intimate", "sincere", "tender"],
      themes: ["Vulnerability", "Timing", "Second Chances"],
      characters: ["Mina, a pastry chef", "Elio, a street violinist"],
      worldNotes: ["A café where strangers leave letters for fate", "Moonlit bridges with secret inscriptions"],
      plotBeats: ["A misdelivered letter reopens a closed door"],
      canonFacts: ["Every bridge has a witness mark for true confessions"],
    },
  },
  {
    id: "sci-fi",
    label: "Sci‑Fi",
    emoji: "🚀",
    description: "Tech futures, strange worlds, bold exploration.",
    patch: {
      stylePreset: "hard-sci-fi",
      toneHints: ["curious", "precise", "awe"],
      themes: ["Discovery", "Ethics", "Adaptation"],
      characters: ["Dr. Rhea Kade, exoplanet biologist", "Unit K-17, a curious probe"],
      worldNotes: ["Tidal-locked planet with twilight cities", "Signal blooms that grow like coral"],
      plotBeats: ["A bio-signal matches Earth's prehistory"],
      canonFacts: ["K-17 is learning to want, against spec"],
    },
  },
  {
    id: "fantasy",
    label: "Fantasy",
    emoji: "⚔️",
    description: "Magic, quests, heroes, and ancient prophecies.",
    patch: {
      stylePreset: "fantasy",
      toneHints: ["heroic", "mystical", "lyrical"],
      themes: ["Destiny", "Courage", "Balance"],
      characters: ["Ari, a reluctant mage", "Seren, a lanternbound spirit"],
      worldNotes: ["A misty archipelago connected by sky-bridges", "Runes stitched into sails"],
      plotBeats: ["Ari discovers an old map etched into glass"],
      canonFacts: ["Lanterns glow brighter in the presence of true names"],
    },
  },
]

export const getTemplateById = (id: TemplateId) => TEMPLATES.find((t) => t.id === id)
