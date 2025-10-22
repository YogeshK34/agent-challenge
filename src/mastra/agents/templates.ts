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
    description: "Lighthearted, magical, quirky adventures. Inspired by Alice in Wonderland, Studio Ghibli, and Adventure Time.",
    patch: {
      stylePreset: "whimsical",
      toneHints: ["playful", "imaginative", "warm"],
      themes: ["Friendship", "Wonder", "Curiosity"],
      characters: [
        "Nyla, a curious explorer",
        "Pip, a talking compass",
        "Totoro, a gentle forest spirit (Ghibli)",
        "Finn, a brave adventurer (Adventure Time)"
      ],
      worldNotes: [
        "Markets that float at dawn",
        "Postcards deliver themselves by breeze",
        "Tea parties with the Mad Hatter (Alice in Wonderland)",
        "Catbus travels between magical realms (Ghibli)"
      ],
      plotBeats: ["Nyla follows a giggling breeze into a hidden alley"],
      canonFacts: ["The wind sometimes speaks in riddles"],
    },
    examples: {
      characters: ["Talking animals", "Sentient artifacts", "Totoro", "Finn & Jake"],
      worldNotes: ["Floating tea gardens", "Cloud bakeries", "Wonderland forests"],
      plotBeats: ["A lost invitation to a sky parade", "A mysterious portal opens in the forest"],
    },
  },
  {
    id: "thriller",
    label: "Suspense/Thriller",
    emoji: "🔪",
    description: "Mystery, tension, and twists. Think Sherlock Holmes, Stranger Things, and True Detective.",
    patch: {
      stylePreset: "noir",
      toneHints: ["tense", "atmospheric", "gritty"],
      themes: ["Secrets", "Betrayal", "Obsession"],
      characters: [
        "Jade, an insomniac journalist",
        "The Caller, identity unknown",
        "Eleven, a girl with psychic powers (Stranger Things)",
        "Detective Rust Cohle (True Detective)"
      ],
      worldNotes: [
        "City alleys stutter with flickering neon",
        "Police scanners hiss like rain",
        "The Upside Down leaks into reality (Stranger Things)",
        "Victorian London fog (Sherlock Holmes)"
      ],
      plotBeats: ["A distorted voicemail names Jade as the next target"],
      canonFacts: ["The Caller always knows tomorrow's headlines"],
    },
    examples: {
      characters: ["Sherlock Holmes", "Eleven", "Detective Cohle"],
      worldNotes: ["The Upside Down", "London fog"],
      plotBeats: ["A cryptic message appears on a wall", "A portal to another world opens"],
    },
  },
  {
    id: "epic-lore",
    label: "Epic Lore",
    emoji: "📚",
    description: "Mythic histories and world-building heavy tales. Inspired by Lord of the Rings, Game of Thrones, and Dune.",
    patch: {
      stylePreset: "neutral",
      toneHints: ["mythic", "solemn", "expansive"],
      themes: ["Legacy", "Price of Power", "Cycles"],
      characters: [
        "Archivist Liora",
        "The Last Bellringer",
        "Aragorn, the ranger king (Lord of the Rings)",
        "Daenerys Targaryen, Mother of Dragons (Game of Thrones)"
      ],
      worldNotes: [
        "Empires record their reigns in living stone",
        "Bell towers thread time together",
        "The Shire, a peaceful land (Lord of the Rings)",
        "Arrakis, desert planet (Dune)"
      ],
      plotBeats: ["A bell toll echoes from a tower sealed for a century"],
      canonFacts: ["Stone remembers every oath spoken upon it"],
    },
    examples: {
      characters: ["Aragorn", "Daenerys", "Paul Atreides"],
      worldNotes: ["The Shire", "Arrakis"],
      plotBeats: ["A prophecy is revealed", "A dragon returns to the kingdom"],
    },
  },
  {
    id: "romance",
    label: "Romance",
    emoji: "💕",
    description: "Relationships, choices, and emotional arcs. Inspired by Pride & Prejudice, Titanic, and La La Land.",
    patch: {
      stylePreset: "neutral",
      toneHints: ["intimate", "sincere", "tender"],
      themes: ["Vulnerability", "Timing", "Second Chances"],
      characters: [
        "Mina, a pastry chef",
        "Elio, a street violinist",
        "Elizabeth Bennet (Pride & Prejudice)",
        "Jack Dawson (Titanic)"
      ],
      worldNotes: [
        "A café where strangers leave letters for fate",
        "Moonlit bridges with secret inscriptions",
        "The ballroom from Titanic",
        "Jazz clubs of Los Angeles (La La Land)"
      ],
      plotBeats: ["A misdelivered letter reopens a closed door"],
      canonFacts: ["Every bridge has a witness mark for true confessions"],
    },
    examples: {
      characters: ["Elizabeth Bennet", "Jack Dawson", "Mia & Sebastian (La La Land)"],
      worldNotes: ["Titanic ballroom", "LA jazz club"],
      plotBeats: ["A dance under the stars", "A love letter is found"],
    },
  },
  {
    id: "sci-fi",
    label: "Sci‑Fi",
    emoji: "🚀",
    description: "Tech futures, strange worlds, bold exploration. Inspired by Star Wars, Star Trek, and Blade Runner.",
    patch: {
      stylePreset: "hard-sci-fi",
      toneHints: ["curious", "precise", "awe"],
      themes: ["Discovery", "Ethics", "Adaptation"],
      characters: [
        "Dr. Rhea Kade, exoplanet biologist",
        "Unit K-17, a curious probe",
        "Spock, science officer (Star Trek)",
        "Deckard, blade runner (Blade Runner)"
      ],
      worldNotes: [
        "Tidal-locked planet with twilight cities",
        "Signal blooms that grow like coral",
        "The Millennium Falcon (Star Wars)",
        "Neon-lit cityscape (Blade Runner)"
      ],
      plotBeats: ["A bio-signal matches Earth's prehistory"],
      canonFacts: ["K-17 is learning to want, against spec"],
    },
    examples: {
      characters: ["Spock", "Deckard", "Leia Organa"],
      worldNotes: ["Millennium Falcon", "Blade Runner city"],
      plotBeats: ["A droid discovers emotion", "A spaceship lands on a forbidden planet"],
    },
  },
  {
    id: "fantasy",
    label: "Fantasy",
    emoji: "⚔️",
    description: "Magic, quests, heroes, and ancient prophecies. Inspired by Harry Potter, The Witcher, and Zelda.",
    patch: {
      stylePreset: "fantasy",
      toneHints: ["heroic", "mystical", "lyrical"],
      themes: ["Destiny", "Courage", "Balance"],
      characters: [
        "Ari, a reluctant mage",
        "Seren, a lanternbound spirit",
        "Geralt of Rivia (The Witcher)",
        "Link, hero of Hyrule (Zelda)",
        "Hermione Granger (Harry Potter)"
      ],
      worldNotes: [
        "A misty archipelago connected by sky-bridges",
        "Runes stitched into sails",
        "Hogwarts castle (Harry Potter)",
        "Kaer Morhen fortress (The Witcher)",
        "Lost Woods (Zelda)"
      ],
      plotBeats: ["Ari discovers an old map etched into glass"],
      canonFacts: ["Lanterns glow brighter in the presence of true names"],
    },
    examples: {
      characters: ["Geralt", "Hermione", "Link"],
      worldNotes: ["Hogwarts", "Kaer Morhen", "Lost Woods"],
      plotBeats: ["A magical duel begins", "A prophecy is fulfilled"],
    },
  },
]

export const getTemplateById = (id: TemplateId) => TEMPLATES.find((t) => t.id === id)
